"""Complète les carnets de démonstration (FR et EN) pour l'onglet Réseau (v2.5.0).

Ajoute 10 contacts réseau fictifs (identifiants 20 à 29) et leurs rencontres
réseau (identifiants de saisie 9001 et suivants), et donne des cercles,
publics et problématiques explicites à quelques personnes existantes.
Tous les noms sont fictifs.

Relançable sans effet de bord : les personnes 20 à 29 et les saisies 9001+
sont retirées puis ajoutées à nouveau.

Usage :
    python tools/demo_reseau.py
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
FILES = {"fr": ROOT / "app" / "carnet-demo.json", "en": ROOT / "app" / "carnet-demo-en.json"}

# cercles : clé -> (fr, en)
C = {
    "club": ("Club d'entrepreneurs", "Entrepreneurs club"),
    "anciens": ("Réseau d'anciens collègues", "Former colleagues network"),
    "rh": ("Conférence RH", "HR conference"),
    "ecole": ("École de coaching", "Coaching school"),
    "fede": ("Fédération de coachs", "Coaching federation"),
    "parents": ("Association de parents d'élèves", "Parents' association"),
    "course": ("Club de course à pied", "Running club"),
    "cowork": ("Coworking du centre-ville", "Town-centre coworking"),
}
PUB = {"mgr": ("Managers de proximité", "Front-line managers"), "dir": ("Dirigeants", "Executives")}
PRB = {"poste": ("Prise de poste", "New role"), "lead": ("Leadership", "Leadership"),
       "equi": ("Équilibre pro / perso", "Work-life balance")}

# 10 contacts réseau : id, nom fr, nom en, titre fr, titre en, cercles, proximité, rythme,
# public, problématique, reco_par (pid, mode), notes fr/en, sujet fr/en, rencontres [(date, durée, com fr, com en)]
NEW = [
    (20, "Élise MARCHAND", "Elise MARCHAND", "Gérante, librairie indépendante", "Manager, independent bookshop",
     ["club", "parents"], "regulier", 3, "dir", None, (13, "presente"),
     ("Présentée par Hugo. Deux enfants dans l'école de Pauline.\nPense à ouvrir une deuxième boutique.",
      "Introduced by Hugo. Two children at Pauline's school.\nThinking of opening a second shop."),
     ("Sa deuxième boutique : le projet avance ?", "Her second shop: is the project moving?"),
     [("2026-03-12", 60, "Café après la réunion du club. Beaucoup d'énergie, peu de temps pour elle.",
       "Coffee after the club meeting. Lots of energy, little time for herself."),
      ("2026-06-20", 45, "Kermesse de l'école : on a reparlé de son projet de boutique.",
       "School fair: we talked about her shop project again.")]),
    (21, "Olivier BRUN", "Oliver BROWN", "Directeur commercial, PME industrielle", "Sales director, industrial SME",
     ["anciens", "course"], "proche", 1, "mgr", "lead", None,
     ("Ancien collègue, on court ensemble le dimanche.", "Former colleague, we run together on Sundays."),
     ("", ""),
     [("2026-09-28", 60, "Sortie longue du dimanche. Il manage une équipe qui a doublé en un an.",
       "Long Sunday run. He manages a team that doubled in a year."),
      ("2026-10-26", 60, "Course puis café : il se demande comment déléguer sans tout perdre.",
       "Run then coffee: he wonders how to delegate without losing control.")]),
    (22, "Fanny LEROY", "Fanny LEROY", "Cadre de santé, clinique", "Nurse manager, private clinic",
     ["parents"], "occasionnel", 6, "mgr", "poste", None,
     ("", ""), ("Sa prise de poste de cadre : comment ça se passe ?", "Her new manager role: how is it going?"),
     [("2026-02-05", 30, "Réunion de l'association. Vient d'être nommée cadre.",
       "Association meeting. Just promoted to manager.")]),
    (23, "Yann GUÉRIN", "Ian GUERIN", "Développeur indépendant", "Freelance developer",
     ["cowork"], "regulier", 3, None, None, None,
     ("Voisin de bureau au coworking.", "Desk neighbour at the coworking space."), ("", ""),
     [("2026-09-15", 30, "Déjeuner au coworking.", "Lunch at the coworking space."),
      ("2026-11-03", 30, "Il organise un apéro des indépendants en décembre.",
       "He is organising a freelancers' drinks evening in December.")]),
    (24, "Laura MEUNIER", "Laura MEUNIER", "Responsable RSE, groupe de transport", "CSR manager, transport group",
     ["rh"], "occasionnel", 12, "dir", None, (17, "presente"),
     ("Présentée par Chloé à la conférence RH.", "Introduced by Chloe at the HR conference."), ("", ""),
     [("2026-04-10", 45, "Conférence RH : table ronde sur le management à distance.",
       "HR conference: panel on remote management.")]),
    (25, "Rémi FAVRE", "Remy FAVRE", "Kinésithérapeute", "Physiotherapist",
     ["course"], "proche", 3, None, None, None,
     ("Prépare son premier marathon.", "Training for his first marathon."),
     ("Son marathon de novembre", "His November marathon"),
     [("2026-05-02", 60, "Entraînement du club. M'a parlé de Nicolas, architecte.",
       "Club training session. Told me about Nicholas, an architect."),
      ("2026-07-14", 60, "Course du 14 juillet.", "Bastille Day race.")]),
    (26, "Sandrine BARON", "Sandra BARON", "Coach, en formation de superviseure", "Coach, training as a supervisor",
     ["ecole", "fede"], "regulier", 3, None, None, None,
     ("Même promotion que Margaux.", "Same cohort as Maggie."), ("", ""),
     [("2026-10-02", 90, "Journée de la fédération : atelier sur la posture.",
       "Federation day: workshop on coaching stance.")]),
    (27, "Nicolas ARNAUD", "Nicholas ARNAUD", "Architecte", "Architect",
     ["cowork", "course"], "occasionnel", 3, "dir", None, (25, "reco"),
     ("", ""), ("Le concours qu'il préparait en janvier", "The competition he was preparing in January"),
     [("2026-05-20", 45, "Café au coworking, recommandé par Rémi.", "Coffee at the coworking space, recommended by Remy.")]),
    (28, "Pauline RENAUD", "Pauline RENAUD", "Directrice d'école", "Head teacher",
     ["parents"], "regulier", 6, None, None, None,
     ("", ""), ("", ""),
     [("2026-06-30", 45, "Fin d'année scolaire : une équipe fatiguée, des départs à préparer.",
       "End of school year: a tired team, departures to prepare.")]),
    (29, "Thierry CARON", "Terry CARON", "Président du club d'entrepreneurs", "Chair of the entrepreneurs club",
     ["club"], "proche", 1, "dir", None, None,
     ("Connaît tout le monde au club. Aime présenter les gens entre eux.",
      "Knows everyone at the club. Likes introducing people to each other."),
     ("Lui demander qui, au club, vit une transmission", "Ask him who, at the club, is going through a handover"),
     [("2026-09-04", 60, "Rentrée du club.", "Club's back-to-work meeting."),
      ("2026-10-09", 30, "Appel pour préparer la soirée de décembre.", "Call to prepare the December evening.")]),
]

# cercles, public, problématique explicites pour des personnes existantes (le reste vient de la migration)
EXIST = {
    8: {"cercles": ["club"]},              # Antoine / Anthony DUBOIS
    4: {"cercles": ["anciens"]},           # Thomas GIRAUD
    6: {"cercles": ["club", "cowork"]},    # Vincent ROUX
    15: {"cercles": ["club"]},             # Romain / Roman BLANC
}
EXIST_PUB = {16: ("dir", None), 18: ("dir", None)}


def lang_val(pair, i):
    return pair[i] if pair else None


def main():
    for lang, path in FILES.items():
        i = 0 if lang == "fr" else 1
        d = json.loads(path.read_text(encoding="utf-8"))
        ids = {n[0] for n in NEW}
        d["personnes"] = [p for p in d["personnes"] if p["id"] not in ids]
        d["entrees"] = [e for e in d["entrees"] if e["id"] < 9001]
        for pid, ch in EXIST.items():
            p = next(p for p in d["personnes"] if p["id"] == pid)
            p["cercles"] = [C[k][i] for k in ch["cercles"]]
        for pid, (pu, pr) in EXIST_PUB.items():
            p = next(p for p in d["personnes"] if p["id"] == pid)
            if pu:
                p["public"] = PUB[pu][i]
        eid = 9001
        for (pid, nfr, nen, tfr, ten, cs, prox, ry, pu, pr, reco, notes, sujet, meets) in NEW:
            p = {"id": pid, "nom": nfr if i == 0 else nen, "titre": tfr if i == 0 else ten,
                 "provenance": C[cs[0]][i], "cercles": [C[k][i] for k in cs], "proximite": prox, "rythme": ry}
            if pu:
                p["public"] = PUB[pu][i]
            if pr:
                p["probl"] = PRB[pr][i]
            if reco:
                p["reco_par"] = {"pid": reco[0], "mode": reco[1]}
            if notes[i]:
                p["notes"] = notes[i]
            if sujet[i]:
                p["sujet"] = sujet[i]
            d["personnes"].append(p)
            for (date, dur, cfr, cen) in meets:
                d["entrees"].append({"id": eid, "date": date, "type": "reseau", "dur": dur, "pid": pid,
                                     "com": cfr if i == 0 else cen, "cr": False, "syn": False, "ais": None})
                eid += 1
        path.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8", newline="\n")
        print(f"{path.relative_to(ROOT)} : {len(d['personnes'])} personnes, {len(d['entrees'])} saisies")


if __name__ == "__main__":
    main()
