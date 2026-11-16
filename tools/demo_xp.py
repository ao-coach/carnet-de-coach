"""Générateur des carnets de démonstration (FR et EN) au format 3.0.0 : XP de pratique.

Part des carnets existants (Camille Martin, personnes, cercles, recommandations,
contacts réseau, saisies, actions : tout est gardé) et produit les données XP :
  - compétence « Facultés commerciales » / « Sales skills » (identifiant fc) ;
  - e.xp de chaque saisie qui rapporte des XP (10 min = 1 XP × multiplicateur fixe :
    séance et conversation ×2, supervision ×3, débrief ×1 ; arrondi au plus proche),
    environ 60 % sur le focus, le reste sur une ou deux autres compétences
    (tirées au hasard, graine = identifiant de la saisie) ;
  - XP de Facultés commerciales (0 à 5) et commentaire sur chaque rencontre réseau,
    invitation et proposition, avec une aisance qui progresse au fil des mois ;
  - deux transferts dans l'historique ;
  - deux saisies récentes laissées à répartir (visibles avec le module compétences) ;
  - tous les modules activés (3.2.0) ;
  - version_schema 4, plus aucune note de 1 à 5 (ni ais, ni ais_v2) ;
  - 3.5.0 : une seule catégorie « Pratique délibérée » (l'ancien objectif « Pratiquer délibérément »
    est renommé, ses actions en cours reçoivent leur action de bibliothèque, comme catPdMerge) ;
  - 3.5.0 : chaque action de la bibliothèque a son action dans le plan (comme planLink) : créées
    ici, plus écrites à la main ;
  - 3.5.0 : expérience d'avant l'outil déclarée pour 2025 (pratique de la certification), volumes par
    année, XP laissés à répartir (comme avSync).
Tous les noms sont fictifs.

Déterministe et relançable : chaque valeur dépend de l'identifiant de la saisie,
jamais des XP déjà présents.

Usage :
    python tools/demo_xp.py
"""
import json
import pathlib
import random

ROOT = pathlib.Path(__file__).resolve().parent.parent
FILES = {"fr": ROOT / "app" / "carnet-demo.json", "en": ROOT / "app" / "carnet-demo-en.json"}

MULT = {"session": 2, "conversation": 2, "supervision": 3, "debrief": 1}
COM = ("reseau", "invitation", "proposition")
FC = {"fr": "Facultés commerciales", "en": "Sales skills"}
FOCUS = "m3"

# commentaires des Facultés commerciales, du plus difficile (0-1) au plus aisé (4-5)
COMS = {
    "fr": {
        "bas": [
            "Difficile de parler de mon métier sans me justifier ; j'ai changé de sujet trop vite.",
            "J'ai hésité à proposer une conversation, j'ai laissé passer le moment.",
            "Mal à l'aise quand on m'a demandé mes tarifs : réponse floue.",
            "Je me suis surtout écouté parler ; peu de questions sur ses enjeux.",
        ],
        "moyen": [
            "Facile de créer le lien ; plus difficile de proposer la suite clairement.",
            "J'ai posé de bonnes questions, mais j'ai trop expliqué le coaching.",
            "L'invitation est sortie naturellement, la relance un peu moins.",
            "À l'aise sur le fond, encore hésitant au moment de conclure.",
        ],
        "haut": [
            "Invitation faite simplement, sans rien vendre : il a dit oui tout de suite.",
            "J'ai annoncé mon prix calmement et laissé le silence faire son travail.",
            "Conversation fluide, curiosité sincère ; la proposition est venue d'elle.",
            "J'ai demandé une recommandation sans gêne : deux noms en retour.",
        ],
    },
    "en": {
        "bas": [
            "Hard to talk about my work without justifying myself; I changed the subject too fast.",
            "I hesitated to offer a conversation and let the moment pass.",
            "Uneasy when asked about my rates: a vague answer.",
            "I mostly listened to myself talk; few questions about their challenges.",
        ],
        "moyen": [
            "Easy to build rapport; harder to suggest a clear next step.",
            "I asked good questions, but over-explained coaching.",
            "The invitation came naturally, the follow-up less so.",
            "At ease on substance, still hesitant when it came to closing.",
        ],
        "haut": [
            "Invitation made simply, without selling anything: an immediate yes.",
            "I stated my price calmly and let the silence do its work.",
            "Smooth conversation, genuine curiosity; the proposal came from them.",
            "I asked for a referral without awkwardness: two names in return.",
        ],
    },
}
TRANSFERTS = {
    "fr": [
        {"id": 1, "date": "2026-03-20", "de": "m1", "vers": "m3", "xp": 20, "motif": "L'atteinte de l'objectif passait surtout par mes questions"},
        {"id": 2, "date": "2026-09-28", "de": "m5", "vers": "m2", "xp": 12, "motif": "Supervision : c'était de l'écoute, pas de la présence"},
    ],
    "en": [
        {"id": 1, "date": "2026-03-20", "de": "m1", "vers": "m3", "xp": 20, "motif": "Reaching the goal came mostly from my questions"},
        {"id": 2, "date": "2026-09-28", "de": "m5", "vers": "m2", "xp": 12, "motif": "Supervision: it was listening, not presence"},
    ],
}


