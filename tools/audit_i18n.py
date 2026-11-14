"""Audit des traductions : chaînes françaises affichables de src/ sans entrée I18N_EN.

Usage :
    python tools/audit_i18n.py            liste des manques (fichier:ligne  chaîne)
    python tools/audit_i18n.py --count    nombre de manques seulement
    python tools/audit_i18n.py --json     manques au format JSON (pour les traiter)

Ce qui est extrait :
  - HTML (src/00-head.html, src/html/*.html) : textes, attributs title, placeholder,
    aria-label, alt, data-tip, value des boutons ;
  - JS (src/js/*.js) : littéraux '…', "…" et gabarits `…` (missions, NEWS, toast,
    confirm, contenu SVG…). Dans un gabarit, les balises découpent le texte comme
    dans le navigateur ; une interpolation ${…} au milieu d'un texte compte comme
    un trou (nombre {0} ou entité {e0} à l'exécution).

Règles de correspondance (celles de la couche runtime, voir src/js/01-i18n.js) :
  - la chaîne, sans espaces de bord, est une clé ; ou
  - les nombres deviennent {0}, {1}… et les entités {e0}… : un trou de la clé
    peut couvrir un nombre, une interpolation ou un libellé ;
  - une phrase en plusieurs segments « · » est traduite segment par segment.

Exclusions : DTX (visite de la démo, table FR/EN propre, vérifiée à part : mêmes
clés en fr et en en), I18N_EN lui-même, commentaires, chaînes sans mot français
(code, CSS, clés internes), lignes marquées « i18n-ok » en commentaire.
Le script est une aide : un « manque » peut être une chaîne jamais affichée ; le
passage dans le navigateur en anglais (I18N.miss) complète l'audit.
"""
import html.parser
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
HOLE = "§"  # trou : interpolation ou nombre

FR_WORDS = set("""le la les l un une des du de d au aux et ou pour avec dans sur sous ton ta tes
mon ma mes son sa ses ce cet cette ces est sont pas plus moins qui que quoi quand où chaque
tout tous toute toutes rien aucun aucune nouveau nouvelle nouvelles nouveaux ici déjà encore
entre par en à y te tu toi je j il elle on nous vous ne n s qu c""".split())
FR_ACC = re.compile(r"[àâäçéèêëîïôöùûüÿœæÀÂÇÉÈÊËÎÏÔÖÙÛÜŒ]")
NUM = re.compile(r"[+−-]?\d+(?:[\s  .,]\d+)*(?:\s?(?:€|%))?")


def load_dict():
    s = (SRC / "js" / "00-i18n-dico.js").read_text(encoding="utf-8")
    i = s.index("const I18N_EN=") + len("const I18N_EN=")
    return json.loads(s[i:s.rindex("}") + 1])


def is_french(t):
    if not re.search(r"[A-Za-zÀ-ÿ]", t) or t.startswith("/*") or "*/" in t:
        return False
    if re.fullmatch(r"[\w.\-#:\[\]=>*+()$/'\"]+", t) and not FR_ACC.search(t) and not re.match(r"[A-ZÉ][a-zé]", t):
        return False  # identifiant, sélecteur, clé interne
    if re.search(r"[{};]|=>|\b(?:function|return|const|let|var)\b|\$\(|\.(?:on\w+|style|innerHTML)\b", t.replace(HOLE, "")):
        return False  # code
    if re.fullmatch(r"[\w\s.:%,#()\-]+", t) and re.search(r"\b(?:px|rem|em|var|rgba?|flex|grid|solid|none|auto)\b", t):
        return False  # CSS
    words = re.findall(r"[a-zà-ÿœ]+", t.lower())
    if FR_ACC.search(t):
        return True
    if any(w in FR_WORDS for w in words) and len(words) >= 2:
        return True
    return bool(re.fullmatch(r"[A-ZÉÀ][a-zà-ÿ'’]+(?: [a-zà-ÿ'’]+)*", t.strip())) and len(t.strip()) > 3


class Html(html.parser.HTMLParser):
    ATTRS = ("title", "placeholder", "aria-label", "alt", "data-tip")

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.stack, self.noi = [], [], 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        void = tag in ("br", "img", "input", "hr", "meta", "link", "source", "col", "wbr", "path", "circle", "rect", "line", "polyline", "polygon", "ellipse", "stop", "use")
        if not void:
            self.stack.append((tag, "data-noi18n" in a))
            if "data-noi18n" in a:
                self.noi += 1
        if self.noi:
            return
        for k in self.ATTRS:
            if a.get(k):
                self.out.append((self.getpos()[0], a[k]))
        if tag == "input" and a.get("type") in ("button", "submit") and a.get("value"):
            self.out.append((self.getpos()[0], a["value"]))

    def handle_endtag(self, tag):
        while self.stack:
            t, n = self.stack.pop()
            if n:
                self.noi -= 1
            if t == tag:
                break

    def handle_data(self, data):
        if self.noi or (self.stack and self.stack[-1][0] in ("script", "style", "textarea", "code", "pre")):
            return
        if data.strip():
            self.out.append((self.getpos()[0], data))


