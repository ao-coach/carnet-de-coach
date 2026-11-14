"""Régénère les captures du site (assets/*-fr.jpg, assets/*-en.jpg) depuis le carnet de démonstration.

Usage :
    python tools/captures.py              toutes les captures, FR et EN
    python tools/captures.py dash reseau  seulement celles-ci
    python tools/captures.py --check      affiche les dimensions des captures existantes

Fonctionnement (Python standard, sans dépendance) :
  - sert le dépôt sur un port local libre ;
  - lance Microsoft Edge sans fenêtre (--headless) avec un profil vierge et le protocole
    DevTools (--remote-debugging-port), piloté par un petit client WebSocket ;
  - ouvre app/index.html?demo=1&lang=fr|en&shot=<clé> : le carnet de démonstration se met
    dans l'état voulu (onglet, mode, fenêtre ouverte ; voir SHOTS dans
    src/js/04-stockage-fusion-export.js) puis pose html[data-shot=ready] ;
  - ajuste la largeur de la fenêtre pour que l'élément visé ait la largeur cible, puis
    enregistre la zone en JPEG (qualité QUALITE), à l'échelle 1.

Chemin d'Edge : variable d'environnement EDGE, sinon recherche dans Program Files.
"""
import base64
import functools
import glob
import http.server
import json
import os
import pathlib
import random
import shutil
import socket
import struct
import subprocess
import sys
import tempfile
import threading
import time
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
QUALITE = 80

# nom : clé shot, largeur de fenêtre de départ, hauteur de fenêtre, zone (sélecteur CSS ou None = fenêtre),
#       taille cible (largeur, hauteur ; None = taille naturelle de l'élément, hauteur plafonnée à hmax) ;
#       fit=False : la fenêtre n'est pas ajustée, la zone est recadrée depuis le coin haut gauche de l'élément ;
#       scale : échelle de l'image (2 = deux fois plus de pixels, pour un élément petit affiché en grand)
CAPTURES = {
    "dash":     dict(shot="dash", vw=1392, vh=758, sel="main", w=1300, h=758),
    "log":      dict(shot="log", vw=1300, vh=1000, sel="#ov .modal", w=None, h=610),
    "coach":    dict(shot="coach", vw=1300, vh=1100, sel="#coFiche", w=1200, h=1012),
    "practice": dict(shot="practice", vw=1300, vh=900, sel="#pd > .card", w=1100, h=509),
    "pipeline": dict(shot="pipeline", vw=1392, vh=900, sel="#ppPipe", w=900, h=491, fit=False),
    "funnel":   dict(shot="funnel", vw=1400, vh=900, sel="#bizBox .bzf", w=None, h=None, scale=2),
    "reseau":   dict(shot="reseau", vw=1400, vh=900, sel="#reseau .netcard", w=None, h=None, hmax=760),
    "xp":       dict(shot="xp", vw=1300, vh=1000, sel="#pdXpCard", w=1100, h=None, hmax=700),
}


def edge_path():
    if os.environ.get("EDGE"):
        return os.environ["EDGE"]
    pats = [r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
            r"C:\Program Files (x86)\Microsoft\EdgeCore\*\msedge.exe"]
    for p in pats:
        hits = sorted(glob.glob(p))
        if hits:
            return hits[-1]
    w = shutil.which("msedge")
    if w:
        return w
    sys.exit("Edge introuvable : définir la variable d'environnement EDGE")


def free_port():
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    p = s.getsockname()[1]
    s.close()
    return p


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


class Server(http.server.ThreadingHTTPServer):
    def handle_error(self, request, client_address):
        pass  # connexions coupées par Edge entre deux pages : sans conséquence


