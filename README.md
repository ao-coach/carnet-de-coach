# Suivi de pratique de coaching

**Version 3.1.0 (novembre 2026)** · *English version: [README.en.md](README.en.md)* · Outil © 2026 Allan Oudomphong · Licence PolyForm Shield 1.0.0

## À quoi sert ton carnet

**Moins de dispersion, plus de pratique.** Ton carnet t'aide à faire les trois choses qui font de toi un coach, et à les faire en jouant.

1. **Coacher beaucoup.** Marketing, formations, veille : intéressant, mais ça ne remplace pas l'essentiel : rencontrer, coacher, proposer. Ton carnet compte ces heures-là, les met en graphiques et fait monter ta fiche de coach niveau après niveau, comme dans un jeu.
2. **Affûter quelques compétences.** On sort de l'école en sachant beaucoup et en maîtrisant peu. Choisis une ou deux compétences, investis-y chaque séance et ta supervision jusqu'à en faire des automatismes, puis passe aux suivantes. C'est ce qui donne du poids à tout ce que tu as appris.
3. **Créer ton activité par la relation.** Le coaching se vend en coachant. Ton carnet te pousse aux gestes qui créent des rencontres : entretenir ton réseau, inviter, proposer, t'entourer de pairs qui partagent tes défis. Ce qu'on vit souvent comme une épreuve devient un jeu.

*Trente secondes après chaque entretien suffisent.*

---

Un carnet de bord pour piloter ta pratique de coach. Tu y enregistres tes entretiens, tes propositions et les personnes que tu accompagnes, et tu y suis tes indicateurs, tes XP de pratique, ta pratique délibérée, tes objectifs et tes relances.

L'application s'ouvre depuis son adresse web et s'installe sur ton ordinateur comme une application. Il n'y a ni compte à créer ni abonnement. **Tes données ne sont jamais en ligne** : elles restent sur ton ordinateur, dans **un seul fichier** `coaching-data.json`, rangé dans le dossier de ton choix.

- Ce fichier contient tes saisies, tes réglages, ton logo et ton bandeau.
- Il peut être chiffré par un mot de passe.
- Une copie de sécurité en est faite automatiquement dans le sous-dossier `sauvegardes/`.

**Navigateur requis :** Chrome ou Edge sur ordinateur. Firefox, Safari et les mobiles ne savent pas écrire dans un dossier.

**Langue :** français ou anglais. Le bouton **FR / EN**, en haut à droite, change la langue de toute l'application à tout moment ; tes données ne changent pas.

## Sommaire

