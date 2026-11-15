"""Problématiques multiples dans les carnets de démonstration (FR et EN), v3.3.0.

Donne deux problématiques à quelques personnes existantes, au format de la 3.3.0 :
la liste dans « probls », sa copie texte « A; B » dans « probl » (lue par les
versions antérieures). Tous les noms sont fictifs.

Relançable sans effet de bord : les valeurs sont écrites telles quelles à chaque passage.

Usage :
    python tools/demo_probls.py
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
FILES = {"fr": ROOT / "app" / "carnet-demo.json", "en": ROOT / "app" / "carnet-demo-en.json"}

# problématique : clé -> (fr, en) ; les libellés existants de la démo sont repris tels quels
PRB = {
    "poste": ("Prise de poste", "New role"),
    "lead": ("Leadership", "Leadership"),
    "conf": ("Confiance en soi", "Self-confidence"),
    "conflits": ("Gestion des conflits", "Conflict management"),
    "legit": ("Légitimité", "Legitimacy"),
}

# identifiant de personne -> problématiques, dans l'ordre d'affichage
MULTI = {
    0: ["poste", "conf"],        # Julien / James BERTRAND
    1: ["lead", "legit"],        # Sophie LEMAIRE
    5: ["poste", "legit"],       # Nadia BENALI
    8: ["conflits", "lead"],     # Antoine / Anthony DUBOIS
}


def main():
    for lang, path in FILES.items():
        i = 0 if lang == "fr" else 1
        d = json.loads(path.read_text(encoding="utf-8"))
        for pid, keys in MULTI.items():
            p = next(p for p in d["personnes"] if p["id"] == pid)
            L = [PRB[k][i] for k in keys]
            p["probls"] = L
            p["probl"] = "; ".join(L)
        path.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8", newline="\n")
        print(f"{path.relative_to(ROOT)} : {len(MULTI)} personnes à plusieurs problématiques")


if __name__ == "__main__":
    main()