def html_texts(src, line0=1):
    p = Html()
    try:
        p.feed(src)
        p.close()
    except Exception:
        pass
    return [(line0 + ln - 1, t) for ln, t in p.out]


def js_literals(s):
    """Rend [(ligne, texte, est_gabarit)] ; les ${…} d'un gabarit deviennent HOLE, leurs littéraux sont rendus aussi."""
    out, i, n = [], 0, len(s)
    line = lambda k: s.count("\n", 0, k) + 1
    prev = ""

    def template(k):
        buf, k = [], k + 1
        start = k
        while k < n:
            c = s[k]
            if c == "\\":
                buf.append({"n": "\n", "t": "\t"}.get(s[k + 1], s[k + 1])); k += 2; continue
            if c == "`":
                return "".join(buf), k + 1, start
            if c == "$" and s[k + 1:k + 2] == "{":
                depth, k = 1, k + 2
                inner_start = k
                while k < n and depth:
                    if s[k] in "'\"`":
                        k = skip_str(k)
                        continue
                    if s[k] == "{": depth += 1
                    elif s[k] == "}": depth -= 1
                    k += 1
                out.extend(sub(s[inner_start:k - 1], inner_start))
                buf.append(HOLE)
                continue
            buf.append(c); k += 1
        return "".join(buf), k, start

    def skip_str(k):
        q = s[k]
        if q == "`":
            return template(k)[1]
        k += 1
        while k < n and s[k] != q:
            k += 2 if s[k] == "\\" else 1
        return k + 1

    def sub(code, off):
        res = js_literals(code)
        base = line(off) - 1
        return [(base + l, t, g) for l, t, g in res]

    while i < n:
        c = s[i]
        if c == "/" and s[i + 1:i + 2] == "/":
            i = s.find("\n", i); i = n if i < 0 else i; continue
        if c == "/" and s[i + 1:i + 2] == "*":
            i = s.find("*/", i + 2); i = n if i < 0 else i + 2; continue
        if c == "/" and re.search(r"[=(,:!&|?{};\[]\s*$|return\s*$|^\s*$", prev[-12:]):
            # littéral d'expression régulière
            k = i + 1; cls = False
            while k < n and s[k] != "\n":
                if s[k] == "\\": k += 2; continue
                if s[k] == "[": cls = True
                elif s[k] == "]": cls = False
                elif s[k] == "/" and not cls: break
                k += 1
            prev += s[i:k + 1]; i = k + 1; continue
        if c in "'\"":
            k = i + 1; buf = []
            while k < n and s[k] != c:
                if s[k] == "\\":
                    e = s[k + 1]
                    buf.append({"n": "\n", "t": "\t"}.get(e, e)); k += 2; continue
                buf.append(s[k]); k += 1
            out.append((line(i), "".join(buf), False)); i = k + 1; prev += "x"; continue
        if c == "`":
            txt, k, st = template(i)
            out.append((line(i), txt, True)); i = k; prev += "x"; continue
        if not c.isspace():
            prev = (prev + c)[-40:]
        i += 1
    return out


def split_display(text):
    """Découpe un littéral comme le navigateur : texte entre balises + attributs traduits."""
    if "<" in text and re.search(r"</?[a-zA-Z][^<>]*>", text):
        res = []
        for m in re.finditer(r"""\b(title|placeholder|aria-label|alt|data-tip)=(["'])(.*?)\2""", text):
            res.append(m.group(3))
        txt = re.sub(r"<(script|style)\b.*?</\1>", " ", text, flags=re.S)
        for part in re.split(r"<[^<>]*>", txt):
            res.append(part)
        return res
    return [text]


def clean(t):
    import html as h
    t = h.unescape(t)
    return re.sub(r"\s+", " ", t).strip()


def blank_dead_steps(s):
    """Étapes de WS absentes de WZ (parcours de démarrage) : jamais affichées, ignorées."""
    m = re.search(r"const WZ=\[([^\]]*)\]", s)
    if not m or "const WS={" not in s:
        return s
    live = set(re.findall(r"'(\w+)'", m.group(1)))
    L = s.split("\n")
    i = next(n for n, l in enumerate(L) if l.startswith("const WS={"))
    dead = False
    for n in range(i + 1, len(L)):
        if re.match(r"^(?:const|function|let|/\*|\};)", L[n]):
            break
        st = re.match(r"^ (\w+):\(\)=>", L[n])
        if st:
            dead = st.group(1) not in live
        if dead:
            L[n] = ""
    return "\n".join(L)


def load_ok():
    p = ROOT / "tools" / "audit_i18n_ok.txt"
    ok = set()
    if p.exists():
        for l in p.read_text(encoding="utf-8").split("\n"):
            t = l.split("\t#")[0].strip()
            if t and not l.startswith("# ") and l.strip() != "#":
                ok.add(t)
    return ok


