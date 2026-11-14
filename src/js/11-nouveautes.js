/* =========================================================
   NOUVEAUTÉS : la version vue est stockée dans le carnet (prefs.nouveautes_vues).
   À chaque publication : APP_VERSION +1, mettre à jour APP_SEMVER, et ajouter une entrée ici (v = APP_VERSION, s = APP_SEMVER).
   ========================================================= */
const NEWS=[
 {v:48,s:'2.5.0',d:'14 novembre 2026',items:[
  {t:'Un onglet Réseau',p:"En mode complet, tes personnes autour de leurs cercles, de leur public ou de leur problématique, ou en orbites autour de toi selon la proximité. La couleur dit l'étape, la taille le nombre d'échanges ; les pointillés rouges signalent qui relancer, le contour doré qui fait le pont entre deux cercles, les flèches dorées qui t'a recommandé qui."},
  {t:'Ce que montre ton réseau',p:"À côté du graphe : les passerelles, les groupes à réchauffer, les pistes de développement (aucune conversation de coaching encore) et les chaînes de recommandation. Un clic sur un nom ouvre la fiche, un clic sur un groupe le met en avant."},
  {t:'Archivé·es et sans suite',p:"Absent·es du graphe par défaut : la case « Inclure archivé·es et sans suite » les affiche en gris. Le dessin est recalculé à l'identique à chaque ouverture ; rien n'est ajouté à ton carnet."}]},
 {v:47,s:'2.4.0',d:'14 novembre 2026',items:[
  {t:'Traiter une relance',p:"Dans « À relancer », chaque ligne a un bouton « Traiter » : c'est fait, annulée, une autre date (+2 j, +1 semaine, +1 mois ou la date de ton choix), plus tard, et un commentaire. Les propositions et les fins d'accompagnement gardent leurs boutons."},
  {t:'Un rythme de contact par personne',p:"Tous les mois, tous les 3 mois (par défaut), tous les 6 mois, une fois par an ou pas de relance. Quand il est dépassé, la personne revient dans « À relancer », avec ses cercles et le sujet à reprendre ; « Préparer » ouvre ses notes."},
  {t:'Une fiche en trois onglets',p:"Infos : cercles, proximité, rythme, « Recommandé·e ou présenté·e par » et les personnes qu'elle t'a recommandées. Notes : ce qu'il faut garder en tête, le prochain sujet à évoquer et toutes les notes de vos échanges. Échanges : le suivi d'avant."},
  {t:"Le pipeline commence à l'invitation",p:"La colonne « Rencontre » devient « Invité·e ». Les contacts réseau et les personnes sans saisie sortent du pipeline : ils gardent leur fiche et se retrouvent par la recherche."},
  {t:'Ton réseau dans les indicateurs',p:"Trois indicateurs à choisir : Réseau entretenu, Personnes vues (90 jours), Recommandations. Les bandeaux affichent en haut à droite ton niveau et ton total, toutes années confondues."},
  {t:'« Plus tard » réglable',p:"Paramètres > Suivi des personnes : la durée de « Plus tard », 14 jours par défaut, pour toutes les relances. Et un export CSV de tes personnes, en bas de page."}]},
 {v:46,s:'2.3.1',d:'14 novembre 2026',items:[
  {t:"Rétablir le nom d'un type",p:"Dans Paramètres, un type intégré que tu as renommé affiche un bouton ↺ au bout de sa ligne : il lui rend son nom d'origine, par exemple « Rencontre réseau »."},
  {t:"Une seule alerte de fin d'accompagnement",p:"« Bilan ou renouvellement ? » n'apparaît plus qu'une fois par contrat : après « Planifier le bilan », l'alerte ne revient pas, même quand l'action est faite. Un nouveau contrat la déclenche à nouveau."},
  {t:"Supprimer une action",p:"Dans le plan d'action, le ✕ au bout de la ligne supprime l'action. « Annuler », dans le message qui s'affiche, la rétablit."}]},
 {v:45,s:'2.3.0',d:'13 novembre 2026',items:[
  {t:'Trouver une personne en tapant son nom',p:"Dans la saisie, sous les personnes récentes, un champ propose les noms au fil de la frappe, sans tenir compte des accents ni des majuscules. « + Créer » ajoute une personne qui n'existe pas encore. Le même champ sert dans la colonne Personne de Mes saisies et dans le plan d'action ; les personnes archivées y sont aussi."},
  {t:'Rencontre réseau en tête du parcours',p:"Dans la saisie, « Rencontre réseau » ouvre le parcours, avant l'invitation. Pour ce type, « Ce qu'on a vu » accepte plusieurs lignes et s'agrandit avec ton texte."},
  {t:'Personnes archivées',p:"Les listes « Clients archivés » s'appellent maintenant « Personnes archivées » : on y range aussi des contacts qui ne sont pas des clients."}]},
 {v:44,s:'2.2.0',d:'11 novembre 2026',items:[
  {t:'Supprimer une personne',p:"Le bouton « Supprimer », en bas de sa fiche, l'efface de ton carnet. Ses saisies restent (tes heures et statistiques ne bougent pas), marquées « Personne supprimée »."},
  {t:'Durée libre dans Mes saisies',p:"Dans le tableau, « Autre… » en bas de la liste des durées permet d'écrire n'importe quelle durée : 2,5 · 2h30 · 150min."},
  {t:'Personne obligatoire',p:"Une saisie de rencontre, d'invitation, de conversation, de proposition, de séance ou de débrief demande désormais une personne. Le réglage se change type par type dans Paramètres > Types d'activité, colonne « Personne » : tes types d'entraînement restent sans personne obligatoire. Les saisies existantes à compléter sont entourées en rouge dans Mes saisies.",go:'settings',b:'Paramètres'},
  {t:'Barres de niveau',p:"Dans tes statistiques, la barre repart de zéro à chaque niveau : elle se remplit entre le seuil que tu viens de passer et le suivant."}]},
 {v:43,s:'2.1.0',d:'9 novembre 2026',items:[
  {t:'Visite du carnet de démonstration',p:"Le carnet de démonstration s'ouvre sur une courte présentation de la démarche, puis une visite des pages en neuf étapes. Il démarre en mode simplifié ; « Revoir la visite », dans le bandeau du bas, la relance."},
  {t:'Le bouton maison mène au site',p:"La petite maison, à gauche des onglets, ouvre le site carnet-de-coach.fr dans un nouvel onglet. L'écran d'accueil reste accessible depuis les Paramètres."}]},
 {v:42,s:'2.0.0',d:'novembre 2026',items:[
  {t:'Carnet de coach a son site',p:"Une page pour présenter le carnet et le partager : la démarche, les captures, les questions fréquentes, en français et en anglais. Nouvelle adresse : carnet-de-coach.fr, avec l'application sur carnet-de-coach.fr/app/. Si tu l'avais installée, réinstalle-la depuis cette adresse, puis choisis « J'ai déjà un carnet : ouvrir son dossier » et sélectionne ton dossier. Tes données ne bougent pas.",go:'about',b:'À propos'}]},
 {v:40,s:'1.12.1',d:'8 novembre 2026',items:[
  {t:'Bouton Accueil',p:"La petite maison, à gauche des onglets, ramène à l'écran d'accueil ; « Revenir à mon carnet » te ramène où tu étais, sans reverrouiller le carnet."},
  {t:'Changer de langue sans tout recharger',p:"Le bouton FR / EN bascule la langue instantanément : un carnet chiffré reste déverrouillé."}]},
 {v:39,s:'1.12.0',d:'8 novembre 2026',items:[
  {t:'Le carnet parle anglais',p:"Un bouton FR / EN, en haut à droite, change la langue de toute l'application à tout moment. Tes données ne changent pas : seuls les textes de l'outil sont traduits. Le carnet de démonstration existe aussi en anglais."}]},
 {v:38,s:'1.11.0',d:'8 novembre 2026',items:[
  {t:'Carnet de démonstration',p:"Depuis l'accueil, « Explorer un carnet de démonstration » ouvre le carnet de Camille Martin, coach de managers fictive : quatorze mois de pratique, pour découvrir toutes les pages avant de commencer le tien."}]},
 {v:37,s:'1.10.1',d:'8 novembre 2026',items:[
  {t:'Aisance commerciale',p:"Dans Suivi d'activité, ta note d'atteinte de l'objectif sur tes invitations, conversations et propositions : sa moyenne de l'année et sa tendance. Pour voir la difficulté baisser au fil des mois.",go:'metrics',b:'Voir'},
  {t:'Retouches',p:"L'étape Contact devient Rencontre. Paramètres et À propos ont leur propre couleur d'onglet. Accueil plus compact, sur le vert de ton carnet. Fiche personne mieux aérée."}]},
 {v:36,s:'1.10.0',d:'8 novembre 2026',items:[
  {t:'Onglet À propos',p:"Le mot d'accueil, la démarche « Créer tes clients par la relation », la façon dont l'outil est construit, et une foire aux questions.",go:'about',b:'Voir'},
  {t:'Compter tes non',p:"Une invitation déclinée se coche « Elle a dit non » ; avec les propositions refusées, tes non sont comptés dans Suivi d'activité, et ont leurs hauts faits. Ceux qui reçoivent le plus de non sont souvent ceux qui reçoivent le plus de oui.",go:'metrics',b:'Voir'},
  {t:'Fiche personne',p:"Provenance, public et problématique proposent les valeurs déjà utilisées, pour des analyses propres. Deux cases : la personne vient-elle d'une recommandation ? lui as-tu demandé une recommandation ?",go:'people',b:'Personnes'},
  {t:'Et aussi',p:"Mes saisies affiche l'étape de la personne (Contact, En conversation, Client.e…). Hauts faits du thème Jeu vidéo sur trois colonnes. Démarche précisée : un cycle de durée fixée, à un prix juste."}]},
 {v:35,s:'1.9.1',d:'8 novembre 2026',items:[
  {t:'Créer tes clients par la relation',p:"La page qui ouvre le pipeline présente l'approche du carnet en six principes : rencontrer chaque jour, aider sans rien attendre, faire vivre le coaching, choisir tes clients, proposer et demander la recommandation, peu de clients sur la durée. Chaque étape dit ce qu'il faut saisir pour la faire avancer.",go:'people',b:'Voir'}]},
 {v:34,s:'1.9.0',d:'8 novembre 2026',items:[
  {t:'Le carnet de route',p:"Une mission à la fois pour découvrir l'outil en l'utilisant : « Montre-moi » éclaire le bon bouton, et la mission se valide toute seule quand tu l'as faite. Quatre chapitres, chacun récompensé par un haut fait. Les missions que tu as déjà faites sont cochées ; le carnet se replie en pastille, en bas à droite, et se masque dans Paramètres."},
  {t:'Célébrations',p:"Une statistique qui monte d'un niveau, ton niveau global, un nouveau rang, un haut fait débloqué : chaque cap est salué, du plus discret au plus spectaculaire. À couper dans Paramètres si tu préfères."},
  {t:'Des victoires qui racontent',p:"Tes victoires ont désormais une image, un titre, une date, un niveau et un récit pour t'en souvenir. Clique sur une victoire de ta fiche pour la revoir en grand.",go:'coach',b:'Ma fiche'},
  {t:'Comprendre ton pipeline',p:"Le bouton « ? Les étapes », dans l'onglet Personnes, explique chaque étape du pipeline en mots simples. L'accueil d'un nouveau carnet tient en trois écrans.",go:'people',b:'Voir'}]},
 {v:33,s:'1.8.2',d:'7 novembre 2026',items:[
  {t:'Niveaux recalibrés',p:"Chaque statistique a désormais sa propre courbe, construite sur le parcours d'un coach régulier : 80 invitations, 60 conversations, 12 propositions, 6 contrats et 80 séances payantes la 1re année, puis une montée en charge. Pratique délibérée forte au début puis plus plate, supervision en heures (2 h par mois au début, tous les deux mois ensuite). Une statistique entre dans ta moyenne à sa première saisie.",go:'coach',b:'Ma fiche'},
  {t:'Clients et renouvellements',p:"Chaque contrat signé compte, renouvellement compris : le premier vaut le niveau 10."},
  {t:'Le CA en deux temps',p:"Des paliers jusqu'à 5 000 € cumulés (premier euro = niveau 2, 1 500 € = un SMIC, 3 000 € = niveau 10), puis ton meilleur CA sur 12 mois glissants : ton niveau ne redescend jamais, et la valeur actuelle reste affichée, avec son équivalent mensuel."}]},
 {v:32,s:'1.8.1',d:'7 novembre 2026',items:[
  {t:'Nouvelle échelle des niveaux (à l\'essai)',p:"Chaque statistique se compare au rythme d'un coach régulier (300 h de coaching, 220 séances, 40 conversations, 30 personnes, 15 propositions, 8 clients, 20 000 € par an…) : ton niveau est l'ancienneté qu'il lui faudrait pour en arriver là (niveau 10 ≈ 2 mois, 30 ≈ 1 an et demi, 60 ≈ 8 ans, 100 ≈ 30 ans). Ton niveau global et ton rang sont la moyenne de toutes tes statistiques.",go:'coach',b:'Ma fiche'},
  {t:'Fenêtres aux coins arrondis',p:"La barre de défilement ne coupe plus les coins des fenêtres."}]},
 {v:31,s:'1.8.0',d:'7 novembre 2026',items:[
  {t:'Mode simplifié',p:"Un bouton en haut à droite masque l'aisance, la pratique délibérée, la fiche de coach, les objectifs, le plan d'action et les coûts : il reste l'essentiel, enregistrer tes entretiens, suivre ton activité et tes personnes. Rien n'est perdu : tu changes de mode quand tu veux."},
  {t:'Notes sur l\'entretien',p:"Une grande zone de notes, facultative, dans chaque saisie. Tu la retrouves et la modifies avec ◎ dans Mes saisies ; elle est aussi dans l'export et l'import CSV."},
  {t:'Les types dans l\'ordre du parcours',p:"Dans la saisie : Invitation › Conversation › Proposition › Session › Débrief › Supervision, puis tes autres types. La fenêtre est plus large et les notes d'aisance tiennent sur deux colonnes."},
  {t:'« À relancer » aussi dans Personnes',p:"Le bloc des personnes à relancer est désormais en haut de l'onglet Personnes. Métriques s'appelle maintenant Suivi d'activité. Correctif : le fond bleu derrière « via … » dans la vue Liste.",go:'people',b:'Voir'}]},
 {v:30,s:'1.7.0',d:'6 novembre 2026',items:[
  {t:'Métriques : Développer ton activité',p:"Le graphique d'aisance laisse la place à ton entonnoir de l'année : invitations, personnes en conversation, propositions, clients signés, avec les taux de passage, la comparaison avec l'année précédente, le CA signé et le panier moyen. Vue « Par mois » pour suivre le rythme. L'aisance se suit désormais sur la boussole.",go:'metrics',b:'Voir'},
  {t:'Hauts faits',p:"Ta fiche affiche tes hauts faits : séances, heures, personnes coachées, clients, CA, semaines d'affilée, pratique délibérée, supervisions, invitations, actions acquises. Les prochains à débloquer s'affichent avec ce qu'il te reste. Ajoute aussi tes victoires, celles que l'outil ne peut pas compter seul.",go:'coach',b:'Ma fiche'},
  {t:'Affinités : public × problématique',p:"Renseigne le public et la problématique dans la fiche de tes clients : ta fiche croise tes heures de coaching par public et par problématique, et repère tes spécialités (50 h et plus).",go:'people',b:'Personnes'},
  {t:'Reprendre ton historique',p:"Tu coachais avant l'outil ? Importe tes saisies depuis un tableur (CSV, modèle fourni), ou déclare simplement tes totaux d'avant : ils comptent dans tes niveaux, ton rang et tes hauts faits. Dans Coach > Modifier mon profil."}]},
 {v:29,s:'1.6.1',d:'6 novembre 2026',items:[
  {t:'Plus d\'exemples imposés',p:"Les champs n'affichent plus d'exemples tirés de la pratique d'un autre coach : titre, micro-pitch, actions, disciplines, objectifs… Un nouveau carnet démarre sans compétences ni phrase pré-remplies : à toi de nommer les tiennes."}]},
 {v:28,s:'1.6.0',d:'6 novembre 2026',items:[
  {t:'Nouvel onglet Coach : ta fiche',p:"Ta photo, ton titre, ton micro-pitch, ta formation et ton parcours, ton rang et ton niveau, ta boussole d'aisance avec tes focus et tes actions, et tes statistiques avec leurs niveaux. Clique sur ton logo pour y aller.",go:'coach',b:'Ma fiche'},
  {t:'Rangs et niveaux jusqu\'à 100',p:"Ton niveau suit tes heures de coaching : environ 5 à 8 ans de pratique régulière pour atteindre le niveau 60, et 10 000 heures pour le niveau 100, Légende. Chaque statistique a aussi ses propres niveaux. Ton rang évolue tous les 10 niveaux, de Débutant·e à Élite."},
  {t:'Deux thèmes pour ta fiche',p:"Professionnel ou Jeu vidéo : choisis en haut de l'onglet Coach. Les couleurs sont les mêmes pour tous les coachs, pour que les fiches se lisent toutes de la même façon."},
  {t:'Tes réglages ne se perdent plus entre deux fenêtres',p:"Correctif important : si l'application était ouverte dans deux fenêtres (navigateur et application installée, par exemple), la plus ancienne pouvait effacer des réglages saisis dans l'autre, comme tes coûts. Désormais, seuls les changements réellement faits dans chaque fenêtre sont gardés. Si tu as perdu des coûts : en bas de page, « Importer un JSON », choisis une copie d'avant la perte dans le dossier sauvegardes, puis « OK (fusionner) »."},
  {t:'Tes compétences se gèrent depuis la boussole',p:"« Gérer mes compétences », sur la boussole d'aisance (onglets Coach et Pratique délibérée), réunit tout au même endroit : libellé, discipline, repères, suivie ou non, et focus. Le bloc des Paramètres renvoie au même écran."},
  {t:'Disciplines et accord des libellés',p:"Range tes compétences par discipline (PNL, Analyse transactionnelle…) : elles se regroupent sur la boussole avec un arc de couleur. Dans ton profil ou dans Paramètres > Identité, choisis l'accord des libellés : féminin, masculin ou inclusif.",go:'coach',b:'Voir'}]},
 {v:27,s:'1.5.0',d:'5 novembre 2026',items:[
  {t:'Nouvel onglet Pratique délibérée',p:"La boussole d'aisance montre où tu en es sur chaque compétence : la moyenne de tes 5 dernières notes, avec la tendance. Choisis jusqu'à 3 focus et 3 actions à tenter : tu suis leur taux de réussite au fil de tes saisies.",go:'pd',b:'Découvrir'},
  {t:'Ce que tu remarques, compétence par compétence',p:"Dans une saisie, réponds d'abord à tes actions en 3 clics (oui, en partie, non), puis note ce que tu as remarqué sur tes focus. Clique sur une compétence de la boussole pour relire toutes tes remarques et tes retours de supervision."},
  {t:'Préparer ta supervision',p:"Coche « Retenir pour la prochaine supervision » sous une remarque : elle rejoint la liste de préparation. Après la supervision, écris ce que tu en retiens sous chaque remarque, puis enregistre la supervision : tout y est joint.",go:'pd',b:'Voir'},
  {t:'Nouveau type de saisie : Invitation',p:"Note chaque fois que tu proposes à quelqu'un une conversation de coaching. L'indicateur « Invitations » rejoint le pilier Développer ton activité.",go:'kcat',b:'Indicateurs'}]},
 {v:26,s:'1.4.0',d:'4 novembre 2026',items:[
  {t:'Ton logo dans l\'onglet et la barre de titre',p:'L\'icône de l\'onglet et de la fenêtre de l\'application reprend le logo de ton carnet (Paramètres > Apparence). Sans logo, l\'icône de l\'application s\'affiche.',go:'settings',b:'Apparence'},
  {t:'Nouvelle icône de l\'application',p:'L\'icône de l\'application installée change. Si tu l\'as déjà installée et que l\'ancienne icône reste affichée, désinstalle puis réinstalle l\'application : tes données ne bougent pas.'}]},
 {v:25,s:'1.3.4',d:'4 novembre 2026',items:[
  {t:'Cotisations URSSAF dans les coûts',p:'Indique ton taux moyen de prélèvement URSSAF : le montant correspondant à ton CA accepté de l\'année est compté comme une charge, et déduit de ton taux horaire réel.',go:'settings',b:'Voir'}]},
 {v:24,s:'1.3.3',d:'4 novembre 2026',items:[
  {t:'Frises : les types importants au premier plan',p:'Quand des pastilles se chevauchent, celles des types les mieux classés (n° 1 en tête, par exemple Session) passent au-dessus des autres (Débrief…). L\'ordre suit ton classement dans Paramètres > Types d\'activité.'}]},
 {v:23,s:'1.3.2',d:'4 novembre 2026',items:[
  {t:'Personne modifiable dans Mes saisies',p:'La colonne Personne devient une liste : tu peux changer ou retirer la personne d\'une saisie, par exemple ton superviseur ou ta superviseuse. La petite loupe filtre sur cette personne.',go:'list',b:'Voir'}]},
 {v:22,s:'1.3.1',d:'4 novembre 2026',items:[
  {t:'Montant personnalisé par supervision',p:'À chaque saisie de supervision, laisse le champ vide pour compter le prix moyen, ou saisis le montant réel de la séance : il prend le pas sur le prix moyen. Modifiable aussi dans Mes saisies.'}]},
 {v:21,s:'1.3.0',d:'4 novembre 2026',items:[
  {t:'Coûts de l\'activité détaillés',p:'Saisis tes coûts ligne par ligne (description, fournisseur, coût annuel). La supervision est calculée à partir de tes séances payantes. Le total et sa répartition s\'affichent dans un graphique.',go:'settings',b:'Voir'},
  {t:'Supervision non payante',p:'Une case dans la saisie d\'une supervision : la séance n\'entre alors pas dans tes coûts.'},
  {t:'Nouvelle fiche personne',p:'Infos à gauche ; à droite le suivi : chiffres, contrat, frise datée des échanges, aisance sur tous tes axes et plan d\'action. Icônes e-mail, site et appel (sur téléphone) à côté du nom.',go:'people',b:'Ouvrir Personnes'},
  {t:'Mes saisies : tuile à côté des filtres',p:'La personne sélectionnée s\'affiche à droite des filtres, sur deux colonnes, avec un onglet par personne si tu en sélectionnes plusieurs.',go:'list',b:'Voir'},
  {t:'Blocs repliables',p:'Plan d\'action et Suivi indicateurs sur le tableau de bord, et tous les blocs des Paramètres, se replient d\'un clic sur le titre. Les Paramètres sont réorganisés.',go:'settings',b:'Paramètres'}]},
 {v:20,s:'1.2.3',d:'4 novembre 2026',items:[
  {t:'Tableaux resserrés',p:'Les colonnes courtes (personne, date, type, durée, cases…) prennent juste la place nécessaire ; le texte libre récupère le reste.'},
  {t:'Mes saisies : CR et synthèse avant « Ce qu\'on a vu »',p:'Les cases à cocher sont juste après la durée.',go:'list',b:'Voir'},
  {t:'Personnes : pipeline par défaut',p:'L\'onglet Personnes s\'ouvre sur le pipeline ; le choix Pipeline / Liste est placé avant la recherche.',go:'people',b:'Voir'}]},
 {v:19,s:'1.2.2',d:'4 novembre 2026',items:[
  {t:'Affichage adapté à ton écran',p:'L\'application occupe toute la largeur disponible ; les graphiques se redessinent à la taille réelle de leur cadre, le pipeline gagne de la place, et sur grand écran « À relancer » et « Objectif prioritaire » se placent côte à côte.'}]},
 {v:18,s:'1.2.1',d:'4 novembre 2026',items:[
  {t:'Téléphone lisible',p:'Le numéro s\'espace automatiquement : 01 23 45 67 89, ou +33 1 23 45 67 89 avec l\'indicatif.'},
  {t:'Nouvelle étape « Superviseur.e »',p:'Une personne avec qui tu as fait des supervisions est classée automatiquement Superviseur.e (sauf si elle a un contrat accepté). « Client » devient « Client.e ».',go:'people',b:'Ouvrir Personnes'},
  {t:'Tuiles des personnes plus compactes',p:'Mêmes informations, moins d\'espace vide : plus de personnes visibles d\'un coup d\'œil.'}]},
 {v:17,s:'1.2.0',d:'4 novembre 2026',items:[
  {t:'Propositions en attente dans « À relancer »',p:'Chaque proposition sans réponse et sans action prévue apparaît sur le tableau de bord : marque-la acceptée ou refusée en un clic, planifie une relance, ou reporte-la d\'une semaine.',go:'dash',b:'Voir'},
  {t:'Site web sur la fiche',p:'Le champ LinkedIn devient « Site web » (tes liens LinkedIn sont repris), cliquable depuis la fiche et les tuiles des personnes.',go:'people',b:'Ouvrir Personnes'},
  {t:'Mes saisies plus lisible',p:'Notes d\'aisance et contrat repliés par défaut, à déplier d\'un clic ; CR et synthèse juste après « Ce qu\'on a vu ».',go:'list',b:'Voir'},
  {t:'Correctif : fiche personne',p:'Téléphone, e-mail et site pouvaient ne pas être enregistrés quand la sauvegarde tombait pendant la frappe. C\'est corrigé.'}]},
 {v:16,s:'1.1.2',d:'4 novembre 2026',items:[
  {t:'Écran des nouveautés',p:'À chaque nouvelle version, cet écran te présente ce qui a changé. Il reste accessible par le lien « Nouveautés » en bas de page.'},
  {t:'« Compte dans » modifiable pour tous les types',p:'Dans Paramètres > Types d\'activité, choisis pour chaque type s\'il compte dans les heures de coaching, la pratique délibérée, le développement ou autre.',go:'settings',b:'Voir le réglage'},
  {t:'Parcours de démarrage complété',p:'Nouvelle étape « Personnes et coûts », et un affichage plus large, lisible sur tous les écrans.',go:'tour',b:'Revoir le parcours'},
  {t:'Nouvelle numérotation',p:'Les versions sont désormais numérotées x.y.z : version majeure, nouvelle fonctionnalité, correctif.'}]},
 {v:14,s:'1.1.1',d:'4 novembre 2026',items:[
  {t:'Charges : en entier ou au prorata',p:'Un bouton dans Paramètres > Coûts de l\'activité, avec les deux taux horaires affichés côte à côte.',go:'settings',b:'Voir le réglage'}]},
 {v:13,s:'1.1.0',d:'4 novembre 2026',items:[
  {t:'Fiche personne',p:'Photo recadrée, téléphone, e-mail, LinkedIn, fonction, provenance, notes, prochaines actions et contrat en cours.',go:'people',b:'Ouvrir Personnes'},
  {t:'Étapes automatiques et pipeline',p:'Contact, En conversation, Proposition envoyée, Client, Accompagnement terminé : déduites de tes saisies, en liste ou en pipeline (glisse une carte pour changer son étape).',go:'people',b:'Voir le pipeline'},
  {t:'Bloc « À relancer »',p:'Sur le tableau de bord : relances dues, fins d\'accompagnement et personnes sans contact depuis 30 jours (réglable).',go:'dash',b:'Voir'}]},
 {v:11,s:'1.0',d:'2 novembre 2026',items:[
  {t:'Catalogue de 19 indicateurs',p:'Choisis et ordonne jusqu\'à 6 indicateurs.',go:'kcat',b:'Choisir'},
  {t:'Enregistrements sécurisés',p:'Fusion au lieu d\'écrasement, copies de sécurité horaires puis quotidiennes, lecture seule pour les anciennes versions.'},
  {t:'Jusqu\'à 10 types d\'activité, archivage des clients, durée libre',p:'Ajoute tes propres types, archive les clients sans perdre leur historique, saisis 2,5 / 2h30 / 150min.'},
  {t:'Coûts et taux horaire réel',p:'Coût des supervisions et charges annuelles déduits de ton taux horaire.'}]}];
