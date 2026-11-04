# Suivi de pratique de coaching

**Version 1.3.4 (4 novembre 2026)** · Outil © 2026 Allan Oudomphong · Licence PolyForm Shield 1.0.0

Un carnet de bord pour piloter ta pratique de coach. Tu y enregistres tes entretiens, tes propositions et les personnes que tu accompagnes, et tu y suis tes indicateurs, ton aisance, tes objectifs et tes relances.

L'application s'ouvre depuis son adresse web et s'installe sur ton ordinateur comme une application. Il n'y a ni compte à créer ni abonnement. **Tes données ne sont jamais en ligne** : elles restent sur ton ordinateur, dans **un seul fichier** `coaching-data.json`, rangé dans le dossier de ton choix.

- Ce fichier contient tes saisies, tes réglages, ton logo et ton bandeau.
- Il peut être chiffré par un mot de passe.
- Une copie de sécurité en est faite automatiquement dans le sous-dossier `sauvegardes/`.

**Navigateur requis :** Chrome ou Edge sur ordinateur. Firefox, Safari et les mobiles ne savent pas écrire dans un dossier.

## Sommaire

1. [Mise en route](#1-mise-en-route)
2. [Premier lancement : le parcours de démarrage](#2-premier-lancement--le-parcours-de-démarrage)
3. [Enregistrer un temps](#3-enregistrer-un-temps)
4. [Tableau de bord](#4-tableau-de-bord)
5. [Métriques](#5-métriques)
6. [Mes saisies](#6-mes-saisies)
7. [Personnes](#7-personnes)
8. [Propositions et contrats](#8-propositions-et-contrats)
9. [Coûts et taux horaire réel](#9-coûts-et-taux-horaire-réel)
10. [Paramètres](#10-paramètres)
11. [Sécurité et chiffrement](#11-sécurité-et-chiffrement)
12. [Tes données : enregistrement, sauvegardes, récupération](#12-tes-données--enregistrement-sauvegardes-récupération)
13. [Nouveautés et versions](#13-nouveautés-et-versions)
14. [Partager à un pair](#14-partager-à-un-pair)
15. [En cas de souci](#15-en-cas-de-souci)
16. [Licence et usage](#16-licence-et-usage)
17. [Historique des versions](#17-historique-des-versions)

---

## 1. Mise en route

### Installer l'application (2 minutes, une seule fois)

1. Ouvre **l'adresse de l'application** dans Chrome ou Edge. C'est le lien qu'on t'a transmis.
2. Clique sur l'icône **Installer**, à droite de la barre d'adresse : un écran avec une flèche vers le bas. Dans Edge, l'option est aussi dans le menu **⋯ > Applications > Installer ce site en tant qu'application**.
3. L'application apparaît dans ton menu Démarrer, ou dans le Dock et le Launchpad sur Mac. Elle s'ouvre dans sa propre fenêtre et **fonctionne même hors ligne**.

**Les mises à jour sont automatiques.** Au lancement suivant, une bannière « Nouvelle version disponible » propose de recharger, puis un écran présente les nouveautés (voir la [partie 13](#13-nouveautés-et-versions)).

### Choisir où ranger son carnet

Choisis un dossier sur ton ordinateur, de préférence synchronisé (OneDrive, Google Drive…) : ton carnet te suit alors d'un ordinateur à l'autre, et il est sauvegardé.

- **Tu commences :** clique sur « Commencer ». Le parcours de démarrage te demandera le dossier à la fin.
- **Tu as déjà un `coaching-data.json` :** à l'accueil, clique sur « J'ai déjà un carnet : ouvrir son dossier ».

Quand le navigateur demande l'accès au dossier, choisis **« Autoriser à chaque visite »** si l'option est proposée. Tu n'auras plus rien à faire aux lancements suivants.

> Mets ton carnet dans un dossier à toi. Ne le dépose jamais dans un espace public ou partagé avec d'autres personnes.

---

## 2. Premier lancement : le parcours de démarrage

Un carnet neuf s'ouvre sur un parcours en 11 étapes, d'environ 5 minutes. Le panneau de gauche montre en direct ton logo, ton nom et l'avancement. Tout reste modifiable ensuite, et le parcours se relance depuis **Paramètres > Relancer le parcours**.

| Étape | Ce que tu y fais |
|---|---|
| Bienvenue | Lettre d'accueil. Liens pour ouvrir un carnet existant ou importer une sauvegarde ou un modèle. |
| Le principe | Données chez toi, chiffrement, enregistrement continu. |
| Ton identité | Nom du cabinet, nom de l'outil, phrase de motivation, logo, bandeau, palette de couleurs. |
| Tes types d'entretien | Libellé, couleur, durée par défaut, notes d'aisance, rubrique où le type est compté (« Compte dans »), ordre d'importance par glisser-déposer, ajout de types (10 au maximum). |
| Le suivi | Les 3 piliers (coacher beaucoup, pratiquer délibérément, développer ton activité), les 4 onglets et le choix de tes indicateurs. |
| Tes axes de progression | Les dimensions que tu notes de 1 à 5 après un entretien, avec des suggestions. |
| Priorités et objectifs | Tes objectifs prioritaires (3 au maximum, c'est l'idéal), l'ambition et les cibles du trimestre. |
| Premières actions | Les prochains pas concrets, avec une date. |
| Personnes et coûts | Seuil d'alerte « sans contact », prix moyen d'une supervision, taux moyen de prélèvement URSSAF, tes autres coûts annuels ligne par ligne, mode de calcul des charges. Cette étape peut être passée. |
| Premier entretien | Une vraie saisie, pour prendre le geste. Elle peut être passée. |
| Sécurité | Dossier où ranger le carnet et mot de passe (recommandé). La clé de secours t'est remise à ce moment-là. |

---

## 3. Enregistrer un temps

C'est le geste quotidien : après chaque entretien, clique sur **« + Enregistrer un temps »**, en haut à droite. Il faut moins de 30 secondes.

- **Date.** Aujourd'hui par défaut.
- **Type.** Un bouton par type d'activité, dans sa couleur.
- **Durée.**
  - Des boutons proposent les durées courantes.
  - Le champ « Autre durée » accepte `2,5`, `2.5`, `2h30`, `2h`, `150min` ou `1:30`.
  - Un nombre seul compte en heures jusqu'à 10, en minutes au-delà. Il n'y a pas de plafond.
- **Personne.**
  - Les personnes les plus fréquentes apparaissent en boutons.
  - Les personnes archivées sont dans une liste déroulante.
  - « + Nouvelle » crée une nouvelle personne : tape « Prénom Nom », puis Entrée.
- **Ce qu'on a vu.** Une ligne : thème, déclic, pattern repéré.
- **Suivi.** Cases « CR envoyé » et « Synthèse écrite », pour les entretiens en face à face.
- **Aisance.** Une note de 1 à 5 pour chacun de tes axes de progression, pour les types où l'aisance est activée.
- **Proposition.** Montant, nombre de séances prévues, durée d'engagement. Une proposition est enregistrée « En attente » (voir la [partie 8](#8-propositions-et-contrats)).
- **Supervision.** Coût de cette séance. Laisse le champ vide pour compter le prix moyen indiqué dans les Paramètres (il s'affiche en grisé), ou saisis le montant réel : il prend le pas sur le prix moyen. Si tu changes ensuite le prix moyen, toutes les séances sans montant personnalisé suivent. Coche **« Supervision non payante »** pour une séance offerte ou incluse ailleurs : elle n'entre alors pas dans tes coûts.

---

## 4. Tableau de bord

C'est ton cap : à regarder une fois par semaine.

### Indicateurs principaux

Ce sont les 3 premiers indicateurs que tu as choisis (voir la [partie 5](#5-métriques)). Ils affichent la valeur de l'année, celle des 31 derniers jours et une courbe de tendance. Pour les changer, clique sur « Changer mes indicateurs ».

### À relancer

La liste de ce qui demande une action, avec les plus urgents en premier.

| Alerte | Quand elle apparaît | Boutons |
|---|---|---|
| **Action liée à une personne** | Elle est en retard ou prévue dans les 7 jours. | Fait |
| **Proposition en attente** | Une proposition attend une réponse et aucune action n'est prévue pour la personne. Le délai d'attente passe en rouge à partir de 14 jours. | Acceptée · Refusée (annulable) · Planifier une relance (dans 2 jours) · Plus tard (une semaine) |
| **Fin d'accompagnement** | Le contrat se termine dans les 21 jours, s'est terminé depuis moins de 45 jours, ou la dernière séance prévue est atteinte. | Planifier le bilan · Plus tard (14 jours) |
| **Sans contact** | La personne est en conversation ou en attente de réponse, sans action prévue, et sans contact depuis le seuil choisi (30 jours par défaut, aucune alerte au-delà de 365 jours). | Planifier une relance · Plus tard · Sans suite |

Clique sur un nom pour ouvrir la fiche de la personne.

### Objectif prioritaire

Tes priorités du moment, avec pour chacune son objet et ce qu'elle veut dire pour toi. Tu peux les réordonner avec les flèches ou par glisser-déposer.

### Plan d'action

Ce bloc est ouvert par défaut. Clique sur son titre pour le replier : il affiche alors un résumé, avec le nombre d'actions en cours et en retard.

Chaque action a un objectif prioritaire, une description, une personne (facultative), une date prévue, un résultat et un statut : En cours, Réalisée ou Annulée.

- Une action en retard s'affiche en rouge.
- Les pastilles « En cours », « Réalisées » et « Annulées » filtrent la liste.
- Les actions créées depuis une fiche ou une relance ont pour objectif « Relance ».

### Suivi indicateurs

Tes cibles par trimestre, semestre et année : heures de coaching, conversations, personnes coachées, pratique délibérée, CA accepté. Chaque période a une phrase d'ambition. Une barre montre l'avancement. Le menu en haut à droite permet de choisir la période.

Ce bloc est replié par défaut. Clique sur son titre pour l'ouvrir : replié, il affiche la période et l'avancement des cibles du trimestre. Ton choix d'ouverture est mémorisé sur ton ordinateur.

> Sur un écran large (1700 px et plus), « À relancer » et « Objectif prioritaire » s'affichent côte à côte.

---

## 5. Métriques

### Mes indicateurs

Tu choisis 6 indicateurs au maximum. Les 3 premiers sont **principaux** : ils s'affichent en grand, aussi sur le tableau de bord. Les suivants sont secondaires.

- Pour échanger deux indicateurs, glisse l'un sur l'autre.
- Pour en changer, ouvre « Choisir mes indicateurs ». Le catalogue affiche ta valeur réelle à date pour chacun.

Le catalogue compte 19 indicateurs, répartis en 4 piliers :

- **Coacher beaucoup :**
  - heures de coaching ;
  - conversations ;
  - personnes coachées ;
  - régularité (semaines actives sur les 12 dernières) ;
  - nouvelles personnes ;
  - clients actifs (31 jours).
- **Pratiquer délibérément :**
  - pratique délibérée ;
  - discipline post-séance (CR, synthèse et notes, sur 90 jours glissants) ;
  - aisance moyenne ;
  - atteinte de l'objectif du rendez-vous.
- **Développer l'activité :**
  - CA accepté / proposé ;
  - taux de transformation ;
  - propositions en attente ;
  - taux d'acceptation ;
  - panier moyen ;
  - taux horaire réel.
- **Piloter :**
  - actions en retard ;
  - avancement des cibles du trimestre ;
  - part du coaching dans ton temps total.

### Graphiques

- **Année.** Les boutons 2024, 2025, 2026… choisissent l'année affichée.
- **Temps passé par mois.** Une barre empilée par mois, avec le n° 1 de tes types à la base. Survole une barre pour voir le détail.
- **Aisance.** Deux vues :
  - « Toutes les métriques » : une courbe par axe ;
  - « Une métrique par type » : une courbe par type d'entretien pour l'axe choisi.

  Clique sur un élément de la légende pour le masquer ou l'afficher. Glisse-le pour changer l'ordre.

---

## 6. Mes saisies

Le détail de tous tes entretiens, filtrable et modifiable directement dans le tableau.

- **Filtres.**
  - Clique sur une année, un type ou une ou plusieurs personnes. Clique à nouveau pour retirer le filtre.
  - Les clients archivés sont dans une liste déroulante.
- **Résumé.** Nombre de saisies, temps total, dont coaching, pratique délibérée, et pourcentages de CR et de synthèses faits.
- **Tuile de la personne.** Quand tu sélectionnes une personne, sa tuile s'affiche à droite des filtres. Si tu en sélectionnes plusieurs, un onglet par personne permet de passer de l'une à l'autre.
  - **À gauche :** son badge (Client.e, Pro bono, Superviseur.e ou Réseau), sa fonction et son site, ses dates, ses chiffres, et les boutons Fiche et Archiver.
  - **À droite :** son aisance moyenne sur chacun de tes axes suivis.
  - **En dessous :** la frise de ses échanges, avec la date (jj/mm) au-dessus de chaque échange et l'année au milieu de sa période.
- **Années.** Elles sont classées de la plus récente à la plus ancienne.
- **Tableau.** Les colonnes sont, dans l'ordre : Personne, Date, Type, Durée, CR, Synth., Ce qu'on a vu, Notes, Contrat / coût.
  - **Notes** est replié par défaut et montre un résumé des valeurs. Un clic sur l'en-tête ou sur une cellule déplie les colonnes d'axes, sur un fond bleu pâle, pour les modifier.
  - **Contrat / coût** est replié par défaut. Une fois déplié, sur un fond rosé, il montre : Accepté (statut), Montant (ou coût d'une supervision), Durée, Séances. Sur une supervision, la case « non payante » remplace le statut.
  - **Personne** est une liste : tu peux changer la personne d'une saisie ou la retirer (« — »), par exemple pour indiquer qui t'a supervisé. La petite loupe à côté filtre le tableau sur cette personne.
  - Chaque modification est enregistrée aussitôt.
  - ✕ supprime une saisie. L'annulation est possible quelques secondes.
- **Afficher les métriques archivées.** Fait réapparaître les axes que tu ne suis plus.
- **Exporter CSV** (en bas de page). Un tableur de toutes tes saisies.

---

## 7. Personnes

### Vues

- **Pipeline** (par défaut) : une colonne par étape, avec son nombre de personnes et ses totaux (propositions en attente, contrats en cours).
  - Chaque carte montre la photo et le nom, puis, sur toute la largeur : la fonction, le montant en attente ou l'avancement du contrat, la prochaine action ou le dernier contact. Une icône ouvre le site de la personne.
  - Glisse une carte dans une autre colonne pour changer son étape à la main.
  - Remettre « Automatique » sur la fiche efface ce choix manuel.
- **Liste** : des tuiles compactes, avec la photo, le nom, l'étape, la provenance, la fonction, le site, le dernier contact, le contrat et la prochaine action.
  - Des filtres par étape indiquent le nombre de personnes dans chacune.
  - Les tuiles sont triées par prochaine action, puis par dernier contact.
- **Recherche** : sur le nom, la fonction, la provenance, les notes et le site.
- **Personnes archivées** : case à cocher pour les afficher.

### Les étapes

L'étape se calcule toute seule à partir de tes saisies :

| Étape | Règle automatique |
|---|---|
| Contact | Aucune conversation ni session. |
| En conversation | Au moins une conversation ou une session, sans proposition en attente. |
| Proposition envoyée | Au moins une proposition « En attente ». |
| Client.e | Un contrat en cours, ou une séance après la fin du contrat. |
| Accompagnement terminé | Le contrat est échu. Sans durée d'engagement, la personne passe dans cette étape après 120 jours sans contact. |
| Sans suite | Toutes les propositions sont refusées et il n'y a pas eu de contact depuis, ou c'est un choix manuel. |
| Superviseur.e | Au moins une supervision avec cette personne, et aucune proposition acceptée. |

Une étape choisie à la main, sur la fiche ou par glisser-déposer, reste valable jusqu'à la saisie suivante concernant la personne.

### La fiche personne

Pour ouvrir une fiche, clique sur une carte, sur un nom dans « À relancer », ou sur « Fiche » dans Mes saisies. Tu peux aussi créer une personne avec « + Nouvelle personne ». La fiche est organisée en deux moitiés.

**À gauche, qui est la personne :**

- **Photo.**
  - Clique sur le rond ou sur « Photo », choisis une image, puis cadre-la dans le disque : glisse pour centrer, puis zoome avec le curseur ou la molette.
  - La photo est compressée (environ 5 Ko) et stockée dans ton carnet, donc chiffrée avec lui.
- **Nom.** Des icônes apparaissent à côté du nom dès que l'information correspondante est renseignée :
  - l'enveloppe ouvre ta messagerie ;
  - le globe ouvre le site ;
  - le combiné lance l'appel, seulement sur un téléphone ou une tablette.
- **Fonction**, en une ligne : par exemple « Cheffe de projet chez Michel Musique ».
- **Téléphone, e-mail, site web.** Le téléphone s'espace automatiquement : `0123456789` devient `01 23 45 67 89`, et `+33123456789` devient `+33 1 23 45 67 89`.
- **Étape** (automatique ou manuelle) et **provenance**. La provenance propose les valeurs déjà utilisées sur tes autres fiches.
- **Description.** Contexte, enjeux, ce qu'il faut savoir.

**À droite, où vous en êtes :**

- **Chiffres.** Dernier contact, heures de coaching, conversations, sessions, contrat, premier contact.
- **Contrat**, s'il y en a un. Montant, durée et avancement, avec le début, les séances prévues et la durée, modifiables.
- **Échanges.** Une frise avec une pastille par échange, dans la couleur de son type. Quand des pastilles se chevauchent, celles des types les mieux classés dans Paramètres > Types d'activité passent au-dessus : par exemple les sessions au-dessus des débriefs. La date (jj/mm) est au-dessus de chaque pastille et l'année au milieu de sa période. Survole une pastille pour voir le détail.
- **Aisance moyenne** sur tous tes axes suivis, en deux colonnes.
- **Plan d'action.** Les actions liées à la personne. Tu peux en ajouter avec une date et les cocher une fois faites. Elles apparaissent aussi dans le plan d'action du tableau de bord.

**En bas :**

- **Archiver / Réactiver.** Une personne archivée sort des boutons de saisie et des filtres, mais garde tout son historique.
- **Voir ses saisies.** Ouvre Mes saisies, filtré sur elle.
- **Terminé.** Ferme la fiche.

Tout est enregistré pendant la frappe.

---

## 8. Propositions et contrats

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
5. À l'approche de la fin, ou à la dernière séance prévue, « À relancer » te propose de **planifier le bilan**.

Seules les propositions de plus de 0 € comptent dans les indicateurs commerciaux : propositions, taux d'acceptation, CA, panier moyen.

---

## 9. Coûts et taux horaire réel

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

## 10. Paramètres

Tous les blocs sont **repliés par défaut**. Clique sur un titre, ou sur le triangle placé avant lui, pour ouvrir ou fermer le bloc. Replié, chaque bloc affiche un résumé d'une ligne. Ton choix est mémorisé sur ton ordinateur.

Les blocs vont par deux, dans cet ordre :

| Gauche | Droite |
|---|---|
| **Identité** : nom du cabinet, nom de l'outil, phrase de motivation. | **Apparence** : logo et bandeau côte à côte, les 5 couleurs de marque (Accent, Foncé, Fond, Gris, Bleu), « Revenir à la palette par défaut ». |
| **Sécurité** : chiffrement, verrouillage automatique, mot de passe, clé de secours (voir la [partie 11](#11-sécurité-et-chiffrement)). | **Stockage des données** : dossier relié, « Ouvrir un autre carnet », « Nouveau carnet ». |
| **Types d'activité** (10 au maximum) : ordre d'importance par glisser-déposer (le n° 1 est à la base des graphiques), couleur, libellé, durée par défaut, notes d'aisance, **Compte dans**. Un type ajouté ne peut être supprimé que s'il n'a aucune saisie. | **Métriques d'aisance** : libellé, repères du 1 et du 5, ordre. Un axe « non suivi » disparaît de la saisie mais garde son historique. Renommer un axe conserve ses notes. Un axe n'est supprimable que s'il n'a aucune note. |
| **Suivi des personnes** : seuil de l'alerte « sans contact », en jours. | **Indicateurs suivis en bandeaux** : choix des 6 indicateurs affichés en haut du tableau de bord et des Métriques. |
| **Coûts de l'activité**, sur toute la largeur (voir la [partie 9](#9-coûts-et-taux-horaire-réel)). | |
| **Partager à un pair** : « Exporter un modèle sans données ». | **Parcours de démarrage** : « Relancer le parcours ». |

Quelques précisions :

- **Compte dans** décide dans quel indicateur les heures d'un type sont additionnées : heures de coaching, pratique délibérée, développement ou autre.
- **Les couleurs des types** suivent automatiquement la palette et l'ordre d'importance, tant que tu ne retouches pas une couleur à la main.
- **Sur un écran de moins de 1500 px de large**, Types d'activité et Métriques d'aisance passent l'un sous l'autre.

En bas de chaque page :

- **Changer de dossier** ;
- **Exporter JSON**, qui produit une copie complète ;
- **Exporter CSV** ;
- **Importer un JSON** ;
- le numéro de version et le lien **Nouveautés**.

---

## 11. Sécurité et chiffrement

- **Activer le chiffrement** : Paramètres > Sécurité. Noms, notes, objectifs et photos deviennent illisibles sans ton mot de passe. Les sauvegardes existantes sont chiffrées elles aussi.
- **Clé de secours** : elle t'est remise à l'activation. Garde-la **hors de l'ordinateur**, dans un gestionnaire de mots de passe ou sur papier. Sans le mot de passe ni la clé de secours, personne ne peut plus rouvrir les données, pas même l'auteur de l'outil.
- **Verrouillage automatique** : jamais, ou après 5, 15, 30 ou 60 minutes d'inactivité.
- **Écran de verrouillage** : il propose de déverrouiller avec ton mot de passe ou avec ta clé de secours. Avec la clé de secours, tu choisis ensuite un nouveau mot de passe. Un lien permet aussi d'ouvrir un autre carnet.
- Dans Paramètres, tu peux aussi verrouiller tout de suite, changer de mot de passe, générer une nouvelle clé de secours ou désactiver le chiffrement.

---

## 12. Tes données : enregistrement, sauvegardes, récupération

- **Enregistrement continu.** Chaque modification est enregistrée au bout d'une fraction de seconde. L'état s'affiche en haut à droite.
- **Rien n'est jamais écrasé à l'aveugle.** Avant chaque enregistrement, l'application relit le fichier. S'il a été modifié ailleurs (autre fenêtre, autre ordinateur, autre version), elle **fusionne** au lieu de remplacer :
  - les saisies des deux côtés sont gardées ;
  - pour une même saisie modifiée des deux côtés, c'est la modification la plus récente qui l'emporte ;
  - les suppressions sont respectées.
- **Copies de sécurité** dans `sauvegardes/` :
  - une par heure, gardée 48 h ;
  - puis une par jour, gardée 30 jours ;
  - plus une copie juste avant chaque fusion.
- **Version périmée = lecture seule.** Une version de l'application plus ancienne que celle qui a enregistré ton carnet ne peut plus l'écrire. Un bandeau te le signale.
- **Récupérer des saisies perdues.**
  1. En bas de page, clique sur **Importer un JSON**.
  2. Choisis une copie dans `sauvegardes/`.
  3. Réponds **OK (fusionner)**.

  Les saisies manquantes reviennent, sans rien supprimer.
- **Plusieurs carnets.** Paramètres > Stockage des données > Ouvrir un autre carnet ou Nouveau carnet. Un dossier qui contient déjà un carnet n'est jamais écrasé par un autre.
- **Sans dossier relié**, les données ne sont gardées que dans ce navigateur. Un bandeau jaune te propose alors d'en choisir un.

---

## 13. Nouveautés et versions

- **Numérotation `x.y.z`** : x = version majeure, y = nouvelle fonctionnalité, z = correctif. La version s'affiche en bas de page.
- **Écran des nouveautés.** Au premier lancement d'une nouvelle version, une fenêtre présente ce qui a changé depuis ta dernière visite, avec des boutons qui mènent à chaque fonction. La version déjà vue est enregistrée dans ton carnet. Le lien **Nouveautés**, en bas de page, permet de les revoir.
- **La mise à jour est automatique.** Au lancement suivant, une bannière « Nouvelle version disponible » peut proposer de recharger. Si tu as un doute, ferme puis rouvre l'application.

---

## 14. Partager à un pair

Envoie-lui simplement **l'adresse de l'application**. Il l'installe à son tour (voir la [partie 1](#1-mise-en-route)) et démarre avec « Commencer ». Ses données restent chez lui, et les tiennes chez toi.

Pour lui transmettre aussi ta configuration (types, couleurs, axes, indicateurs) sans tes données, va dans **Paramètres > Partager à un pair > Exporter un modèle sans données**, et envoie-lui le fichier obtenu. Ton pair choisit ensuite « Importer une sauvegarde ou un modèle » à l'accueil.

---

## 15. En cas de souci

- **L'application ne se met plus à jour, ou se comporte bizarrement.** Ferme-la, rouvre l'adresse dans Chrome ou Edge, puis recharge avec Ctrl+F5.
- **Bandeau jaune « Reconnecter le dossier ».** Clique dessus et autorise l'accès. Choisis « Autoriser à chaque visite » si l'option est proposée.
- **La nouvelle version n'apparaît pas.** Ferme complètement l'application et rouvre-la, ou recharge avec Ctrl+F5. Le numéro en bas de page fait foi.
- **Bandeau « lecture seule ».** Tu utilises une version plus ancienne que celle qui a enregistré ton carnet, par exemple une ancienne copie de l'application. Recharge (Ctrl+F5), ou ouvre l'application installée.
- **Des saisies ont disparu.** Voir « Récupérer des saisies perdues » dans la [partie 12](#12-tes-données--enregistrement-sauvegardes-récupération).
- **Mot de passe oublié.** Utilise la clé de secours sur l'écran de verrouillage.
- **Ouvrir un autre carnet ou en créer un nouveau.**
  - Si l'application est ouverte : Paramètres > Stockage des données.
  - Si elle est verrouillée : clique sur le lien en bas de l'écran de verrouillage.

---

## 16. Licence et usage

L'outil est publié sous **licence PolyForm Shield 1.0.0** (fichier `LICENSE`).

- **Gratuit pour tous les coachs**, y compris pour leur activité professionnelle : tu peux l'utiliser, le copier, l'adapter et le partager.
- **Interdit sans accord** : le revendre, ou en tirer un produit ou un service concurrent (version payante, marque blanche…).
- En le partageant, transmets aussi le fichier `LICENSE`.

Pour un usage commercial (revente, intégration dans une offre payante, marque blanche), contacte Allan Oudomphong.

---

## 17. Historique des versions

| Version | Date | Principales évolutions |
|---|---|---|
| **1.3.4** | 04/11/2026 | Coûts : taux moyen de prélèvement URSSAF, appliqué au CA accepté et compté comme une charge. |
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