def serve():
    port = free_port()
    h = functools.partial(Quiet, directory=str(ROOT))
    srv = Server(("127.0.0.1", port), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, port


class WS:
    """Client WebSocket minimal (texte, sans extension), suffisant pour le protocole DevTools."""

    def __init__(self, url):
        assert url.startswith("ws://")
        hostport, path = url[5:].split("/", 1)
        host, port = hostport.split(":")
        self.s = socket.create_connection((host, int(port)))
        key = base64.b64encode(os.urandom(16)).decode()
        self.s.sendall((f"GET /{path} HTTP/1.1\r\nHost: {hostport}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n"
                        f"Sec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n").encode())
        buf = b""
        while b"\r\n\r\n" not in buf:
            buf += self.s.recv(4096)
        if b" 101 " not in buf.split(b"\r\n")[0]:
            raise RuntimeError(buf[:200])
        self.rest = buf.split(b"\r\n\r\n", 1)[1]
        self.n = 0

    def _recv(self, k):
        while len(self.rest) < k:
            d = self.s.recv(1 << 20)
            if not d:
                raise RuntimeError("connexion fermée")
            self.rest += d
        out, self.rest = self.rest[:k], self.rest[k:]
        return out

    def send(self, text):
        data = text.encode()
        head = bytearray([0x81])
        n = len(data)
        if n < 126:
            head.append(0x80 | n)
        elif n < 65536:
            head += bytes([0x80 | 126]) + struct.pack(">H", n)
        else:
            head += bytes([0x80 | 127]) + struct.pack(">Q", n)
        mask = os.urandom(4)
        self.s.sendall(bytes(head) + mask + bytes(b ^ mask[i % 4] for i, b in enumerate(data)))

    def recv(self):
        msg = b""
        while True:
            b0, b1 = self._recv(2)
            n = b1 & 0x7F
            if n == 126:
                n = struct.unpack(">H", self._recv(2))[0]
            elif n == 127:
                n = struct.unpack(">Q", self._recv(8))[0]
            data = self._recv(n)
            op = b0 & 0x0F
            if op in (0x1, 0x0, 0x2):
                msg += data
                if b0 & 0x80:
                    return msg.decode()
            # ping / pong / close : ignorés

    def call(self, method, **params):
        self.n += 1
        mid = self.n
        self.send(json.dumps({"id": mid, "method": method, "params": params}))
        while True:
            r = json.loads(self.recv())
            if r.get("id") == mid:
                if "error" in r:
                    raise RuntimeError(f"{method} : {r['error']}")
                return r.get("result", {})


def js(ws, expr):
    r = ws.call("Runtime.evaluate", expression=expr, returnByValue=True, awaitPromise=True)
    if "exceptionDetails" in r:
        raise RuntimeError(r["exceptionDetails"].get("text", "erreur JS") + " : " + expr[:80])
    return r.get("result", {}).get("value")


def wait(ws, expr, t=30):
    t0 = time.time()
    while time.time() - t0 < t:
        try:
            if js(ws, expr):
                return
        except RuntimeError:
            pass
        time.sleep(0.25)
    raise RuntimeError("délai dépassé : " + expr)


RECT = """(()=>{const e=document.querySelector(%s);if(!e)return null;const r=e.getBoundingClientRect();
return {x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height}})()"""


def shoot(ws, port, name, cfg, lang):
    vw, vh = cfg["vw"], cfg["vh"]
    url = f"http://127.0.0.1:{port}/app/index.html?demo=1&lang={lang}&shot={cfg['shot']}"
    prev = None
    for _ in range(4):
        ws.call("Emulation.setDeviceMetricsOverride", width=vw, height=vh, deviceScaleFactor=1, mobile=False)
        ws.call("Storage.clearDataForOrigin", origin=f"http://127.0.0.1:{port}", storageTypes="all")
        ws.call("Page.navigate", url=url)
        wait(ws, "document.documentElement.dataset.shot==='ready'", 40)
        if not cfg["sel"]:
            clip = dict(x=0, y=0, width=cfg["w"], height=cfg["h"])
            break
        r = js(ws, RECT % json.dumps(cfg["sel"]))
        if not r:
            raise RuntimeError(f"{name} : élément introuvable {cfg['sel']}")
        fixed = prev is not None and round(r["w"]) == prev  # largeur indépendante de la fenêtre (fenêtre modale…)
        if cfg["w"] and round(r["w"]) != cfg["w"] and not fixed and cfg.get("fit", True):
            prev = round(r["w"])
            vw += cfg["w"] - round(r["w"])
            continue
        w = min(cfg["w"], round(r["w"])) if cfg["w"] else round(r["w"])
        h = cfg["h"] or min(round(r["h"]), cfg.get("hmax", 10 ** 4))
        clip = dict(x=round(r["x"]), y=round(r["y"]), width=w, height=h)
        break
    else:
        raise RuntimeError(f"{name} : largeur cible non atteinte")
    res = ws.call("Page.captureScreenshot", format="jpeg", quality=QUALITE, captureBeyondViewport=True,
                  clip=dict(clip, scale=cfg.get("scale", 1)))
    out = ASSETS / f"{name}-{lang}.jpg"
    out.write_bytes(base64.b64decode(res["data"]))
    k = cfg.get("scale", 1)
    print(f"{out.relative_to(ROOT)}  {clip['width'] * k}×{clip['height'] * k}  {out.stat().st_size // 1024} Ko  (fenêtre {vw}×{vh})")


def jpeg_size(p):
    b = p.read_bytes()
    i = 2
    while i < len(b):
        m, L = b[i + 1], struct.unpack(">H", b[i + 2:i + 4])[0]
        if m in (0xC0, 0xC1, 0xC2):
            h, w = struct.unpack(">HH", b[i + 5:i + 9])
            return w, h
        i += 2 + L


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    if "--check" in sys.argv:
        for p in sorted(ASSETS.glob("*.jpg")):
            print(p.name, "%d×%d" % jpeg_size(p), p.stat().st_size // 1024, "Ko")
        return
    names = [a for a in sys.argv[1:] if not a.startswith("-")] or list(CAPTURES)
    srv, port = serve()
    dbg = free_port()
    prof = tempfile.mkdtemp(prefix="cdc-captures-")
    edge = subprocess.Popen([edge_path(), "--headless=new", f"--remote-debugging-port={dbg}", f"--user-data-dir={prof}",
                             "--no-first-run", "--hide-scrollbars", "--force-device-scale-factor=1",
                             "--disable-extensions", "--lang=fr-FR", "about:blank"],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(80):
            try:
                tabs = json.load(urllib.request.urlopen(f"http://127.0.0.1:{dbg}/json/list", timeout=1))
                page = next(t for t in tabs if t.get("type") == "page")
                break
            except Exception:
                time.sleep(0.25)
        else:
            sys.exit("Edge ne répond pas")
        ws = WS(page["webSocketDebuggerUrl"])
        ws.call("Page.enable")
        ws.call("Runtime.enable")
        for n in names:
            for lang in ("fr", "en"):
                shoot(ws, port, n, CAPTURES[n], lang)
    finally:
        edge.terminate()
        try:
            edge.wait(10)
        except Exception:
            edge.kill()
        srv.shutdown()
        shutil.rmtree(prof, ignore_errors=True)


if __name__ == "__main__":
    main()