function openNews(from,all){const L=NEWS.filter(n=>all?true:n.v>from).sort((a,b)=>b.v-a.v);if(!L.length)return false;
 const nwD=d=>{if(LANG!=='en')return d;const F=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],N=['January','February','March','April','May','June','July','August','September','October','November','December'],m=String(d).match(/^(\d+) (\S+) (\d{4})$/);return m&&F.includes(m[2])?`${N[F.indexOf(m[2])]} ${m[1]}, ${m[3]}`:d};
 const blk=n=>`<div class="nwv"><h3>Version ${n.s}<small data-noi18n>${nwD(n.d)}</small></h3>${n.items.map(i=>`<div class="nwi"><div><b>${esc(i.t)}</b><p>${esc(i.p)}</p></div>${i.go?`<button class="btn2" data-nwgo="${i.go}">${esc(i.b||'Voir')}</button>`:''}</div>`).join('')}</div>`;
 const head=all?L.slice(0,3):L.slice(0,4),rest=all?L.slice(3):L.slice(4);
 $('nwTitle').textContent=all?'Nouveautés':'Quoi de neuf depuis ta dernière visite';
 $('nwLead').textContent=all?`Tu utilises la version ${APP_SEMVER}.`:`L'application est passée en version ${APP_SEMVER}. Voici ce qui a changé depuis ta dernière visite ; tes données n'ont pas bougé.`;
 $('nwBody').innerHTML=head.map(blk).join('')+(rest.length?`<details class="nwold"><summary>Versions précédentes (${rest.length})</summary>${rest.map(blk).join('')}</details>`:'');
 $('nwBody').querySelectorAll('[data-nwgo]').forEach(b=>b.onclick=()=>{const g=b.dataset.nwgo;closeNews();if(g=='tour')openWizard(WZ.indexOf('ident'),false);else if(g=='kcat')openKcat();else{goTab(g);window.scrollTo({top:0})}});
 $('newsM').classList.add('show');return true}
