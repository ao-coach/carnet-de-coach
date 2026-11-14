"""Découpe app/index.html (v2.3.0) en fichiers sources dans src/.

UTILISÉ UNE SEULE FOIS, le 14/11/2026, pour créer src/ à partir du fichier
monolithique. Conservé pour mémoire : ne pas le relancer, les sources de
src/ font désormais foi et app/index.html est reconstruit par tools/build.py.

Le découpage suit les frontières de sections existantes (commentaires
/* ===== */, /* ---------- */ et <!-- ===== -->). Les quatre lignes de
jonction (<style>, </style></head><body>, <script>, </script></body></html>)
ne sont pas dans les fragments : build.py les ajoute.

Usage : python tools/split.py [chemin/vers/index.html]
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

# (fichier, première ligne, dernière ligne), numéros de ligne 1-indexés, inclusifs
PARTS = [
    ("src/00-head.html", 1, 13),                         # licence + <head>
    ("src/css/app.css", 15, 856),                        # contenu du <style>
    ("src/html/10-onglets.html", 858, 1026),             # en-tête, onglets, carnet de route
    ("src/html/20-popups.html", 1027, 1164),             # fenêtres (profil … démarrage)
    ("src/js/00-i18n-dico.js", 1166, 1166),              # const I18N_EN (une ligne)
    ("src/js/01-i18n.js", 1167, 1233),                   # couche de traduction
    ("src/js/02-config-etat.js", 1234, 1361),            # config, utilitaires, état, IndexedDB
    ("src/js/03-chiffrement.js", 1362, 1442),            # Web Crypto, secrets, verrou
    ("src/js/04-stockage-fusion-export.js", 1443, 1721), # stockage, fusion, export/import
    ("src/js/05-indicateurs-saisies-parametres.js", 1722, 2194),  # calculs, KPI, tableau de bord, saisies, paramètres, onglets
    ("src/js/06-personnes.js", 2195, 2499),              # CRM léger, fiche personne, pkOpen, popup saisie
    ("src/js/07-pratique.js", 2500, 2713),               # pratique délibérée
    ("src/js/08-coach-metriques.js", 2714, 3003),        # fiche coach, métriques 1.7.0, mode simplifié
    ("src/js/09-carnet-de-route.js", 3004, 3171),        # missions, célébrations, victoires
    ("src/js/10-demarrage-apropos.js", 3172, 3436),      # parcours de démarrage, ALLAN_PH, À propos
    ("src/js/11-nouveautes.js", 3437, 3633),             # nouveautés, blocs repliables, boot()
]

JUNCTIONS = {
    14: "<style>",
    857: "</style></head><body>",
    1165: "<script>",
    3634: "</script></body></html>",
}


def main():
    for s in (sys.stdout, sys.stderr):
        s.reconfigure(encoding="utf-8")
    src = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "app" / "index.html"
    text = src.read_bytes().decode("utf-8").replace("\r\n", "\n")
    lines = text.split("\n")
    assert lines[-1] == "", "le fichier doit finir par un saut de ligne"
    lines = lines[:-1]
    assert len(lines) == 3634, f"{len(lines)} lignes : découpage prévu pour la v2.3.0 (3634 lignes)"
    for n, expected in JUNCTIONS.items():
        assert lines[n - 1] == expected, f"ligne {n} inattendue : {lines[n - 1][:60]!r}"
    covered = set(JUNCTIONS)
    for name, a, b in PARTS:
        covered.update(range(a, b + 1))
        out = ROOT / name
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(("\n".join(lines[a - 1:b]) + "\n").encode("utf-8"))
        print(f"{name:48} lignes {a}-{b}")
    assert covered == set(range(1, len(lines) + 1)), "lignes non couvertes"


if __name__ == "__main__":
    main()
