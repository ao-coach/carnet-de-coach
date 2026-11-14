"""Reconstruit app/index.html à partir des sources de src/.

Assemblage (ordre des numéros dans chaque dossier) :
    src/00-head.html
    <style>                    + src/css/*.css
    </style></head><body>      + src/html/*.html
    <script>                   + src/js/*.js
    </script></body></html>

Sortie : UTF-8 sans BOM, fins de ligne LF.

Usage :
    python tools/build.py          écrit app/index.html
    python tools/build.py --check  reconstruit en mémoire et compare à
                                   app/index.html (fins de ligne normalisées) ;
                                   code de sortie 1 si différent

Dans les deux cas, avertit si APP_SEMVER ne correspond pas à la version du
CACHE de app/sw.js.
"""
import hashlib
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
OUT = ROOT / "app" / "index.html"
SW = ROOT / "app" / "sw.js"


def read(p):
    data = p.read_bytes()
    if data.startswith(b"\xef\xbb\xbf"):
        sys.exit(f"BOM interdit : {p.relative_to(ROOT)}")
    text = data.decode("utf-8").replace("\r\n", "\n")
    if not text.endswith("\n"):
        sys.exit(f"le fichier doit finir par un saut de ligne : {p.relative_to(ROOT)}")
    return text


def parts(folder, pattern):
    files = sorted((SRC / folder).glob(pattern))
    if not files:
        sys.exit(f"aucun fichier {pattern} dans src/{folder}")
    return "".join(read(f) for f in files)


def build():
    return "".join([
        read(SRC / "00-head.html"),
        "<style>\n", parts("css", "*.css"),
        "</style></head><body>\n", parts("html", "*.html"),
        "<script>\n", parts("js", "*.js"),
        "</script></body></html>\n",
    ]).encode("utf-8")


def check_versions(text):
    m = re.search(r"APP_SEMVER='([^']+)'", text)
    c = re.search(r"CACHE\s*=\s*'suivi-coaching-([^']+)'", SW.read_text(encoding="utf-8"))
    if not m or not c:
        print("attention : APP_SEMVER ou CACHE introuvable", file=sys.stderr)
    elif m.group(1) != c.group(1):
        print(f"attention : APP_SEMVER {m.group(1)} ≠ CACHE de sw.js {c.group(1)}", file=sys.stderr)


def main():
    for s in (sys.stdout, sys.stderr):
        s.reconfigure(encoding="utf-8")
    out = build()
    check_versions(out.decode("utf-8"))
    sha = hashlib.sha256(out).hexdigest()
    if "--check" in sys.argv[1:]:
        current = OUT.read_bytes().replace(b"\r\n", b"\n") if OUT.exists() else b""
        if current != out:
            print(f"DIFFÉRENT : app/index.html ne correspond pas aux sources de src/ (sortie sha256 {sha})")
            print("lancer : python tools/build.py")
            return 1
        print(f"OK : app/index.html identique aux sources (sha256 {sha})")
        return 0
    OUT.write_bytes(out)
    print(f"app/index.html reconstruit : {len(out)} octets, sha256 {sha}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