function closeNews(){$('newsM').classList.remove('show');if(DB&&!READONLY&&(+DB.prefs.nouveautes_vues||0)<APP_VERSION){DB.prefs.nouveautes_vues=APP_VERSION;touch()}}
$('nwClose').onclick=closeNews;$('nwOk').onclick=closeNews;$('newsLink').onclick=()=>openNews(0,true);
function checkNews(){if(!DB||READONLY)return;const v=+DB.prefs.nouveautes_vues||0;if(v>=APP_VERSION)return;
 if(!openNews(v,false)){DB.prefs.nouveautes_vues=APP_VERSION;touch()}}

/* ---------- blocs repliables (chevron avant le titre) ---------- */
const FOLDK='aocoach.fold.';
function foldGet(id,def){try{const v=localStorage.getItem(FOLDK+id);return v==null?def:v=='1'}catch(e){return def}}
function foldSet(id,v){try{localStorage.setItem(FOLDK+id,v?'1':'0')}catch(e){}}
function initFolds(){document.querySelectorAll('.card.fold').forEach(c=>{if(c.dataset.ready)return;c.dataset.ready=1;const h=c.querySelector('h2'),body=document.createElement('div');body.className='fbody';
  while(h.nextSibling)body.appendChild(h.nextSibling);c.appendChild(body);
  h.classList.add('fh');h.insertAdjacentHTML('afterbegin','<span class="chev"></span>');const sm=document.createElement('span');sm.className='fsum';h.appendChild(sm);
  const open=foldGet(c.id,c.dataset.fold=='1');c.classList.toggle('closed',!open);
  h.addEventListener('click',e=>{if(e.target.closest('button,select,input,a,.pills,label'))return;const o=c.classList.contains('closed');c.classList.toggle('closed',!o);foldSet(c.id,o);if(o)renderAll()})})}