def candidates():
    C = []
    head = (SRC / "00-head.html").read_text(encoding="utf-8")
    m = re.search(r"<title>(.*?)</title>", head)
    if m:
        C.append(("src/00-head.html", head[:m.start()].count("\n") + 1, m.group(1)))
    for f in sorted((SRC / "html").glob("*.html")):
        for ln, t in html_texts(f.read_text(encoding="utf-8")):
            C.append((f"src/html/{f.name}", ln, t))
    for f in sorted((SRC / "js").glob("*.js")):
        if f.name == "00-i18n-dico.js":
            continue
        s = f.read_text(encoding="utf-8")
        a = s.find("const DTX={")
        if a >= 0:  # DTX : table FR/EN propre, hors I18N_EN
            b = s.index("\nconst DT=", a)
            s = s[:a] + "\n" * s.count("\n", a, b) + s[b:]
        if f.name.startswith("10-"):
            s = blank_dead_steps(s)
        lines = s.split("\n")
        for ln, t, g in js_literals(s):
            if "i18n-ok" in lines[ln - 1]:
                continue
            for part in split_display(t):
                for x in part.split("\n"):  # alert/confirm/prompt : traduits ligne par ligne
                    C.append((f"src/js/{f.name}", ln, x))
    return C


class Matcher:
    """Un trou {N} de la clé couvre un nombre ; {eN} couvre un libellé court (type, compétence,
    personne) ; l'un ou l'autre couvre une interpolation ${…} de la source (HOLE)."""
    TN = r"(?:§|[+−-]?\d[\d\s.,  ]*(?:\s?(?:€|%))?)"
    TE = r"(?:§|[^.!?§]{1,60}?)"

    def __init__(self, D):
        self.D = D
        self.pat = []
        for k in D:
            if re.search(r"\{e?\d+\}", k):
                rx = "".join(self.TE if p.startswith("{e") else self.TN if re.fullmatch(r"\{\d+\}", p) else re.escape(p)
                             for p in re.split(r"(\{e?\d+\})", k))
                self.pat.append((k, re.compile(rx + "$", re.S)))

    def ok(self, t):
        if t in self.D:
            return True
        tn = NUM.sub(HOLE, t)
        V = {t, tn}
        if HOLE in tn:  # trous d'accord (pluriel « saisie${n>1?'s':''} ») et trous facultatifs en bord
            v = re.sub(f"(?<=[\\wé·]){HOLE}", "", tn)
            v = re.sub(f"{HOLE}+", HOLE, v)
            V |= {v, v.strip(HOLE + " "), re.sub(f"\\s*{HOLE}\\s*$", "", v)}
        if any(x in self.D for x in V):
            return True
        for _, rx in self.pat:
            if any(rx.match(x) for x in V):
                return True
        lit = tn.split(HOLE)
        if len(lit) > 1 and len(lit[0]) >= 20 and sum(map(len, lit)) >= 40:
            # long texte avec un trou rempli par du texte (variante ?cite=1, etc.) : clé de même début
            rx = re.compile(".{1,300}?".join(map(re.escape, lit)) + "$", re.S)
            if any(k.startswith(lit[0][:30]) and rx.match(k) for k in self.D):
                return True
        if " · " in t:
            return all(self.ok(p.strip()) for p in t.split(" · ") if is_french(p))
        return False


def check_dtx():
    s = (SRC / "js" / "04-stockage-fusion-export.js").read_text(encoding="utf-8")
    a = s.index("const DTX={")
    b = s.index("\nconst DT=", a)
    body = s[a:b]
    fr = body[body.index("fr:{"):body.index("\nen:{")]
    en = body[body.index("\nen:{"):]
    key = re.compile(r"[{,]\s*(\w+):(?=['\"`\[{(])")  # clé suivie directement de sa valeur
    kf = set(key.findall(fr))
    ke = set(key.findall(en))
    return sorted(kf - ke), sorted(ke - kf)


def main():
    D = load_dict()
    M = Matcher(D)
    OK = load_ok()
    miss, seen = [], set()
    for f, ln, t in candidates():
        t = clean(t)
        if not t or not is_french(t):
            continue
        core = t.strip(" :·–—-•→←↑↓✓✕×+")
        if not core or (core, f) in seen:
            continue
        seen.add((core, f))
        if M.ok(t) or M.ok(core) or t in OK:
            continue
        miss.append({"file": f, "line": ln, "text": t})
    dfr, den = check_dtx()
    if "--json" in sys.argv:
        print(json.dumps({"missing": miss, "dtx_fr_only": dfr, "dtx_en_only": den}, ensure_ascii=False, indent=1))
    elif "--count" in sys.argv:
        print(len(miss))
    else:
        for m in miss:
            print(f"{m['file']}:{m['line']}  {m['text']}")
        print(f"\n{len(miss)} chaîne(s) sans traduction ; DTX : {len(dfr)} clé(s) FR seule(s), {len(den)} clé(s) EN seule(s)")
        if dfr or den:
            print("DTX FR seul :", dfr, " EN seul :", den)
    sys.exit(1 if miss or dfr or den else 0)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