# 3.5.0 : catégorie et lien plan d'action ↔ bibliothèque (mêmes règles que catPdMerge et planLink dans l'application)
PD_OLD = {"fr": "Pratiquer délibérément", "en": "Practise deliberately"}
PCAT = {"fr": "Pratique délibérée", "en": "Deliberate practice"}
L2P = {"cours": "encours", "pause": "pause", "acquise": "realisee"}
LINK_DATE = "2026-10-01"
# 3.5.0 : expérience d'avant l'outil (mêmes clés que l'application : AVK)
AVK = ["h", "delib", "suph", "ses", "conv", "pers", "sup", "inv", "prop", "cli", "ca"]
AVANT = {"2025": {"h": 45, "delib": 20, "suph": 6, "ses": 30, "pers": 6}}


def add_days(s, n):
    import datetime
    return (datetime.date.fromisoformat(s) + datetime.timedelta(days=n)).isoformat()


def cat_pd(lang, d):
    old, lab = PD_OLD[lang], PCAT[lang]
    for p in d["priorites"]:
        if p.get("o") == old:
            p["o"] = lab
    lib = d["pd"]["lib"]
    nc = sum(1 for l in lib if l.get("st") == "cours" and not l.get("horsPlan"))
    for a in d["actions"]:
        if a.get("p") != old:
            continue
        a["p"] = lab
        if a.get("lib") is not None or a.get("s") not in ("encours", "pause"):
            continue
        st = "cours" if a["s"] == "encours" else "pause"
        if st == "cours":
            if nc >= 3:
                st, a["s"] = "pause", "pause"
            else:
                nc += 1
        lid = "cp%s" % a["id"]
        if not any(str(l.get("id")) == lid for l in lib):
            lib.append({"id": lid, "a": a.get("a", ""), "mid": None, "types": ["conversation", "session"], "st": st,
                        "cree": LINK_DATE, "maj": LINK_DATE + "T18:00:00.000Z"})
        a["lib"] = lid
    d["prefs"]["cat_pd"] = 1


def plan_link(lang, d):
    lib = [l for l in d["pd"]["lib"] if l.get("id") is not None]
    ids = {str(l["id"]) for l in lib}
    # actions liées à une action de bibliothèque disparue : retirées
    d["actions"] = [a for a in d["actions"] if a.get("lib") is None or str(a["lib"]) in ids]
    used = {a["id"] for a in d["actions"]}
    for k, l in enumerate(lib):
        if l.get("horsPlan"):
            continue
        st = l.get("st") if l.get("st") in L2P else "pause"
        a = next((x for x in d["actions"] if str(x.get("lib")) == str(l["id"])), None)
        if a is None:
            nid = 101 + k
            while nid in used:
                nid += 1
            used.add(nid)
            a = {"id": nid, "p": PCAT[lang], "a": l.get("a", ""), "d": "", "r": "", "s": L2P[st], "lib": l["id"],
                 "maj": l.get("maj") or LINK_DATE + "T18:00:00.000Z"}
            d["actions"].append(a)
        else:
            a["p"] = PCAT[lang] if a.get("p") not in (PCAT[lang],) else a["p"]
            a["a"] = l.get("a", "")
            a["s"] = L2P[st]


def experience(d):
    ent = sorted(e["date"] for e in d["entrees"])
    a = {"mode": "an", "depuis": min(AVANT), "annees": {y: dict(v) for y, v in AVANT.items()}}
    for k in AVK:
        s = sum(v.get(k, 0) for v in AVANT.values())
        if s:
            a[k] = s
    y = max(AVANT)
    first = next((x for x in ent if x.startswith(y)), None)
    a["date"] = add_days(first, -1) if first else y + "-12-31"
    d["coach"]["avant"] = a