function foldSums(){if(!DB)return;const C=CFG(),set=(id,t)=>{const el=document.querySelector('#'+id+' .fsum');if(el)el.textContent=t||''};
 const A=DB.actions.filter(a=>a.s=='encours'),late=A.filter(a=>a.d&&a.d<today()).length;
 set('actCard',`${A.length} en cours${late?` · ${late} en retard`:''}`);
 try{const D=kctx(),v=KPIDEF.target.v(D);set('objCard',`${$('qSel')?.selectedOptions[0]?.text||''} · cibles du trimestre : ${v[0]} ${String(v[1]).replace(/<[^>]+>/g,'')}`)}catch(e){}
 set('setIdent',[C.nom,C.outil].filter(Boolean).join(' · '));
 set('setLook',`${C.logo?'logo':'sans logo'} · ${C.bandeau?'bandeau':'sans bandeau'} · ${C.couleursAuto?'palette':'couleurs personnalisées'}`);
 set('setSec',DEKK?`chiffré · verrouillage ${DB.prefs.autolock?'après '+DB.prefs.autolock+' min':'manuel'}`:'non chiffré');
 set('setStore',DIR?`dossier « ${DIR.name} »${NEEDPERM?' (à reconnecter)':''}`:'aucun dossier relié');
 set('setTypes',`${keysOf(C).length} types`);set('setMets',`${mActive().length} axes suivis`);
 set('setCrm',`alerte après ${C.crm.froid} j sans contact · plus tard : ${C.crm.reporter||14} j`);set('setKpi',`${kOrder().length} indicateurs, dont ${Math.min(3,kOrder().length)} principaux`);
 try{const Y=today().slice(0,4),r=KPIDEF.rate.v(kctx());set('setFin',`${eur(supYearCost(Y)+urssafYear(Y)+linesTotal())} de charges · ${C.finances.mode=='prorata'?'au prorata':'en entier'} : ${r[0]} ${String(r[1]).replace(/<[^>]+>/g,'')}`)}catch(e){}}