1. [Mise en route](#1-mise-en-route)
2. [Premier lancement : l'accueil et le carnet de route](#2-premier-lancement--laccueil-et-le-carnet-de-route)
3. [Enregistrer un temps](#3-enregistrer-un-temps)
4. [Pratique délibérée](#4-pratique-délibérée)
5. [Coach : ta fiche](#5-coach--ta-fiche)
6. [Tableau de bord](#6-tableau-de-bord)
7. [Suivi d'activité](#7-suivi-dactivité)
8. [Mes saisies](#8-mes-saisies)
9. [Personnes](#9-personnes)
10. [Propositions et contrats](#10-propositions-et-contrats)
11. [Coûts et taux horaire réel](#11-coûts-et-taux-horaire-réel)
12. [Paramètres](#12-paramètres)
13. [Sécurité et chiffrement](#13-sécurité-et-chiffrement)
14. [Tes données : enregistrement, sauvegardes, récupération](#14-tes-données--enregistrement-sauvegardes-récupération)
15. [Nouveautés et versions](#15-nouveautés-et-versions)
16. [Partager à un pair](#16-partager-à-un-pair)
17. [En cas de souci](#17-en-cas-de-souci)
18. [Licence et usage](#18-licence-et-usage)
19. [Historique des versions](#19-historique-des-versions)
20. [À propos](#20-à-propos)
21. [Comment l'outil est construit](#21-comment-loutil-est-construit)

---

## 1. Mise en route

### Installer l'application (2 minutes, une seule fois)

1. Ouvre **[carnet-de-coach.fr](https://carnet-de-coach.fr)** dans Chrome ou Edge, puis « Ouvrir le carnet ». L'application elle-même est à l'adresse **carnet-de-coach.fr/app/**.
2. Clique sur l'icône **Installer**, à droite de la barre d'adresse : un écran avec une flèche vers le bas. Dans Edge, l'option est aussi dans le menu **⋯ > Applications > Installer ce site en tant qu'application**.
3. L'application apparaît dans ton menu Démarrer, ou dans le Dock et le Launchpad sur Mac. Elle s'ouvre dans sa propre fenêtre et **fonctionne même hors ligne**.

**Icônes.** L'icône de l'application installée (menu Démarrer, barre des tâches, Dock) est la même pour tout le monde. L'icône de l'onglet et de la barre de titre reprend le logo de ton carnet, si tu en as mis un (Paramètres > Apparence).

**Les mises à jour sont automatiques.** Au lancement suivant, une bannière « Nouvelle version disponible » propose de recharger, puis un écran présente les nouveautés (voir la [partie 15](#15-nouveautés-et-versions)).

### Choisir où ranger son carnet

Choisis un dossier sur ton ordinateur, de préférence synchronisé (OneDrive, Google Drive…) : ton carnet te suit alors d'un ordinateur à l'autre, et il est sauvegardé.

- **Tu commences :** clique sur « Commencer ». Le carnet de route te proposera de choisir le dossier, parmi tes premières missions.
- **Tu as déjà un `coaching-data.json` :** à l'accueil, clique sur « J'ai déjà un carnet : ouvrir son dossier ».

Quand le navigateur demande l'accès au dossier, choisis **« Autoriser à chaque visite »** si l'option est proposée. Tu n'auras plus rien à faire aux lancements suivants.

### Changer de langue

Le bouton **FR / EN**, en haut à droite (et le lien « English » de l'accueil), bascule toute l'application en anglais ou en français, instantanément : rien n'est rechargé, et un carnet chiffré reste déverrouillé. Ce choix est propre à chaque ordinateur et navigateur. Par défaut, l'application suit la langue du navigateur.

- Seuls les textes de l'outil sont traduits : tes saisies, tes noms de types, tes compétences restent tels que tu les as écrits.
- Un carnet créé en anglais démarre avec des libellés anglais (types, compétences proposées).
- Le carnet de démonstration existe dans les deux langues.

> Mets ton carnet dans un dossier à toi. Ne le dépose jamais dans un espace public ou partagé avec d'autres personnes.

---

## 2. Premier lancement : l'accueil et le carnet de route

### L'accueil (moins d'une minute)

Un carnet neuf s'ouvre sur quatre écrans :

| Écran | Ce que tu y fais |
|---|---|
| Bienvenue | Une lettre d'accueil. Un lien permet d'importer une sauvegarde ou un modèle transmis par un pair, un autre d'**explorer un carnet de démonstration**. |
| À quoi sert ton carnet | Les trois valeurs du carnet en une page : coacher beaucoup, affûter quelques compétences, créer ton activité par la relation (le texte [en tête de ce manuel](#à-quoi-sert-ton-carnet)). Il reste lisible ensuite en tête de l'onglet À propos. |
| Ton mode | **Simplifié** ou **complet** (voir ci-dessous). |
| Ton identité | Ton nom ou celui de ton cabinet, ton logo, une palette de couleurs. |

« Entrer dans mon carnet » t'amène directement sur l'outil, et la première mission t'est montrée.

La **petite maison**, à gauche des onglets, ouvre le site [carnet-de-coach.fr](https://carnet-de-coach.fr) dans un nouvel onglet. L'écran d'accueil et le parcours complet (nom, logo, couleurs) se rejouent depuis **Paramètres > Parcours de démarrage > Revoir l'accueil** ; « Revenir à mon carnet » te ramène où tu étais, sans reverrouiller le carnet.

### Le carnet de démonstration

« Explorer un carnet de démonstration », à l'accueil, ouvre le carnet de Camille Martin, une coach de managers **fictive** : quatorze mois de pratique, des personnes à toutes les étapes, une fiche de coach remplie. Il s'ouvre en mode simplifié, sur une courte présentation de la démarche suivie d'une visite des pages en onze étapes, treize en mode complet (à suivre ou à passer). Tout se manipule librement. Un bandeau rappelle que c'est une démonstration ; « Revoir la visite » relance la présentation ; « Créer mon propre carnet » la referme et lance l'accueil d'un carnet neuf. Le carnet de démonstration n'est jamais écrit dans un dossier. Il existe en français et en anglais, selon la langue choisie.

### Le carnet de route

Le reste se découvre en l'utilisant. Le **carnet de route**, en bas à droite, propose **une mission à la fois**, en quatre chapitres :

| Chapitre | Missions |
|---|---|
| 1. Premiers pas | Enregistrer ton premier entretien, le relier à une personne, écrire une note, regarder ton suivi d'activité, ouvrir la fiche d'une personne, choisir où ranger ton carnet, le protéger par un mot de passe. |
| 2. Développer ton activité | Comprendre ton pipeline (voir ci-dessous), enregistrer un contact réseau, donner un rythme de contact à une personne, enregistrer une invitation, envoyer une proposition, la suivre jusqu'à la réponse. En mode simplifié : découvrir le mode complet. |
| 3. Pratiquer délibérément | Compléter ton profil de coach, nommer au moins 3 compétences, répartir tes premiers XP, choisir un focus, créer une action, noter une remarque et la retenir pour la supervision, enregistrer une supervision préparée. |
| 4. Piloter | Choisir tes indicateurs, fixer ton objectif prioritaire, renseigner tes coûts. |

- **« Montre-moi »** met en lumière l'endroit où agir, sur le bon onglet.
- Une mission se coche **toute seule** quand tu fais l'action, d'où que tu la fasses.
- Chaque chapitre terminé débloque un haut fait **« Carnet de route : … »**.
- Les missions du mode complet n'apparaissent pas en mode simplifié.
- **Carnet existant** : à la mise à jour, les missions déjà faites sont cochées en silence et le carnet de route reste replié.
- Pour le masquer ou le réafficher : **Paramètres > Parcours de démarrage > Afficher le carnet de route**.

### Créer tes clients par la relation

La mission « Comprendre ton pipeline » ouvre deux pages, qu'on retrouve à tout moment avec le bouton **« ? Les étapes »** de l'onglet Personnes.

1. **L'approche.** On conseille souvent aux coachs les réseaux sociaux, le contenu et le marketing : une voie légitime, avec son prix. Ce carnet suit celle de coachs qui en vivent depuis des années : le coaching se vend par le coaching, et l'on crée ses clients une discussion à la fois. Six principes, chacun avec le type de saisie qui lui correspond : rencontrer chaque jour, aider sans rien attendre, faire vivre le coaching, choisir tes clients, proposer et demander la recommandation, travailler sur un cycle de durée fixée à un prix juste. Avec les repères du carnet pour un contrat signé : environ 13 invitations, 4 personnes en conversation, 10 conversations, 2 propositions.
2. **Les étapes.** Le chemin d'une personne, de la rencontre au contrat, et pour chaque étape **la saisie qui la fait avancer** (voir la [partie 9](#9-personnes)).

Entre les deux, **le socle : entretenir ton réseau.** Rencontrer ne s'arrête pas au premier café : les personnes que tu connais déjà sont ton terrain le plus fertile. Donne à chacune un rythme de contact, et le carnet te la rappelle dans « À relancer » quand c'est le moment ; en mode complet, l'onglet Réseau montre tes cercles, les passerelles entre eux et les groupes à réchauffer.

### Les célébrations

Quand tu franchis un cap, l'outil le salue, avec trois niveaux d'intensité :

- un **bandeau** discret quand une statistique gagne un niveau ;
- une **carte** pour un nouveau niveau global ;
- une **célébration** plein écran pour un haut fait, avec son niveau (Bronze, Argent, Or, Légendaire).

Plusieurs caps franchis d'un coup s'enchaînent, du plus grand au plus petit. Une mission accomplie est signalée par une petite notification du carnet de route. Pour couper les célébrations : **Paramètres > Parcours de démarrage > Célébrations animées**.

### Mode simplifié ou complet

Le bouton **Mode simplifié**, en haut à droite, s'active et se désactive à tout moment. **Rien n'est perdu** : il masque, il n'efface pas. Le mode est enregistré dans ton carnet.

En mode simplifié :

- **Onglets** : Suivi d'activité (l'écran principal), Mes saisies, Personnes, Paramètres. Le tableau de bord, la fiche Coach, la Pratique délibérée et le Réseau sont masqués.
- **Aucune notion d'XP de pratique, d'objectif, d'action ni de coût.** Les XP de tes saisies restent « à répartir », sans aucun signalement, et rien n'est jamais obligatoire.
- **Saisie** : les types sont présentés l'un sous l'autre, avec leur sens (« J'ai proposé à une personne de découvrir le coaching »…), puis tes autres types. Il reste la durée, la personne, « Ce qu'on a vu », les notes sur l'entretien et le suivi (CR, synthèse). Une proposition garde son montant et sa durée d'engagement.
- **Suivi d'activité** : le graphique du temps passé par mois et tes 3 indicateurs principaux (hors XP de pratique, objectifs et coûts).
- **Mes saisies** : identique, sans les colonnes XP ni le coût des supervisions.
- **Personnes** : vue Pipeline seulement, avec « À relancer » au-dessus. La fiche personne n'a plus la proximité, les XP investis, le public ni la problématique.
- **Paramètres** : ton nom, ton logo et une palette de couleurs proposée ; sécurité, stockage, partage et parcours. Les types d'activité, les compétences, les indicateurs, le suivi des personnes et les coûts sont masqués.

---

## 3. Enregistrer un temps

C'est le geste quotidien : après chaque entretien, clique sur **« + Enregistrer un temps »**, en haut à droite. Il faut moins de 30 secondes.

- **Date.** Aujourd'hui par défaut.
- **Type.** Un bouton par type d'activité, dans sa couleur, dans l'ordre du parcours d'un client : **Rencontre réseau › Invitation › Conversation › Proposition › Session › Débrief › Supervision**, puis tes autres types (Annexe…) sur la ligne suivante. **Rencontre réseau** sert à noter un contact de ton réseau (café, événement, appel), le point de départ du parcours. Le type **Invitation** sert à noter chaque fois que tu proposes à quelqu'un une conversation de coaching (sans durée par défaut).
- **Durée.**
  - Des boutons proposent les durées courantes.
  - Le champ « Autre durée » accepte `2,5`, `2.5`, `2h30`, `2h`, `150min` ou `1:30`.
  - Un nombre seul compte en heures jusqu'à 10, en minutes au-delà. Il n'y a pas de plafond.
- **Personne.**
  - Les personnes récentes apparaissent en boutons.
  - Pour une autre personne, tape quelques lettres dans le champ « Rechercher ou créer une personne… » : les noms s'affichent au fil de la frappe, sans tenir compte des accents ni des majuscules. Les débuts de prénom ou de nom passent en premier, puis les personnes vues récemment. Les personnes archivées y figurent aussi, avec la mention « archivée ».
  - Choisis avec la souris, ou avec les flèches puis Entrée. Échap ferme la liste.
  - « + Créer », en bas de la liste, suivi du nom tapé, crée une nouvelle personne.
  - Elle est **obligatoire** pour une rencontre, une invitation, une conversation, une proposition, une séance ou un débrief ; facultative pour une supervision et pour les types que tu ajoutes. Le réglage se change type par type (voir [Paramètres](#12-paramètres), colonne « Personne »).
- **Ce qu'on a vu.** Une ligne : thème, déclic, pattern repéré. Pour une rencontre réseau, la zone accepte plusieurs lignes (qui, dans quel contexte, ce qui s'est dit, la suite) et s'agrandit avec ton texte.
- **Notes sur l'entretien.** Une grande zone facultative, pour tout ce que tu veux garder en mémoire. Elle se retrouve dans Mes saisies (bouton ◎), dans l'export CSV et dans l'import CSV (colonne « Notes »).
- **Suivi.** Cases « CR envoyé » et « Synthèse écrite », pour les entretiens en face à face.
- **Réponse** (Invitation). Case « Elle a dit non » si la personne décline. Tu peux la cocher plus tard, dans Mes saisies. Tes non sont comptés dans Suivi d'activité.
- **Actions de pratique délibérée.** Pour chacune de tes actions en cours qui concerne ce type d'entretien : **Oui**, **En partie** ou **Non**. Un nouveau clic sur la réponse l'efface. C'est le plus rapide : commence par là.
- **XP de pratique** (mode complet). Chaque entretien rapporte des XP selon sa durée et son type : **10 minutes = 1 XP**, arrondi au plus proche, multiplié par **2** pour une séance ou une conversation, **3** pour une supervision, **1** pour un débrief ou un type d'entraînement que tu as ajouté (rôle « Pratique délibérée » ; un type ajouté de rôle « Heures de coaching » compte ×2). Une séance de 1h30 rapporte 18 XP, une conversation d'1 h 12 XP, une supervision de 1h30 27 XP, un débrief de 1h30 9 XP. Les multiplicateurs sont fixes.
  - L'en-tête annonce « 18 XP à répartir » et le détail du calcul ; il suit en direct le type et la durée.
  - Toutes tes compétences suivies s'affichent, **tes focus en premier**, avec **−** et **+**. Le compteur indique « reste 6 », puis « tout est réparti ✓ » ; on ne peut pas dépasser le budget.
  - Raccourcis : **Tout sur le focus** et **Répartir également**.
  - Tu peux enregistrer sans tout répartir : les XP restants attendent dans Mes saisies et dans le détail ◎. Ils ne comptent pour aucune compétence tant qu'ils ne sont pas répartis.
  - Une rencontre réseau, une invitation, une proposition ou une annexe ne rapporte pas d'XP de pratique.
- **Facultés commerciales** (mode complet). Après une rencontre réseau, une invitation ou une proposition : **de 0 à 5 XP** selon ton aisance, et **ce qui a été facile, ce qui a été difficile**. Ce commentaire est obligatoire, même à 0 XP ; en mode simplifié, le bloc n'apparaît pas et rien n'est exigé.
- **Focus.** Pour chacune de tes compétences en focus, une grande zone **« Ce que j'ai remarqué »** et une case **« Retenir pour la prochaine supervision »**. Tout est facultatif.
- **Remarques · autres compétences.** « + Remarque » ouvre une zone de remarque pour l'une de tes autres compétences.
- **Proposition.** Montant, nombre de séances prévues, durée d'engagement. Une proposition est enregistrée « En attente » (voir la [partie 10](#10-propositions-et-contrats)).
- **Supervision.** Coût de cette séance. Laisse le champ vide pour compter le prix moyen indiqué dans les Paramètres (il s'affiche en grisé), ou saisis le montant réel : il prend le pas sur le prix moyen. Si tu changes ensuite le prix moyen, toutes les séances sans montant personnalisé suivent. Coche **« Supervision non payante »** pour une séance offerte ou incluse ailleurs : elle n'entre alors pas dans tes coûts.
  - Si des remarques sont retenues pour la supervision, elles s'affichent en dessous avec ce que tu en retiens (voir la [partie 4](#4-pratique-délibérée)). Décoche « Joindre les remarques… » pour une supervision qui n'a rien à voir.

---

## 4. Pratique délibérée

L'onglet **Pratique délibérée** sert à choisir sur quoi tu travailles en ce moment, à vérifier que tu le fais vraiment, et à préparer tes supervisions.

### Boussole de pratique

- Le graphique en toile montre **la part de tes XP sur chacune de tes compétences suivies**, rapportée à la compétence la plus fournie. En pointillé, la même chose sur **tes 30 derniers jours** : où tu investis en ce moment.
- À côté de chaque compétence : son **niveau** et son total d'XP.
- **Gérer mes compétences** (en haut de la boussole) ouvre la liste de tes compétences : libellé, **discipline**, suivie ou non, **focus**, nombre de saisies. C'est le seul endroit où les gérer ; le bloc des Paramètres y renvoie. La compétence **Facultés commerciales** s'y trouve toujours : elle se renomme, mais ne se supprime pas.
- Les compétences d'une même **discipline** (PNL, Analyse transactionnelle, Systémique…) sont regroupées sur la boussole, sous un arc de couleur portant son nom. La discipline est libre : des suggestions s'affichent quand tu la tapes.
- Une compétence sans XP reste au centre, avec la mention « aucun XP ».
- Avec moins de 3 compétences suivies, la boussole devient une simple liste.

### XP de pratique : totaux, niveaux, transferts

Sous la boussole, le panneau **XP de pratique** :

- **en tête** : tes XP gagnés en tout, ceux des 30 derniers jours, et les **XP à répartir** (avec le nombre de saisies concernées et un lien vers Mes saisies) ;
- **pour chaque compétence** : son total (XP répartis dans tes saisies, plus les transferts reçus, moins les transferts donnés), son **niveau**, une barre qui **repart de zéro à chaque niveau**, ses XP des 30 derniers jours et le seuil du niveau suivant. Toutes les compétences suivent la même courbe : niveau 1 à 10 XP, puis 30, 60, 100, 150, 210, 280… (5 × L × (L + 1)), jusqu'au niveau 100 ;
- **Transférer des XP** : « Transférer N XP de A vers B », avec un motif facultatif. Un transfert déplace des XP déjà gagnés, sans en créer : utile quand tu fusionnes deux compétences, ou quand un entretien a surtout servi une autre compétence. N ne peut pas dépasser le total de A ; une compétence archivée peut être source ou cible ;
- **Historique des transferts** : date, A → B, nombre d'XP, motif. « annuler » reste possible tant que B a encore assez d'XP.
- **Clique sur une compétence** pour ouvrir son historique (voir plus bas).

### Focus du moment

- Choisis **jusqu'à 3 compétences** à travailler. Elles sont entourées sur la boussole et apparaissent en tête de chaque saisie, avec une zone pour noter ce que tu remarques.
- Retirer un focus (×) met en pause les actions qui lui sont liées. Elles restent dans la bibliothèque, avec leur historique.

### Actions en cours

- **Jusqu'à 3 actions en cours.** Une action est un geste précis à tenter : « faire reformuler l'objectif avec ses propres mots », « poser au moins un challenge explicite, et le tenir ».
- Chaque action est liée (ou non) à une compétence, et à des types de saisie : c'est dans ces saisies qu'on te demandera si tu l'as faite.
- Sous chaque action : les 10 dernières réponses (oui, en partie, non) et le **taux de réussite** (oui = 1, en partie = ½).
- **changer** remplace l'action par une autre de la bibliothèque (l'ancienne passe en pause). **mettre en pause** la retire des saisies sans perdre son historique.

### Bibliothèque d'actions

- Toutes tes actions, gardées pour toujours : **en cours** d'abord, puis les autres, **du taux le plus faible au plus élevé**.
- Statuts : **en cours**, **en pause**, **★ acquise** (quand le geste est devenu naturel). Change-le avec la liste à droite de l'action.
- **+ Nouvelle action** : son texte, la compétence travaillée, les types de saisie concernés. Elle est ajoutée à la bibliothèque, et passe en cours s'il reste une place.
- Une action jamais utilisée peut être supprimée (✕).

### Historique d'une compétence

En cliquant sur une compétence (boussole, focus, ou fiche) :

- son niveau, sa barre, son total d'XP, ses XP des 30 derniers jours et le seuil du niveau suivant ;
- un bouton pour la mettre en focus ou l'en retirer ;
- les actions qui lui sont liées, avec leur taux ;
- **toutes tes remarques et tous tes retours de supervision**, du plus récent au plus ancien. Les retours de supervision sont alignés à droite, en couleur, avec la date de la supervision et la personne qui t'a supervisé. « modifier » rouvre la saisie d'une remarque.

### Préparer la prochaine supervision

- Toutes les remarques où tu as coché **« Retenir pour la prochaine supervision »** arrivent ici, de la plus récente à la plus ancienne.
- **Décoche** celles que tu ne veux pas aborder.
- Après la supervision, écris sous chaque remarque **ce que tu en retiens**. « → En faire une action » crée une action à partir de ce que tu as retenu.
- **Enregistrer la supervision** ouvre la saisie de supervision : les remarques cochées et ce que tu en retiens y sont joints. Les remarques décochées sortent de la liste et restent dans l'historique de leur compétence.
- Ce que tu en retiens réapparaît dans l'historique de chaque compétence, comme retour de supervision.

---

## 5. Coach : ta fiche

L'onglet **Coach** (ou un clic sur ton logo, en haut à gauche) affiche ta fiche de coach. C'est ta page à toi, celle que tu pourras montrer.

### Ton profil

**Modifier mon profil** (ou un clic sur ta photo, ou sur un petit +) ouvre ton profil :

- photo (recadrée en rond), nom, titre (ex. « Coach en leadership »), date de naissance (pour l'âge) ;
- **début du coaching** : laisse vide pour prendre la date de ta première séance enregistrée ;
- **micro-pitch** : une phrase sur ce que tu fais et pour qui ;
- **accord des libellés** : féminin, masculin ou inclusif (« Praticienne confirmée », « Praticien confirmé », « Praticien·ne confirmé·e ») ;
- **formation** (diplômes, certifications) et **parcours** : une ligne par élément.

L'en-tête affiche ton titre, ton âge et ton ancienneté (« 2,7 années de coaching (depuis mars 2024) »).

### Rang et niveau

- **Chaque statistique a sa propre courbe**, construite sur le parcours d'un coach régulier. Sa 1re année : 80 invitations, 24 personnes en conversation, 60 conversations, 12 propositions, 6 contrats, 80 séances payantes, 300 h de coaching. Ensuite, son activité monte en charge sur deux ans.
- Les niveaux suivent l'ancienneté de ce coach : niveau 10 ≈ 2 mois, 25 ≈ 1 an, 30 ≈ 1 an et demi, 40 ≈ 3 ans, 60 ≈ 8 ans, 100 ≈ 30 ans.

| Statistique | 1re année (≈ niveau 25) | Rythme de croisière | Repère |
|---|---|---|---|
| Heures de coaching | 300 h | 300 h par an | 50 h = niveau 10 |
| Conversations | 60 | 60 par an | 2 à 3 rendez-vous par personne |
| Personnes coachées | 36 | 30 par an | |
| Séances payantes | 80 | 200 par an | |
| Pratique délibérée | 400 h | 100 h par an | forte au début, plus plate ensuite |
| Supervision | 24 h | 12 h par an | 2 h par mois au début, tous les deux mois ensuite |
| Invitations | 80 | 100 par an | 10 invitations ≈ 3 personnes en conversation |
| Propositions | 12 | 12 par an | la 1re = niveau 5 |
| Clients et renouvellements | 6 | 10 par an | chaque contrat signé compte, renouvellement compris ; le 1er = niveau 10 |

- **Le CA en deux temps.** Jusqu'à 5 000 € cumulés, des paliers : premier euro = niveau 2, 100 € = 3, 200 € = 4, 500 € = 5, 800 € = 6, 1 000 € = 7, 1 500 € (un SMIC) = 8, 3 000 € = 10, 5 000 € = 12. Au-delà, ton **meilleur CA sur 12 mois glissants** : 10 000 € = 15, 30 000 € (2 500 € par mois) = 25, 60 000 € (en vivre à temps plein) = 33, 100 000 € = 50, 300 000 € = 100. Ton niveau ne redescend jamais ; la valeur actuelle des 12 derniers mois et son équivalent mensuel restent affichés.
- **Ton niveau global est la moyenne des niveaux de tes statistiques déjà saisies.** Une statistique entre dans la moyenne à sa première saisie (par exemple ta première invitation).
- **Ton rang change tous les 10 niveaux** :

| Niveaux | Rang |
|---|---|
| 1–9 | Débutant·e |
| 10–19 | Apprenti·e |
| 20–29 | Praticien·ne |
| 30–39 | Praticien·ne confirmé·e |
| 40–49 | Praticien·ne aguerri·e |
| 50–59 | Expert·e |
| 60–69 | Expert·e reconnu·e |
| 70–79 | Coach de référence |
| 80–89 | Mentor·e |
| 90–99 | Élite |
| 100 | Légende |

### Boussole de pratique, focus et actions

La même boussole que dans l'onglet Pratique délibérée, avec tes focus et tes actions en cours à droite (voir la [partie 4](#4-pratique-délibérée)).

### Statistiques

Trois colonnes, depuis le début de ta pratique. **Chaque statistique a son niveau**, jusqu'à 100, selon l'échelle ci-dessus :

- **Coacher beaucoup** : heures de coaching, conversations, séances, personnes coachées ;
- **Pratiquer délibérément** : heures de pratique délibérée, heures de supervision ;
- **Développer l'activité** : invitations, propositions, clients et renouvellements, CA, et **Facultés commerciales** (le total de ces XP, sur la courbe commune des XP).

Sous chaque statistique : sa barre vers le niveau suivant, et la valeur à atteindre. La barre repart de zéro à chaque niveau : elle se remplit entre le seuil que tu viens de passer et le suivant.

### Hauts faits

Sous les statistiques, tes **hauts faits** :

- **automatiques** : première séance, paliers de séances, d'heures de coaching (10 h, 50 h, 100 h… 10 000 h), de personnes coachées, de clients payants (dont le premier contrat), de CA signé, de semaines d'affilée avec au moins un entretien de coaching, d'heures de pratique délibérée, de supervisions, d'invitations, de **non reçus** (« Premier non », 10, 25, 50, 100), d'**XP de pratique** (100, 500, 1 000, 5 000, 10 000 XP), le **premier niveau 5, 10 et 20** atteint dans une compétence, et tes actions de pratique délibérée « acquises » ;
- **automatiques encore** : un haut fait par chapitre du carnet de route terminé ;
- **tes victoires** : les réussites que l'outil ne peut pas compter seul (une promotion obtenue par un client, un premier dirigeant accompagné…). Ajoute-les avec le + du bloc : une image (recadrée en carré), un titre, une date, un niveau et un court récit « pour t'en souvenir ». Clique sur une victoire pour la revoir en grand ou la modifier. Son ajout est célébré comme un haut fait.
- Chaque haut fait a un niveau : **Bronze**, **Argent**, **Or** ou **Légendaire**. « NOUVEAU » signale ceux des 30 derniers jours.
- Les **3 prochains** à débloquer s'affichent, avec ce qu'il te reste.
- Thème Jeu vidéo : des cartes sur trois colonnes, les 9 plus récentes d'abord (« Voir les autres »). Thème Professionnel : une frise espacée selon le temps, qui défile.

### Affinités

Un tableau croise tes **heures de coaching** par **public** (en lignes) et par **problématique** (en colonnes), à partir de la fiche de tes clients (onglet Personnes). Les 5 publics et les 5 problématiques les plus fréquents s'affichent. Une case de **50 h et plus** est une **spécialité**. Les heures des clients dont le public ou la problématique ne sont pas renseignés sont comptées à part.

### Reprendre ton historique

Tu coachais avant d'utiliser l'outil ? Dans **Modifier mon profil > Reprendre ton historique** :

1. **Importer tes saisies** depuis un tableur : dans Excel, « Enregistrer sous » au format CSV, puis « Importer un fichier CSV » (aussi en bas de page : « Importer un CSV »).
   - « Télécharger le modèle » donne un fichier avec les bonnes colonnes : Date, Type, Durée, Personne, Commentaire, Notes, Montant, Statut. Seules Date et Type sont obligatoires.
   - Dates acceptées : `12/03/2024`, `12/03/24`, `2024-03-12`. Types : le libellé de tes types (Séance, Session, Conversation…). Durées : comme dans la saisie (`1h30`, `90`, `1,5`).
   - Les personnes inconnues sont créées. Les lignes déjà présentes (même date, même type, même personne) sont ignorées. Un récapitulatif s'affiche avant d'importer.
2. **Ou déclarer tes totaux** d'avant l'outil : heures, séances, conversations, personnes coachées, pratique délibérée, supervision, invitations, propositions, CA, clients payants. Ils comptent dans ta fiche (niveaux, rang, hauts faits), pas dans tes indicateurs ni tes graphiques.

### Deux thèmes

En haut de l'onglet : **Professionnel** (sobre, clair) ou **Jeu vidéo** (sombre, anneau de progression autour de la photo, étoiles, barres brillantes). Les couleurs de la fiche sont les mêmes pour tous les coachs : toutes les fiches se lisent de la même façon.

---

## 6. Tableau de bord

C'est ton cap : à regarder une fois par semaine.

### Indicateurs principaux

Ce sont les 3 premiers indicateurs que tu as choisis (voir la [partie 7](#7-suivi-dactivité)). Ils affichent la valeur de l'année, celle des 31 derniers jours et une courbe de tendance. Pour les changer, clique sur « Changer mes indicateurs ».

### À relancer

La liste de ce qui demande une action, avec les plus urgents en premier.

| Alerte | Quand elle apparaît | Boutons |
|---|---|---|
| **Action liée à une personne** | Elle est en retard ou prévue dans les 7 jours. | Traiter |
| **Proposition en attente** | Une proposition attend une réponse et aucune action n'est prévue pour la personne. Le délai d'attente passe en rouge à partir de 14 jours. | Acceptée · Refusée (annulable) · Traiter |
| **Fin d'accompagnement** | Le contrat se termine dans les 21 jours, s'est terminé depuis moins de 45 jours, ou la dernière séance prévue est atteinte. Une seule fois par contrat : une fois le bilan planifié, elle ne revient pas, même quand l'action est faite ; un nouveau contrat (renouvellement) la fait réapparaître. | Planifier le bilan · Traiter |
| **Sans contact** | La personne est en conversation ou en attente de réponse, sans action prévue, et sans contact depuis le seuil choisi (30 jours par défaut, aucune alerte au-delà de 365 jours). | Traiter |
| **Relance au rythme** | Le dernier échange avec la personne est plus ancien que son rythme de contact (tous les 3 mois par défaut), sans action prévue ni autre alerte pour elle. Concerne toutes les personnes, contacts réseau compris, sauf celles classées « Sans suite ». La ligne affiche ses cercles, son rythme et, s'il est rempli, « À reprendre : » suivi du prochain sujet à évoquer. | Préparer · Traiter |

Une personne n'apparaît qu'une fois dans la liste. Clique sur un nom pour ouvrir la fiche de la personne.

**Préparer** ouvre la fiche sur l'onglet Notes, le curseur dans « Prochain sujet à évoquer » : de quoi relire ce qu'il faut garder en tête avant de recontacter la personne.

**Traiter** ouvre une petite fenêtre :

- **C'est fait ?** Pour une action : « Faite » ou « Annulée ». Pour une relance au rythme ou une personne sans contact : « Fait : enregistrer l'échange… » ouvre « Enregistrer un temps » prérempli (Rencontre réseau ou Conversation, la personne, aujourd'hui).
- **Replanifier** : +2 jours, +1 semaine, +1 mois ou la date de ton choix. Pour une action, c'est sa nouvelle date ; pour une relance au rythme ou une personne sans contact, une action « Relancer … » est créée à cette date ; pour une proposition ou une fin d'accompagnement, le rappel est reporté à cette date.
- **Plus tard** : reporte le rappel de la durée réglée dans Paramètres > Suivi des personnes (14 jours par défaut), sans changer le rythme.
- **Commentaire** : pour une action, il s'ajoute, daté (« 14/11 : … »), à son « Résultat » ; pour une personne, il remplace son « Prochain sujet à évoquer ».
- En bas : « Supprimer l'action » (annulable), « Ne plus relancer » (le rythme passe à « Pas de relance ») ou « Classer sans suite ».

Choisis une issue (ou écris seulement un commentaire), puis « Enregistrer ».

### Objectif prioritaire

Tes priorités du moment, avec pour chacune son objet et ce qu'elle veut dire pour toi. Tu peux les réordonner avec les flèches ou par glisser-déposer.

### Plan d'action

Ce bloc est ouvert par défaut. Clique sur son titre pour le replier : il affiche alors un résumé, avec le nombre d'actions en cours et en retard.

Chaque action a un objectif prioritaire, une description, une personne (facultative), une date prévue, un résultat et un statut : En cours, Réalisée ou Annulée. Un clic sur la personne ouvre le même champ de recherche que dans la saisie ; « — Aucune personne » la retire.

- Une action en retard s'affiche en rouge.
- Les pastilles « En cours », « Réalisées » et « Annulées » filtrent la liste.
- Les actions créées depuis une fiche ou une relance ont pour objectif « Relance ».
- Le ✕ au bout de la ligne supprime l'action, sans confirmation : « Annuler », dans le message qui s'affiche, la rétablit.

### Suivi indicateurs

Tes cibles par trimestre, semestre et année : heures de coaching, conversations, personnes coachées, pratique délibérée, CA accepté. Chaque période a une phrase d'ambition. Une barre montre l'avancement. Le menu en haut à droite permet de choisir la période.

Ce bloc est replié par défaut. Clique sur son titre pour l'ouvrir : replié, il affiche la période et l'avancement des cibles du trimestre. Ton choix d'ouverture est mémorisé sur ton ordinateur.

> Sur un écran large (1700 px et plus), « À relancer » et « Objectif prioritaire » s'affichent côte à côte.

---

## 7. Suivi d'activité

L'onglet s'appelait « Métriques » jusqu'à la version 1.7.

### Mes indicateurs

Tu choisis 6 indicateurs au maximum. Les 3 premiers sont **principaux** : ils s'affichent en grand, aussi sur le tableau de bord. Les suivants sont secondaires.

En haut à droite d'un bandeau principal : le **niveau** de la statistique (le même que dans ta fiche de coach : heures de coaching, conversations, personnes coachées, pratique délibérée, invitations, CA), et dessous ton **total toutes années confondues** (« 412 h »). Les indicateurs qui se cumulent sans avoir de niveau (nouvelles personnes, personnes vues, recommandations) affichent seulement leur total.

- Pour échanger deux indicateurs, glisse l'un sur l'autre.
- Pour en changer, ouvre « Choisir mes indicateurs ». Le catalogue affiche ta valeur réelle à date pour chacun.

Le catalogue compte 23 indicateurs, répartis en 4 piliers :

- **Coacher beaucoup :**
  - heures de coaching ;
  - conversations ;
  - personnes coachées ;
  - régularité (semaines actives sur les 12 dernières) ;
  - nouvelles personnes ;
  - clients actifs (31 jours).
- **Pratiquer délibérément :**
  - pratique délibérée ;
  - discipline post-séance (CR, synthèse et XP répartis, sur 90 jours glissants) ;
  - XP de pratique (XP gagnés sur 90 jours, comparés aux 90 jours précédents ; niveau et total en haut à droite du bandeau).
- **Développer l'activité :**
  - CA accepté / proposé ;
  - taux de transformation ;
  - propositions en attente ;
  - taux d'acceptation ;
  - panier moyen ;
  - taux horaire réel ;
  - invitations ;
  - réseau entretenu : personnes avec un rythme de contact, contactées dans leur rythme (« 16 / 20 ») ;
  - personnes vues : personnes distinctes sur 90 jours, comparées aux 90 jours précédents ;
  - recommandations : personnes « recommandé·es ou présenté·es par » dans l'année, et combien sont devenues clientes.
- **Piloter :**
  - actions en retard ;
  - avancement des cibles du trimestre ;
  - part du coaching dans ton temps total.

### Graphiques

- **Année.** Les boutons 2024, 2025, 2026… choisissent l'année affichée.
- **Temps passé par mois.** Une barre empilée par mois, avec le n° 1 de tes types à la base. Survole une barre pour voir le détail.
- **Développer ton activité.** Deux vues, pour l'année choisie :
  - **Entonnoir** : invitations, personnes en conversation, personnes avec une proposition, clients signés. Entre chaque étape, le **taux de passage** (et celui de l'année précédente). À droite : le taux de transformation global, le CA signé (comparé à l'année précédente), le panier moyen, tes **Facultés commerciales** (XP de l'année sur tes rencontres réseau, invitations et propositions ; masquées en mode simplifié) et tes **non reçus** (invitations déclinées et propositions refusées) : ceux qui reçoivent le plus de non sont souvent ceux qui reçoivent le plus de oui. Les taux comparent des personnes distinctes ; « — » quand l'étape précédente n'est pas renseignée (par exemple tant que tu n'enregistres pas tes invitations).
  - **Par mois** : invitations, conversations, propositions et signatures, mois par mois, pour voir ton rythme.
- Les XP de pratique se lisent sur la boussole de pratique et dans le panneau XP de l'onglet Pratique délibérée.

---

## 8. Mes saisies

Le détail de tous tes entretiens, filtrable et modifiable directement dans le tableau.

- **Filtres.**
  - Clique sur une année, un type ou une ou plusieurs personnes. Clique à nouveau pour retirer le filtre.
  - Les personnes archivées sont dans une liste déroulante, « Personnes archivées ».
- **Résumé.** Nombre de saisies, temps total, dont coaching, pratique délibérée, et pourcentages de CR et de synthèses faits.
- **Tuile de la personne.** Quand tu sélectionnes une personne, sa tuile s'affiche à droite des filtres. Si tu en sélectionnes plusieurs, un onglet par personne permet de passer de l'une à l'autre.
  - **À gauche :** son étape dans le pipeline (Rencontre, En conversation, Client.e…), sa fonction et son site, ses dates, ses chiffres, et les boutons Fiche et Archiver.
  - **À droite :** les XP investis avec cette personne, compétence par compétence.
  - **En dessous :** la frise de ses échanges, avec la date (jj/mm) au-dessus de chaque échange et l'année au milieu de sa période.
- **Années.** Elles sont classées de la plus récente à la plus ancienne.
- **Tableau.** Les colonnes sont, dans l'ordre : Personne, Date, Type, Durée, CR, Synth., Ce qu'on a vu, XP, Contrat / coût.
  - **XP** (mode complet) est replié par défaut et montre un résumé : « 18 XP · Q 12 · É 6 » (les initiales de tes compétences). Un clic sur l'en-tête ou sur une cellule déplie une colonne par compétence, avec un petit champ numérique, et une colonne qui donne les XP gagnés et ce qui reste à répartir. On ne peut pas dépasser le budget de la saisie ; les Facultés commerciales vont de 0 à 5.
  - Une saisie dont des XP restent **à répartir** a ses cellules XP en jaune. Si tu raccourcis la durée ou changes le type d'une saisie déjà répartie, le budget est recalculé : un **dépassement** colore la ligne en rouge, sans rien supprimer, jusqu'à ce que tu ajustes. En mode simplifié, rien n'est signalé.
  - **Contrat / coût** est replié par défaut. Une fois déplié, sur un fond rosé, il montre : Accepté (statut), Montant (ou coût d'une supervision), Durée, Séances. Sur une supervision, la case « non payante » remplace le statut ; sur une invitation, la case « Elle a dit non ».
  - **Personne** : un clic sur le nom ouvre un champ de recherche (personnes récentes d'abord) pour changer la personne d'une saisie, en créer une, ou la retirer (« — Aucune personne ») sur un type où elle est facultative. Une saisie à qui il manque une personne obligatoire est entourée en rouge ; « Personne supprimée » signale une saisie dont la personne a été effacée. La petite loupe à côté filtre le tableau sur cette personne.
  - **Durée** : « Autre… », en bas de la liste, permet d'écrire n'importe quelle durée (`2,5`, `2h30`, `150min`), puis Entrée.
  - Chaque modification est enregistrée aussitôt.
  - **◎** ouvre les détails de la saisie : notes sur l'entretien, et sa pratique délibérée (réponses aux actions, répartition des XP ou Facultés commerciales et leur commentaire, remarques, retours d'une supervision) pour la compléter ou la corriger. Il est coloré quand la saisie en contient.
  - ✕ supprime une saisie. L'annulation est possible quelques secondes.
- **Afficher les métriques archivées.** Fait réapparaître les axes que tu ne suis plus.
- **Exporter CSV** (en bas de page). Un tableur de toutes tes saisies.

---

## 9. Personnes

### À relancer

Le bloc **À relancer** du tableau de bord est aussi en haut de l'onglet Personnes, avec les mêmes boutons (voir la [partie 6](#6-tableau-de-bord)). Clique sur son titre pour le replier.

### Vues

- **Pipeline** (par défaut) : une colonne par étape, avec son nombre de personnes et ses totaux (propositions en attente, contrats en cours).
  - Les **contacts réseau** (seulement des rencontres réseau) et les personnes **sans aucune saisie** ne sont pas dans le pipeline. Une ligne sous le pipeline les compte ; « Les afficher en liste » ouvre la vue Liste filtrée sur eux. Une recherche qui les trouve les affiche sous cette ligne.
  - Chaque carte montre la photo et le nom, puis, sur toute la largeur : la fonction, le montant en attente ou l'avancement du contrat, la prochaine action ou le dernier contact. Une icône ouvre le site de la personne.
  - Glisse une carte dans une autre colonne pour changer son étape à la main.
  - Remettre « Automatique » sur la fiche efface ce choix manuel.
- **Liste** : des tuiles compactes, avec la photo, le nom, l'étape, la provenance, la fonction, le site, le dernier contact, le contrat et la prochaine action.
  - Des filtres par étape indiquent le nombre de personnes dans chacune.
  - Les tuiles sont triées par prochaine action, puis par dernier contact.
- **Recherche** : sur le nom, la fonction, les cercles, la provenance, les notes et le site.
- **Personnes archivées** : case à cocher pour les afficher.

### Les étapes

L'étape se calcule toute seule à partir de tes saisies. Le bouton **« ? Les étapes »** rappelle l'approche et ce qu'il faut saisir à chaque étape (voir la [partie 2](#créer-tes-clients-par-la-relation)).

Le pipeline commence à l'**invitation**. Avant cela, une personne rencontrée (Rencontre réseau) est un **contact réseau** : hors du pipeline, elle a sa fiche, ses cercles et son rythme de contact, et revient dans « À relancer » quand ce rythme est dépassé.

| Étape | Règle automatique |
|---|---|
| Contact réseau (hors pipeline) | Aucune invitation, conversation, session, proposition ni supervision : seulement des rencontres réseau, ou aucune saisie. |
| Invité·e | Au moins une invitation, sans conversation ni session. |
| En conversation | Au moins une conversation ou une session, sans proposition en attente. |
| Proposition envoyée | Au moins une proposition « En attente ». |
| Client.e | Un contrat en cours, ou une séance après la fin du contrat. |
| Accompagnement terminé | Le contrat est échu. Sans durée d'engagement, la personne passe dans cette étape après 120 jours sans contact. |
| Sans suite | Toutes les propositions sont refusées et il n'y a pas eu de contact depuis, ou c'est un choix manuel. |
| Superviseur.e | Au moins une supervision avec cette personne, et aucune proposition acceptée. |

Une étape choisie à la main, sur la fiche ou par glisser-déposer, reste valable jusqu'à la saisie suivante concernant la personne.

### La fiche personne

Pour ouvrir une fiche, clique sur une carte, sur un nom dans « À relancer », ou sur « Fiche » dans Mes saisies. Tu peux aussi créer une personne avec « + Nouvelle personne ».

**En haut, toujours visible :**

- **Photo.**
  - Clique sur le rond ou sur « Photo », choisis une image, puis cadre-la dans le disque : glisse pour centrer, puis zoome avec le curseur ou la molette.
  - La photo est compressée (environ 5 Ko) et stockée dans ton carnet, donc chiffrée avec lui.
- **Nom.** Des icônes apparaissent à côté du nom dès que l'information correspondante est renseignée :
  - l'enveloppe ouvre ta messagerie ;
  - le globe ouvre le site ;
  - le combiné lance l'appel, seulement sur un téléphone ou une tablette.
- **Fonction**, en une ligne : fonction et organisation.
- **Téléphone, e-mail, site web.** Le téléphone s'espace automatiquement : `0123456789` devient `01 23 45 67 89`, et `+33123456789` devient `+33 1 23 45 67 89`.

Puis trois onglets.

**Infos**

- **Étape** : automatique ou choisie à la main.
- **Cercles** : les groupes dont la personne fait partie (club d'entrepreneurs, anciens collègues, école de coaching…), autant que tu veux. « + cercle » propose les cercles déjà utilisés, les plus fournis d'abord ; tape un nom nouveau pour en créer un. Le ✕ d'une pastille la retire.
- **Proximité** : Proche, Régulier (par défaut) ou Occasionnel. Indépendante des cercles.
- **Rythme de contact** : tous les mois, tous les 3 mois (par défaut), tous les 6 mois, une fois par an ou pas de relance. Dessous : la date du dernier contact et le **prochain contact conseillé** (« 2 novembre 2026 · dépassé de 12 j », « 15 janvier 2027 (dans 2 mois) »).
- **Recommandé·e ou présenté·e par** : la personne qui te l'a fait connaître, cherchée par son nom (même champ que dans la saisie), puis « Recommandé·e » ou « Présenté·e ».
- **Provenance** : d'où vient la personne quand personne ne te l'a présentée (salon, LinkedIn, atelier…). Le petit ▾ déroule les valeurs déjà utilisées ; une nouvelle valeur est ajoutée à la liste.
- **Recommandations** : deux cases, « Vient d'une recommandation » (on t'a recommandé à elle) et « Je lui ai demandé une recommandation ».
- **A recommandé ou présenté** : les personnes qu'elle t'a fait connaître. « + Ajouter une personne » en relie une nouvelle ; le ✕ retire le lien.
- **Public** et **problématique** (mode complet) : à quel public appartient la personne, et ce qu'elle vient travailler. Même liste déroulante que la provenance, avec saisie libre. Ils alimentent les **affinités** de ta fiche de coach (voir la [partie 5](#5-coach--ta-fiche)).

**Notes** (le nombre de notes est dans l'intitulé de l'onglet)

- **À garder en tête** : contexte, enjeux, ce qu'il faut savoir (l'ancienne « Description »).
- **Prochain sujet à évoquer** : repris dans « À relancer » (« À reprendre : … »).
- **Notes des échanges** : toutes les « Notes » et lignes « Ce qu'on a vu » des saisies de la personne, de la plus récente à la plus ancienne, avec la date et le type.

**Échanges**

- **Chiffres.** Dernier contact, heures de coaching, conversations, sessions, contrat, premier contact.
- **Contrat**, s'il y en a un. Montant, durée et avancement, avec le début, les séances prévues et la durée, modifiables.
- **Échanges.** Une frise avec une pastille par échange, dans la couleur de son type. Quand des pastilles se chevauchent, celles des types les mieux classés dans Paramètres > Types d'activité passent au-dessus : par exemple les sessions au-dessus des débriefs. La date (jj/mm) est au-dessus de chaque pastille et l'année au milieu de sa période. Survole une pastille pour voir le détail.
- **XP investis avec cette personne**, compétence par compétence (mode complet).
- **Plan d'action.** Les actions liées à la personne. Tu peux en ajouter avec une date et les cocher une fois faites. Elles apparaissent aussi dans le plan d'action du tableau de bord.

**En bas :**

- **Archiver / Réactiver.** Une personne archivée sort des boutons de saisie et des filtres, mais garde tout son historique.
- **Supprimer.** Efface la personne de ton carnet, après confirmation. Ses saisies restent (tes heures et statistiques ne bougent pas), marquées « Personne supprimée ». C'est définitif.
- **Voir ses saisies.** Ouvre Mes saisies, filtré sur elle.
- **Terminé.** Ferme la fiche.

Tout est enregistré pendant la frappe.

### L'onglet Réseau (mode complet)

L'onglet **Réseau** dessine les personnes de ton carnet et ce qui les relie. Il est masqué en mode simplifié. Rien n'y est saisi : tout vient des fiches (cercles, proximité, public, problématique, « Recommandé·e ou présenté·e par ») et de tes saisies.

- **Quatre vues.** **Cercles**, **Public** et **Problématique** regroupent les personnes autour de pivots : un disque par groupe, avec son nombre de membres, et chaque personne reliée à ses groupes. Une personne sans groupe est reliée au pivot gris « Sans cercle » (ou « Non renseigné »). **Orbites** te place au centre : les anneaux disent la proximité (proche, régulier, occasionnel), les parts du disque les cercles, proportionnelles à leur nombre de membres. Une personne de plusieurs cercles est placée dans le premier, avec de petits traits vers les autres.
- **Ce que montre chaque point.** La **couleur** dit l'étape (contact réseau, invité·e, en conversation, proposition envoyée, client·e, accompagnement terminé, superviseur·e) ; la **taille**, le nombre d'échanges. Un point **pâle entouré de pointillés rouges** est à relancer (rythme de contact dépassé, ou pas de nouvelles depuis un moment). Un **contour doré** signale une **passerelle** : une personne dans plusieurs groupes. Les **flèches dorées** vont de la personne qui recommande à la personne recommandée (en pointillés : présentée).
- **Options.** « Recommandations » affiche ou masque les flèches ; « Signaler les personnes à relancer », les pointillés ; « Inclure archivé·es et sans suite » ajoute en gris les personnes archivées ou « Sans suite », absentes sinon.
- **Survol et clic.** Survole un point : nom, étape, nombre d'échanges, dernier contact, groupes, relance, recommandé·e par. Clique : sa fiche s'ouvre. Clique sur un groupe : ses membres sont mis en avant, le reste s'estompe ; « Tout afficher », ou un clic dans le vide, revient à l'ensemble. Tu peux déplacer un point à la souris, le temps de la consultation : rien n'est enregistré, et le dessin est recalculé à l'identique à chaque ouverture.
- **Grands carnets.** Au-delà d'une soixantaine de personnes, seuls les prénoms des passerelles, des personnes à relancer et des plus gros points sont écrits ; les autres apparaissent au survol.
- **Ce que montre ton réseau.** Le panneau de droite (sous le graphe sur un écran étroit) tire quatre pistes du regroupement choisi : les **passerelles** (« Bastien relie Club d'entrepreneurs et Réseau d'anciens collègues »), les groupes **à réchauffer** (au moins la moitié des membres à relancer), les **pistes de développement** (groupes où personne n'a encore vécu une conversation de coaching : une invitation ?) et les **chaînes de recommandation** (Julien → Antoine → Romain). Un nom ouvre la fiche, un groupe le met en avant.

---

## 10. Propositions et contrats

**Rien n'est automatique** : c'est toi qui indiques si une proposition est acceptée.

1. Enregistre une **proposition** (montant, séances prévues, durée d'engagement). Elle est « En attente ».
2. Elle apparaît dans **À relancer** tant qu'aucune action n'est prévue pour la personne.
3. Change son statut :
   - dans **À relancer**, avec les boutons Acceptée ou Refusée ;
   - ou dans **Mes saisies**, colonne Contrat dépliée, Accepté : En attente, Acceptée ou Refusée.
4. Le **contrat** d'une personne est sa **dernière proposition acceptée** :
   - début : par défaut la date de la proposition, modifiable sur la fiche ;
   - fin : le début plus la durée d'engagement ;
   - séances réalisées : les sessions entre le début et la fin.
5. À l'approche de la fin, ou à la dernière séance prévue, « À relancer » te propose de **planifier le bilan**, une seule fois par contrat.

Seules les propositions de plus de 0 € comptent dans les indicateurs commerciaux : propositions, taux d'acceptation, CA, panier moyen.

---

## 11. Coûts et taux horaire réel

Réglages dans **Paramètres > Coûts de l'activité**.

- **Tes lignes de coût.** Pour chaque coût : une description, un fournisseur et un coût annuel. Par exemple : assurance RC Pro, formation continue, outils, cotisations. « + Ajouter un coût » crée une ligne, et ✕ la supprime.
- **La ligne Supervision**, fixe et non supprimable.
  - Tu y indiques le **prix moyen** d'une supervision.
  - Son coût annuel est calculé à partir de tes saisies de l'année : le montant personnalisé de chaque séance s'il y en a un, sinon le prix moyen.
  - Les séances marquées « non payante » ne comptent pas.
- **La ligne Cotisations URSSAF**, fixe elle aussi.
  - Tu y indiques ton **taux moyen de prélèvement**, en pourcentage. Ce taux dépend de ton statut et de ton activité : vérifie le tien auprès de l'URSSAF.
  - Son coût annuel est ce taux appliqué à ton CA accepté de l'année. Il compte comme une charge et se déduit de ton taux horaire réel.
  - Ce calcul porte sur le CA accepté, pas sur les sommes réellement encaissées : c'est une estimation.
- **Charges moyennes annuelles.** C'est la somme de toutes les lignes, supervision et URSSAF comprises.
- **Répartition.** Un graphique en anneau montre la part de chaque coût, avec la supervision dans la couleur de son type d'activité.
- **Charges dans le taux horaire.** Clique sur la tuile du calcul que tu veux utiliser :
  - **En entier** : toutes les charges de l'année sont déduites dès le premier contrat payant. Le taux est prudent en début d'année.
  - **Au prorata** : les supervisions déjà payées et les cotisations URSSAF sur le CA déjà accepté, plus la part des autres charges correspondant à l'année écoulée. Le taux reflète le rythme en cours.

  Chaque tuile affiche le taux obtenu, par exemple « En entier : 2 €/h ». La tuile choisie est bordée et cochée : c'est elle qui alimente l'indicateur.

**Taux horaire réel = (CA accepté − charges) ÷ toutes tes heures de l'année.** Toutes les heures comptent, y compris le temps non facturé. Le détail de l'indicateur montre la part de supervision et les charges rapportées à chaque contrat payant.

> Si tu avais indiqué un montant de « charges annuelles » dans une version précédente, il a été repris dans une ligne « Charges diverses », que tu peux détailler.

---

## 12. Paramètres

Tous les blocs sont **repliés par défaut**. Clique sur un titre, ou sur le triangle placé avant lui, pour ouvrir ou fermer le bloc. Replié, chaque bloc affiche un résumé d'une ligne. Ton choix est mémorisé sur ton ordinateur.

Les blocs vont par deux, dans cet ordre :

| Gauche | Droite |
|---|---|
| **Identité** : nom du cabinet, nom de l'outil, phrase de motivation, accord des libellés (féminin, masculin, inclusif). | **Apparence** : logo (qui sert aussi d'icône à l'onglet et à la fenêtre) et bandeau côte à côte, les 5 couleurs de marque (Accent, Foncé, Fond, Gris, Bleu), « Revenir à la palette par défaut ». |
| **Sécurité** : chiffrement, verrouillage automatique, mot de passe, clé de secours (voir la [partie 13](#13-sécurité-et-chiffrement)). | **Stockage des données** : dossier relié, « Ouvrir un autre carnet », « Nouveau carnet ». |
| **Types d'activité** (11 au maximum) : ordre d'importance par glisser-déposer (le n° 1 est à la base des graphiques), couleur, libellé, durée par défaut, **Personne**, **Compte dans**. Un type ajouté ne peut être supprimé que s'il n'a aucune saisie. Un type intégré renommé affiche ↺ au bout de sa ligne : il lui rend son nom d'origine (par exemple « Rencontre réseau »). | **Compétences** : renvoie à « Gérer mes compétences », sur la boussole de pratique (voir la [partie 4](#4-pratique-délibérée)). |
| **Suivi des personnes** : seuil de l'alerte « sans contact », en jours ; durée de « Plus tard » dans À relancer (14 jours par défaut). | **Indicateurs suivis en bandeaux** : choix des 6 indicateurs affichés en haut du tableau de bord et des Métriques. |
| **Coûts de l'activité**, sur toute la largeur (voir la [partie 11](#11-coûts-et-taux-horaire-réel)). | |
| **Partager à un pair** : « Exporter un modèle sans données ». | **Parcours de démarrage** : afficher le carnet de route, célébrations animées, « Revoir l'accueil ». |

Quelques précisions :

- **Compte dans** décide dans quel indicateur les heures d'un type sont additionnées : heures de coaching, pratique délibérée, développement ou autre. Pour un type que tu as ajouté, il fixe aussi ses XP : ×2 en heures de coaching, ×1 en pratique délibérée, aucun sinon.
- **Personne** : obligatoire ou facultative à la saisie. Par défaut, obligatoire pour la rencontre, l'invitation, la conversation, la proposition, la séance et le débrief ; facultative pour la supervision et les types que tu ajoutes.
- **Les couleurs des types** suivent automatiquement la palette et l'ordre d'importance, tant que tu ne retouches pas une couleur à la main.
- **Sur un écran de moins de 1500 px de large**, Types d'activité et Compétences passent l'un sous l'autre.

En bas de chaque page :

- **Changer de dossier** ;
- **Exporter JSON**, qui produit une copie complète ;
- **Exporter CSV** (tes saisies) et **Exporter les personnes (CSV)** : nom, fonction, étape, cercles (séparés par « ; »), proximité, rythme, recommandé·e ou présenté·e par, provenance, public, problématique, coordonnées, dernier contact, prochain sujet ;
- **Importer un JSON** ;
- le numéro de version et le lien **Nouveautés**.

---

## 13. Sécurité et chiffrement

- **Activer le chiffrement** : Paramètres > Sécurité. Noms, notes, objectifs et photos deviennent illisibles sans ton mot de passe. Les sauvegardes existantes sont chiffrées elles aussi.
- **Clé de secours** : elle t'est remise à l'activation. Garde-la **hors de l'ordinateur**, dans un gestionnaire de mots de passe ou sur papier. Sans le mot de passe ni la clé de secours, personne ne peut plus rouvrir les données, pas même l'auteur de l'outil.
- **Verrouillage automatique** : jamais, ou après 5, 15, 30 ou 60 minutes d'inactivité.
- **Écran de verrouillage** : il propose de déverrouiller avec ton mot de passe ou avec ta clé de secours. Avec la clé de secours, tu choisis ensuite un nouveau mot de passe. Un lien permet aussi d'ouvrir un autre carnet.
- Dans Paramètres, tu peux aussi verrouiller tout de suite, changer de mot de passe, générer une nouvelle clé de secours ou désactiver le chiffrement.

---

## 14. Tes données : enregistrement, sauvegardes, récupération

- **Enregistrement continu.** Chaque modification est enregistrée au bout d'une fraction de seconde. L'état s'affiche en haut à droite.
- **Rien n'est jamais écrasé à l'aveugle.** Avant chaque enregistrement, l'application relit le fichier. S'il a été modifié ailleurs (autre fenêtre, autre ordinateur, autre version), elle **fusionne** au lieu de remplacer :
  - les saisies des deux côtés sont gardées ;
  - pour une même saisie modifiée des deux côtés, c'est la modification la plus récente qui l'emporte ;
  - les suppressions sont respectées ;
  - pour les réglages (coûts, indicateurs, compétences, profil…), seuls les changements réellement faits dans chaque fenêtre sont gardés : une fenêtre restée ouverte depuis longtemps ne peut plus effacer ce que tu as saisi dans une autre.
- **Copies de sécurité** dans `sauvegardes/` :
  - une par heure, gardée 48 h ;
  - puis une par jour, gardée 30 jours ;
  - plus une copie juste avant chaque fusion.
- **Version périmée = lecture seule.** Une version de l'application plus ancienne que celle qui a enregistré ton carnet ne peut plus l'écrire. Un bandeau te le signale.
- **Importer des saisies depuis un tableur** : en bas de page, **Importer un CSV** (voir la [partie 5](#5-coach--ta-fiche), « Reprendre ton historique »).
- **Récupérer des saisies perdues.**
  1. En bas de page, clique sur **Importer un JSON**.
  2. Choisis une copie dans `sauvegardes/`.
  3. Réponds **OK (fusionner)**.

  Les saisies manquantes reviennent, sans rien supprimer. Les réglages perdus (par exemple des lignes de coût) reviennent aussi : les lignes absentes sont ajoutées, et une valeur vide est complétée par celle de la copie.
- **Plusieurs carnets.** Paramètres > Stockage des données > Ouvrir un autre carnet ou Nouveau carnet. Un dossier qui contient déjà un carnet n'est jamais écrasé par un autre.
- **Sans dossier relié**, les données ne sont gardées que dans ce navigateur. Un bandeau jaune te propose alors d'en choisir un.

---

## 15. Nouveautés et versions

- **Numérotation `x.y.z`** : x = version majeure, y = nouvelle fonctionnalité, z = correctif. La version s'affiche en bas de page.
- **Écran des nouveautés.** Au premier lancement d'une nouvelle version, une fenêtre présente ce qui a changé depuis ta dernière visite, avec des boutons qui mènent à chaque fonction. La version déjà vue est enregistrée dans ton carnet. Le lien **Nouveautés**, en bas de page, permet de les revoir.
- **La mise à jour est automatique.** Au lancement suivant, une bannière « Nouvelle version disponible » peut proposer de recharger. Si tu as un doute, ferme puis rouvre l'application.

---

## 16. Partager à un pair

Envoie-lui simplement l'adresse **carnet-de-coach.fr**. Il l'installe à son tour (voir la [partie 1](#1-mise-en-route)) et démarre avec « Commencer ». Ses données restent chez lui, et les tiennes chez toi.

Pour lui transmettre aussi ta configuration (types, couleurs, axes, indicateurs) sans tes données, va dans **Paramètres > Partager à un pair > Exporter un modèle sans données**, et envoie-lui le fichier obtenu. Ton pair choisit ensuite « Importer une sauvegarde ou un modèle » à l'accueil.

---

## 17. En cas de souci

- **L'application ne se met plus à jour, ou se comporte bizarrement.** Ferme-la, rouvre l'adresse dans Chrome ou Edge, puis recharge avec Ctrl+F5.
- **Bandeau jaune « Reconnecter le dossier ».** Clique dessus et autorise l'accès. Choisis « Autoriser à chaque visite » si l'option est proposée.
- **L'ancienne icône reste affichée dans le menu Démarrer ou la barre des tâches.** Désinstalle l'application (clic droit sur l'icône, ou menu ⋯ de la fenêtre > Désinstaller), puis réinstalle-la depuis son adresse. Tes données ne bougent pas : elles sont dans ton dossier.
- **La nouvelle version n'apparaît pas.** Ferme complètement l'application et rouvre-la, ou recharge avec Ctrl+F5. Le numéro en bas de page fait foi.
- **Bandeau « lecture seule ».** Tu utilises une version plus ancienne que celle qui a enregistré ton carnet, par exemple une ancienne copie de l'application. Recharge (Ctrl+F5), ou ouvre l'application installée.
- **Des saisies ont disparu.** Voir « Récupérer des saisies perdues » dans la [partie 14](#14-tes-données--enregistrement-sauvegardes-récupération).
- **Mot de passe oublié.** Utilise la clé de secours sur l'écran de verrouillage.
- **Ouvrir un autre carnet ou en créer un nouveau.**
  - Si l'application est ouverte : Paramètres > Stockage des données.
  - Si elle est verrouillée : clique sur le lien en bas de l'écran de verrouillage.

---

## 18. Licence et usage

L'outil est publié sous **licence PolyForm Shield 1.0.0** (fichier `LICENSE`).

- **Gratuit pour tous les coachs**, y compris pour leur activité professionnelle : tu peux l'utiliser, le copier, l'adapter et le partager.
- **Interdit sans accord** : le revendre, ou en tirer un produit ou un service concurrent (version payante, marque blanche…).
- En le partageant, transmets aussi le fichier `LICENSE`.

Pour un usage commercial (revente, intégration dans une offre payante, marque blanche), contacte Allan Oudomphong.

---

## 19. Historique des versions

| Version | Date | Principales évolutions |
|---|---|---|
| **3.1.0** | 14/11/2026 | Écran « À quoi sert ton carnet » dans le parcours de démarrage (2e étape) et en tête de l'onglet À propos. Version anglaise complétée (messages, missions, rappels, anciennes nouveautés). Trois questions de plus dans À propos (retrouver ou corriger une saisie, choisir tes indicateurs, contenu de Paramètres). Site refondu autour des trois valeurs, captures renouvelées. |
| 3.0.0 | 14/11/2026 | XP de pratique à la place des notes d'aisance de 1 à 5 : chaque entretien rapporte des XP selon sa durée et son type, à répartir entre tes compétences (focus en tête, raccourcis, XP non répartis signalés dans Mes saisies). Niveaux par compétence, boussole de pratique (part des XP et 30 derniers jours), panneau XP avec transferts et historique. Compétence Facultés commerciales (0 à 5 XP et commentaire après une rencontre, une invitation ou une proposition). Indicateur XP de pratique, hauts faits d'XP, export CSV. Conversion des anciennes notes, avec une copie de sécurité automatique avant la migration. |
| 2.5.0 | 14/11/2026 | Onglet Réseau (mode complet) : vues Cercles, Public, Problématique et Orbites, avec l'étape, le nombre d'échanges, les personnes à relancer, les passerelles et les recommandations ; panneau « Ce que montre ton réseau » (passerelles, groupes à réchauffer, pistes de développement, chaînes de recommandation). Le socle de la démarche : entretenir ton réseau. Démo enrichie de dix contacts réseau. |
| 2.4.0 | 14/11/2026 | « Traiter » dans À relancer (fait, annulée, replanifier, plus tard, commentaire). Rythme de contact par personne et relance au rythme, avec « Préparer ». Fiche personne en onglets Infos, Notes et Échanges : cercles, proximité, recommandé·e ou présenté·e par, prochain sujet à évoquer, notes des échanges. Pipeline à partir de l'invitation (colonne Invité·e), contacts réseau hors pipeline. Indicateurs Réseau entretenu, Personnes vues et Recommandations ; niveau et total dans les bandeaux. « Plus tard » réglable. Export CSV des personnes. |
| 2.3.1 | 14/11/2026 | Bouton ↺ dans Paramètres pour rendre son nom d'origine à un type intégré renommé. Alerte « bilan ou renouvellement » une seule fois par contrat. Supprimer une action du plan d'action (✕, annulable). |
| 2.3.0 | 13/11/2026 | Recherche de personne au fil de la frappe (accents et majuscules ignorés, « + Créer ») dans la saisie, Mes saisies et le plan d'action. Rencontre réseau en tête du parcours, avec « Ce qu'on a vu » sur plusieurs lignes. « Personnes archivées » au lieu de « Clients archivés ». |
| 2.2.0 | 11/11/2026 | Supprimer une personne (ses saisies restent). Durée libre dans Mes saisies (« Autre… »). Personne obligatoire, réglable type par type. Les barres de niveau repartent de zéro à chaque niveau. |
| 2.1.0 | 09/11/2026 | Visite guidée du carnet de démonstration : la démarche en un écran, puis les pages en neuf étapes ; « Revoir la visite » dans le bandeau. La démonstration s'ouvre en mode simplifié. La petite maison ouvre le site carnet-de-coach.fr. |
| 2.0.0 | 11/2026 | Carnet de coach a son site (présentation, démarche, captures, questions fréquentes, en français et en anglais). Nouvelle adresse : **carnet-de-coach.fr**, avec l'application sur carnet-de-coach.fr/app/. Réinstalle-la depuis cette adresse, puis choisis « J'ai déjà un carnet : ouvrir son dossier » et sélectionne ton dossier ; tes données ne bougent pas. |
| 1.12.2 | 08/11/2026 | Lien direct vers le carnet de démonstration (adresse se terminant par ?demo=1). Le lien « Explorer un carnet de démonstration » est masqué quand ton carnet est ouvert. |
| 1.12.1 | 08/11/2026 | Bouton Accueil (petite maison) à gauche des onglets. Changement de langue instantané, sans reverrouiller un carnet chiffré. |
| 1.12.0 | 08/11/2026 | L'application en anglais : bouton FR / EN pour changer de langue à tout moment ; carnet de démonstration et page d'architecture en anglais ; manuel en anglais (README.en.md). |
| 1.11.0 | 08/11/2026 | Carnet de démonstration (Camille Martin, coach fictive), à ouvrir depuis l'accueil. |
| 1.10.1 | 08/11/2026 | Aisance commerciale dans Suivi d'activité. L'étape Contact devient Rencontre. Onglets Paramètres et À propos colorés. Accueil plus compact, sur le vert du carnet. Fiche personne aérée. Correctif : une pastille vide restait visible en haut de l'écran. |
| 1.10.0 | 08/11/2026 | Onglet À propos : mot d'accueil, démarche, architecture et questions fréquentes. Compter tes non (invitation « Elle a dit non », propositions refusées) dans Suivi d'activité et en hauts faits. Fiche personne : listes déroulantes pour provenance, public et problématique ; cases de recommandation. Mes saisies affiche l'étape de la personne. Accueil avec photo. Hauts faits du thème Jeu vidéo sur trois colonnes. Démarche précisée : un cycle de durée fixée, à un prix juste. |
| 1.9.1 | 08/11/2026 | Page « Créer tes clients par la relation » réécrite en six principes ; étapes du pipeline précisées (conversation de coaching, rendez-vous de proposition, recommandation). |
| 1.9.0 | 08/11/2026 | Nouvel accueil en 3 écrans, puis un carnet de route : une mission à la fois, en 4 chapitres, avec « Montre-moi ». Pages « Développer ton activité par la relation » et étapes du pipeline reliées aux saisies (« ? Les étapes »). Célébrations des niveaux et des hauts faits, en trois intensités. Victoires avec image et récit. Page « Comment l'outil est construit ». |
| 1.8.2 | 07/11/2026 | Niveaux recalibrés : une courbe par statistique, sur le parcours d'un coach régulier ; supervision en heures ; clients et renouvellements ; CA en deux temps (paliers puis meilleur CA sur 12 mois glissants) ; moyenne des seules statistiques déjà saisies. |
| 1.8.1 | 07/11/2026 | Nouvelle échelle des niveaux, à l'essai : chaque statistique rapportée au rythme d'un coach régulier ; niveau global et rang = moyenne des statistiques. Coins des fenêtres de nouveau arrondis. |
| 1.8.0 | 07/11/2026 | Mode simplifié, activable à tout moment (bouton en haut à droite) et proposé au premier lancement. Notes sur l'entretien dans la saisie. Types dans l'ordre du parcours (Invitation › … › Supervision), fenêtre de saisie élargie, aisance sur deux colonnes. « À relancer » dans Personnes. Métriques devient Suivi d'activité. Correctif : fond bleu derrière « via … » dans la vue Liste. |
| 1.7.0 | 06/11/2026 | Métriques : graphique « Développer ton activité » (entonnoir invitations → conversations → propositions → clients, taux de passage, CA signé, panier moyen ; vue par mois) à la place du graphique d'aisance. Fiche coach : hauts faits automatiques et victoires, affinités public × problématique (nouveaux champs de la fiche personne). Reprise de l'historique : import CSV des saisies et déclaration des totaux d'avant l'outil. |
| 1.6.1 | 06/11/2026 | Plus d'exemples tirés de la pratique d'un autre coach dans les champs ; un nouveau carnet démarre sans compétences ni phrase de motivation pré-remplies. |
| 1.6.0 | 06/11/2026 | Onglet Coach : fiche avec profil, rang et niveau (1 à 100), boussole d'aisance par discipline avec focus et actions, statistiques avec niveaux ; thèmes Professionnel et Jeu vidéo ; accord des libellés. Compétences gérées depuis la boussole. Correctif : une fenêtre restée ouverte ne peut plus effacer les réglages saisis dans une autre (fusion à trois voies). Lignes fixes des coûts sans cadenas. |
| 1.5.0 | 05/11/2026 | Onglet Pratique délibérée : boussole d'aisance (moyenne des 5 dernières notes et tendance), 3 focus, 3 actions en cours et bibliothèque d'actions, remarques par compétence dans chaque saisie, historique d'une compétence, préparation de la supervision avec ce qu'on en retient. Nouveau type Invitation et indicateur Invitations. « Métriques d'aisance » devient « Compétences d'aisance ». |
| 1.4.0 | 04/11/2026 | Nouvelle icône de l'application. L'icône de l'onglet et de la fenêtre reprend le logo du carnet. |
| 1.3.4 | 04/11/2026 | Coûts : taux moyen de prélèvement URSSAF, appliqué au CA accepté et compté comme une charge. |
| 1.3.3 | 04/11/2026 | Frises : les pastilles des types les mieux classés passent au premier plan. |
| 1.3.2 | 04/11/2026 | Personne modifiable dans Mes saisies (liste déroulante), loupe pour filtrer. |
| 1.3.1 | 04/11/2026 | Montant personnalisé par supervision : vide = prix moyen, sinon le montant saisi prend le pas. |
| 1.3.0 | 04/11/2026 | Coûts de l'activité ligne par ligne, avec répartition en anneau, supervision calculée sur les séances payantes, case « non payante » et choix du calcul par tuile. Nouvelle fiche personne en deux moitiés (icônes de contact, frise datée, aisance sur tous les axes, plan d'action). Mes saisies : tuile à côté des filtres, onglets, années décroissantes. Pipeline : cartes agrandies. Blocs repliables sur le tableau de bord et dans les Paramètres, Paramètres réorganisés. |
| 1.2.3 | 04/11/2026 | Tableaux resserrés (colonnes courtes au plus juste). CR et Synth. avant « Ce qu'on a vu ». Personnes : pipeline par défaut, sélecteur avant la recherche. Manuel d'utilisation complet. |
| 1.2.2 | 04/11/2026 | Affichage adapté à la résolution : toute la largeur, graphiques à la taille de leur cadre, « À relancer » et priorités côte à côte sur grand écran. |
| 1.2.1 | 04/11/2026 | Étape Superviseur.e, « Client.e », tuiles compactes, téléphone espacé automatiquement. |
| 1.2.0 | 04/11/2026 | Propositions en attente dans « À relancer ». Site web à la place de LinkedIn. Notes et contrat repliables dans Mes saisies. Correctif : coordonnées de la fiche parfois non enregistrées. |
| 1.1.2 | 04/11/2026 | Écran des nouveautés. Parcours complété et lisible sur tous les écrans. « Compte dans » modifiable pour tous les types. Numérotation x.y.z. |
| 1.1.1 | 04/11/2026 | Bouton En entier / Au prorata pour les charges, avec les deux taux côte à côte. |
| 1.1.0 | 04/11/2026 | CRM : fiches personnes, photo, étapes, pipeline, contrats, « À relancer ». |
| 1.0 | 02/11/2026 | Version partagée aux pairs : catalogue de 19 indicateurs, enregistrements sécurisés (fusion, sauvegardes), 10 types, archivage, coûts et taux horaire. |

---

## 20. À propos

Le dernier onglet, **À propos**, rassemble :

- **à quoi sert ton carnet**, en tête de l'onglet : les trois valeurs présentées au démarrage ;
- **le mot d'accueil**, celui du premier lancement ;
- **la démarche** « Créer tes clients par la relation », avec le bouton « Lire la démarche » ;
- **la façon dont l'outil est construit**, avec le bouton « Voir les schémas » (voir la [partie 21](#21-comment-loutil-est-construit)) ;
- **les questions fréquentes**, en trois groupes : tes données, utiliser le carnet, l'outil.

Les onglets Paramètres et À propos ont leur propre couleur, pour les distinguer des onglets de travail.

---

## 21. Comment l'outil est construit

Pour les curieux, et pour qui voudrait l'auditer : la page **[Comment l'outil est construit](app/arch.html)**, livrée avec l'application, le montre en quatre schémas, en français ou en anglais (bouton FR / EN).

- **Vue d'ensemble.** Un seul fichier `index.html`, sans serveur ni compte : l'application tourne dans ton navigateur et ne fait aucun appel réseau avec tes données. Un petit script (`sw.js`) la garde disponible hors ligne et installe les mises à jour.
- **Tes données.** Un seul fichier `coaching-data.json` dans le dossier que tu choisis : saisies, personnes, réglages, profil de coach, pratique délibérée. Une copie est gardée dans le navigateur, au cas où le dossier serait momentanément inaccessible.
- **Une saisie, du clic au fichier.** Chaque modification met à jour l'écran, puis est enregistrée au bout d'une fraction de seconde, après relecture et fusion du fichier si besoin.
- **Sécurité.** Chiffrement AES-GCM par ton mot de passe, clé de secours, copies de sécurité horaires puis quotidiennes.