def budget(e):
    return round_half_up((e.get("dur") or 0) / 10) * MULT.get(e["type"], 0)


def round_half_up(x):
    # identique à Math.round en JavaScript pour les valeurs positives
    return int(x + 0.5)


def build(lang, d):
    mets = d["config"]["metriques"]
    if not any(m.get("fc") for m in mets):
        mets.append({"id": "fc", "l": FC[lang], "actif": True, "fc": True, "min": "", "max": ""})
    ids = [m["id"] for m in mets if not m.get("fc") and m.get("actif")]
    d["pd"]["focus"] = [FOCUS]
    E = d["entrees"]
    dates = sorted(e["date"] for e in E)
    d0, d1 = dates[0], dates[-1]
    span = max(1, (int(d1[:4]) - int(d0[:4])) * 12 + int(d1[5:7]) - int(d0[5:7]))
    # deux saisies récentes laissées à répartir (l'une entièrement, l'autre en partie)
    recent = sorted((e for e in E if budget(e) > 0), key=lambda e: (e["date"], e["id"]))[-2:]
    open_ids = {e["id"]: k for k, e in enumerate(recent)}
    for e in E:
        e.pop("ais", None)
        e.pop("ais_v2", None)
        e.pop("xp", None)
        e.pop("fcom", None)
        rnd = random.Random(e["id"] * 7919 + 13)
        if e["type"] in COM:
            # aisance commerciale qui progresse avec les mois
            m = (int(e["date"][:4]) - int(d0[:4])) * 12 + int(e["date"][5:7]) - int(d0[5:7])
            base = 1 + 3 * m / span
            n = max(0, min(5, round_half_up(base + rnd.uniform(-1.3, 1.3))))
            if n:
                e["xp"] = {"fc": n}
            pool = COMS[lang]["bas" if n <= 1 else "moyen" if n <= 3 else "haut"]
            e["fcom"] = pool[rnd.randrange(len(pool))]
            continue
        B = budget(e)
        if not B:
            continue
        if e["id"] in open_ids:
            if open_ids[e["id"]] == 0:
                e["xp"] = {FOCUS: max(1, B // 2)}
            continue
        f = min(B, round_half_up(B * rnd.uniform(0.5, 0.7)))
        others = [k for k in ids if k != FOCUS]
        rnd.shuffle(others)
        others = others[: rnd.choice((1, 2))]
        xp = {FOCUS: f} if f else {}
        rest = B - f
        for i, k in enumerate(others):
            part = rest if i == len(others) - 1 else rest // len(others)
            if part > 0:
                xp[k] = xp.get(k, 0) + part
            rest -= part
        if xp:
            e["xp"] = xp
    d["pd"]["transferts"] = [dict(t, maj=t["date"] + "T18:00:00.000Z") for t in TRANSFERTS[lang]]
    d.setdefault("supprimes", {}).setdefault("t", {})
    d["version_schema"] = 4
    # 3.2.0 : Camille a tous les modules activés (la visite explique le menu « Mon carnet ») ;
    # simple reste écrit, cohérent avec les modules, pour une application plus ancienne
    d.setdefault("prefs", {})["modules"] = {k: True for k in ("coacher", "competences", "activite", "jeu")}
    d["prefs"]["simple"] = False
    cat_pd(lang, d)
    plan_link(lang, d)
    experience(d)
    return d


def main():
    for lang, p in FILES.items():
        d = json.loads(p.read_text(encoding="utf-8"))
        build(lang, d)
        txt = json.dumps(d, ensure_ascii=False, indent=1)
        p.write_bytes(txt.encode("utf-8"))
        E = d["entrees"]
        tot = {}
        for e in E:
            for k, v in (e.get("xp") or {}).items():
                tot[k] = tot.get(k, 0) + v
        for t in d["pd"]["transferts"]:
            tot[t["de"]] -= t["xp"]
            tot[t["vers"]] = tot.get(t["vers"], 0) + t["xp"]
        print(lang, p.name, "saisies avec XP :", sum(1 for e in E if e.get("xp")), "totaux :", tot)


if __name__ == "__main__":
    main()