/* ---------- démarrage ---------- */
async function afterLoad(){
 $('appVer').textContent=`Version ${APP_SEMVER} (${APP_DATE})`;
 $('lock').classList.add('hide');$('main').style.visibility='visible';applyConfig();renderAll();updLockBtn();
 if(!FS_OK){banner('nofs');setStatus('local')}
 else if(DIR&&NEEDPERM){banner('reconnect');setStatus('local')}
 else if(DIR){banner(null);setStatus('ok')}
 else{banner('nodir');setStatus('local')}
 qInit();CELS=celSnap()}
async function boot(){setTimeout(()=>{try{if(/[?&]demo=1/.test(location.search)&&(!DB||DB.demo)&&!DB?.demo){openDemo();return}if(DB?.demo&&DB.demoLang&&DB.demoLang!==LANG)openDemo();else demoBar()}catch(e){}},1500);
 $('main').style.visibility='hidden';closeWizard();
 try{if(!idb.db)await idb.open()}catch(e){}
 const cached=await idb.get('data');let fileRaw=null;NEEDPERM=false;
 if(FS_OK){DIR=DIR||await idb.get('dir')||null;
  if(DIR){let p='prompt';try{p=await DIR.queryPermission({mode:'readwrite'})}catch(e){}
   if(p==='granted'){const t=await readFile(DIR,FILE);if(t){try{fileRaw=JSON.parse(t)}catch(e){toast(`${FILE} est illisible : il n'a pas été modifié. Restaure une sauvegarde.`);setStatus('err','Fichier illisible');return}}}
   else NEEDPERM=true}}
 /* le fichier du dossier fait foi ; si la copie du navigateur est le même carnet, on FUSIONNE les deux (rien n'est perdu) */
 const other=fileRaw&&cached&&compatBook(fileRaw,cached)?cached:null,base=fileRaw||cached;
 if(!base){showWelcome();return}
 const open=async(raw,ask)=>{if(!isEnc(raw))return raw;const p=await tryCurrentKey(raw);if(p){ENV={cles:raw.cles};return p}if(!ask)return null;
  const r=await askSecret({title:'Carnet verrouillé',text:'Saisis ton mot de passe pour ouvrir tes données.',other:true,verify:(s,w)=>openEnv(raw,s,w,true)});
  if(r.which=='secours'){const pwd=await askNewPassword('Choisis un nouveau mot de passe');if(pwd){ENV.cles={...ENV.cles,mdp:await wrapWith(pwd,IT_PWD)};toast('Nouveau mot de passe enregistré')}}
  return r.r};
 if(!isEnc(base)){await setDEK(null);ENV=null}
 const plain=await open(base,true);DB=migrate(plain);BASE=fileRaw&&base===fileRaw?migrate(plain):null;let added=0;
 if(other){const op=await open(other,false);if(op){const m=mergeDB(DB,migrate(op));DB=m.db;added=m.added}}
 if(DB.prefs.nouveautes_vues==null){DB.prefs.nouveautes_vues=+plain.app_version||9;added=added||0}
 READONLY=(+plain.app_version||0)>APP_VERSION;LASTSEEN=fileRaw?fileRaw.enregistre_le||'':null;
 await afterLoad();if(READONLY){banner('old');setStatus('err','Lecture seule');return}
 if(added)toast(`${added} saisie(s) gardée(s) dans ce navigateur ont été réunies dans ton carnet`);
 if(added||base!==fileRaw||plain.version_schema!==VERSION||(+plain.app_version||0)<APP_VERSION||!plain.id||plain.prefs?.nouveautes_vues==null){if(added)DB.enregistre_le=new Date().toISOString();clearTimeout(saveT);await persist()}
 checkNews()
}
if('serviceWorker' in navigator&&location.protocol==='https:'){navigator.serviceWorker.register('sw.js').then(r=>r.update()).catch(()=>{});
 let had=!!navigator.serviceWorker.controller;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(had)toast('Nouvelle version de l\'application disponible','Recharger',()=>location.reload());had=true})}
let RZT=0;window.addEventListener('resize',()=>{clearTimeout(RZT);RZT=setTimeout(()=>{try{if(DB&&TAB=='metrics'){renderMonthly();renderBiz()}if(DB&&TAB=='reseau')renderNet()}catch(e){}},150)});
document.querySelectorAll('.langsw [data-lg]').forEach(b=>{b.classList.toggle('on',b.dataset.lg===LANG);b.onclick=()=>setLang(b.dataset.lg)});
$('homeBtn').onclick=()=>window.open('../?lang='+LANG,'_blank','noopener');
initFolds();
i18nStart();
boot();
