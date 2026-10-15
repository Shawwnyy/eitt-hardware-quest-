# EITT Hardware Quest

**Le laboratoire interactif des composants informatiques**
Un outil pédagogique du projet **EITT — Enseignement Informatique pour Toutes et Tous**.

> « Explorez les composants. Comprenez la machine. Maîtrisez l'informatique. »

Application 100 % statique : HTML5, CSS3, JavaScript « vanilla » et SVG. Aucune bibliothèque, aucune base de données, aucune API externe, aucun compte.

## Modes disponibles

| Mode | Contenu |
| --- | --- |
| **Accueil** | Présentation, durée indicative, raccourcis, compétences visées |
| **Explorer** | Vue éclatée SVG d'un PC (10 composants cliquables), liste avec recherche et filtre par catégorie, fiche résumée, précédent/suivant, indicateur « consulté » |
| **Apprendre** | Fiches détaillées : rôle, explication simple, fonctionnement, exemple, importance, confusions fréquentes, anecdote |
| **Quiz** | **40 QCM sur 4 niveaux** (Débutant, Intermédiaire, Avancé, Expert) + un **défi éclair Vrai/Faux** (10 affirmations tirées au hasard parmi 16). Correction et explication immédiates, encouragements à chaque réponse, série de bonnes réponses, barre de progression, score, récapitulatif des erreurs, redémarrage, questions et réponses mélangées |
| **Assembler** | Carte mère schématique fictive, 7 éléments à placer étape par étape (clic sur l'élément puis sur l'emplacement), retour immédiat et explications |
| **Diagnostic** | 5 pannes fictives : symptômes, hypothèses, choix d'une démarche, causes possibles, correction pédagogique, rappels de sécurité |
| **Progression** | Composants découverts, quiz terminés, dernier score, exercices réussis, pourcentage, récompenses |

## Fichiers

```text
eitt-hardware-quest/
├── index.html           Structure de la page, navigation, zones d'annonce accessibles
├── css/
│   └── style.css        Identité visuelle EITT, composants, responsive, accessibilité
├── assets/
│   └── logo/            Logo EITT (en-tête, pied de page, favicon)
├── js/
│   ├── app.js           Logique : routeur, vues, quiz, assemblage, diagnostic, progression
│   └── lab-svg.js       Illustrations SVG (vue éclatée, carte mère schématique, icônes)
├── data/
│   ├── components.js    Catégories et fiches des 10 composants
│   ├── quiz.js          4 niveaux de QCM (40 questions) + défi éclair Vrai/Faux (16 affirmations)
│   └── exercises.js     Exercice d'assemblage et scénarios de diagnostic
└── README.md
```

**Pourquoi des fichiers `.js` plutôt que `.json` ?** Les navigateurs bloquent souvent le chargement de fichiers JSON (`fetch`) lorsqu'on ouvre une page en double-cliquant dessus (`file://`). Les données sont donc écrites en objets JavaScript : l'application fonctionne sans serveur. Leur structure reste celle d'un JSON.

## Lancement en local

**Le plus simple :** double-cliquez sur `index.html` (ou glissez-le dans le navigateur). Aucune installation n'est nécessaire.

Avec un petit serveur local (facultatif) :

```bash
cd eitt-hardware-quest
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

## Déploiement sur un hébergement web classique

1. Envoyez **tout le dossier** `eitt-hardware-quest/` (FTP, SFTP, gestionnaire de fichiers de l'hébergeur…) à l'emplacement voulu, par exemple `public_html/hardware-quest/`.
2. Ouvrez l'adresse correspondante : `https://votre-site.fr/hardware-quest/`.
3. Rien d'autre : pas de PHP, pas de base de données, pas de configuration serveur. Les liens internes utilisent `#/…` : aucune règle de réécriture d'URL n'est nécessaire, et l'application fonctionne dans n'importe quel sous-dossier.

HTTPS est recommandé (bonne pratique générale), sans être obligatoire pour que l'application fonctionne.

## Logo et couleurs EITT

Le logo EITT (fichiers fournis par EITT) est intégré dans `assets/logo/` :

- `eitt-mark.png` : pictogramme circulaire affiché dans l'en-tête (attribut `data-logo-src` de `#logo-slot` dans `index.html`) ;
- `eitt-logo.png` : logo complet, affiché dans le pied de page ;
- `eitt-mark-64.png` : icône de l'onglet du navigateur (favicon).

Si l'image de l'en-tête est introuvable, un emplacement neutre « LOGO EITT » s'affiche (aucun logo n'est inventé). Pour changer de logo, remplacez les fichiers de `assets/logo/` ou modifiez `data-logo-src`.

La palette suit celle du logo : **cyan EITT `#16DDF3`** sur fond noir bleuté (`#050a14`). Les couleurs sont regroupées en variables CSS au début de `css/style.css` (`--neon`, `--bg`, `--panel`…).

## Ambiance, animations et coach

- **PC posé sur une table éclairée** (page d'accueil) : une scène en HTML/CSS/SVG pur — table en bois, écran qui affiche le schéma du PC, tour avec ventilateurs, clavier, souris, mug, lampe de bureau avec son cône de lumière. La lumière bleue de l'écran **déborde** de la scène (halo plus grand que l'illustration) et « respire » doucement ; une fine ligne de balayage parcourt l'écran.
- **Entrée dans le laboratoire** : un clic sur « Entrer dans le laboratoire » zoome sur l'écran, déclenche un éclair bleu, puis la page s'ouvre avec un fondu lumineux. Les bords de l'écran s'illuminent en bleu à chaque changement de page, et les pièces du schéma apparaissent les unes après les autres.
- **Coach (pop-up non bloquant)** : une petite carte au coin de l'écran félicite et encourage — bienvenue dans le laboratoire, 1ᵉʳ, 3ᵉ, 5ᵉ et dernier composant découvert, première pièce assemblée, PC assemblé, scénario de diagnostic réussi, fin de chaque quiz (message différent selon le score : « Sans faute, bravo ! », « Excellent travail ! », « Bon début, continuez ! », « Ne lâchez rien, vous allez y arriver ! »), récompenses et paliers de progression (25, 50, 75, 100 %). Elle se ferme avec × ou « Plus tard », disparaît seule après quelques secondes, ne bloque jamais la page, et propose parfois une action (« Passer au niveau 2 », « Réviser les fiches »). Les messages de bienvenue et de premières fois ne s'affichent qu'**une seule fois** (mémorisé localement, clé `eitt-hardware-quest:coach:v1`).
- **Confettis** légers (éléments CSS, aucune bibliothèque) pour les vraies réussites.
- **Accessibilité** : avec « Réduire les animations » activé dans le système, le flash d'entrée, le halo animé, les confettis et les mouvements sont supprimés ; la navigation est immédiate. Le coach est un `role="dialog"` non modal annoncé poliment aux lecteurs d'écran ; les halos sont décoratifs (`aria-hidden`, sans capture de clic).
- **Personnaliser** : couleurs de la lumière dans les variables CSS (`--neon`) ; textes des encouragements dans `js/app.js` (fonctions `coach`, `celebrateQuiz`, `markDiscovered`) ; scène dans `sceneMarkup()` et les classes `.ds-*` de `css/style.css`.

## Modifier ou compléter le contenu

- **Fiches** : `data/components.js` (un objet par composant ; `categorie` doit correspondre à une catégorie de la liste).
- **Quiz** : `data/quiz.js` — `reponse` est l'index (à partir de 0) de la bonne option ; ajoutez des questions en respectant le champ `niveau` (1, 2, 3, 4 ou `"eclair"`). Un niveau déclaré avec `bonus: true` ne compte pas dans le pourcentage global ; `vf: true` active la présentation Vrai/Faux (ordre des réponses fixe) et `tirage: N` tire N questions au hasard.
- **Assemblage et diagnostic** : `data/exercises.js`. Pour le diagnostic, chaque démarche a un `verdict` : `bon`, `moyen` ou `mauvais`.
- **Ajouter un composant au schéma** : ajoutez la fiche dans `components.js`, puis son dessin dans `js/lab-svg.js` (fonction `lab`) et une icône dans `ICON_PATHS`.

## Progression et récompenses

La progression est enregistrée **uniquement sur l'appareil**, dans le stockage local du navigateur (`localStorage`, clé `eitt-hardware-quest:v1`). Aucune donnée n'est envoyée sur Internet ; aucun compte n'est nécessaire. Elle peut être perdue si l'utilisateur efface les données du navigateur ou utilise la navigation privée. Si le navigateur refuse tout stockage, l'application reste utilisable et l'indique sur la page « Progression ».

**Pourcentage global** = moyenne à poids égal (25 % chacun) de : fiches consultées (sur 10), niveaux de quiz notés terminés (sur 4 ; le défi éclair est un bonus et ne compte pas), éléments d'assemblage placés (sur 7), scénarios de diagnostic résolus (sur 5).

| Récompense | Critère |
| --- | --- |
| Explorateur du matériel | Consulter les 10 fiches de composants |
| Détective des composants | Obtenir au moins 7 bonnes réponses sur 10 à un quiz |
| Architecte débutant | Placer correctement les 7 éléments de l'exercice d'assemblage |
| Technicien de diagnostic | Trouver une bonne démarche pour chacun des 5 scénarios de diagnostic |

Le score et les récompenses sont des repères personnels, pas une certification officielle. Les erreurs ne sont jamais pénalisées.

## Accessibilité et responsive

- Navigation complète au clavier (Tab, Entrée, Espace, Échap pour fermer une fiche), focus visible, lien d'évitement.
- Composants du schéma exposés comme boutons avec libellés explicites ; annonces pour lecteurs d'écran.
- Les résultats « bon/mauvais » ne reposent pas uniquement sur la couleur (texte et symboles).
- Respect de `prefers-reduced-motion`.
- Mobile : menu repliable, schéma défilable horizontalement avec liste des composants juste dessous, fiche présentée dans un panneau en bas d'écran, aucun glisser-déposer obligatoire.

## Tests réalisés

Un script de test automatisé (Playwright, Chromium) a été exécuté sur les fichiers ouverts en `file://` : **172 vérifications réussies sur 172**, sans erreur dans la console. Il couvre : l'accueil, la sélection des 10 composants (souris et clavier), les fiches, la recherche et le filtre, les quatre niveaux du quiz et le défi éclair Vrai/Faux (score, erreurs, récapitulatif, redémarrage, tirage de 10 affirmations différentes), la scène lumineuse de l'accueil (halo qui dépasse de l'écran, clics non bloqués), le flash d'entrée, le coach (bienvenue affichée une seule fois, encouragement après un mauvais score, pop-up non bloquant), tout le parcours d'assemblage (mauvais emplacement, ordre, fin), les 5 scénarios de diagnostic, la progression (persistance après rechargement, effacement), les routes inconnues, l'affichage mobile (375 et 390 px, absence de débordement horizontal, panneau de fiche) et la réduction des animations (entrée immédiate, ni flash ni confettis).

**Non testé :** Firefox et Safari (le code n'utilise que des fonctions CSS/JS standard, mais le rendu des halos lumineux — `mix-blend-mode`, `filter: blur` — peut y varier légèrement), vrais appareils tactiles, téléphones anciens (performances des animations), lecteurs d'écran (NVDA, VoiceOver…). Un test manuel sur ces environnements est recommandé avant une diffusion large.

## Limites de ce MVP

- Le schéma est une illustration simplifiée (2D), pas un modèle 3D.
- Le schéma du PC se parcourt horizontalement sur les très petits écrans ; la liste des composants offre une alternative directe.
- Un seul exercice d'assemblage (une carte mère fictive de format générique) ; les formats ATX / micro-ATX / mini-ITX sont expliqués mais non simulés.
- Les explications sont volontairement simplifiées et seront à faire relire par un enseignant ou un technicien avant diffusion officielle. Les anecdotes et les exemples de sockets (AM5, LGA1700) doivent être vérifiés et mis à jour avec le temps.
- Pas de statistiques d'usage, pas de synchronisation entre appareils.

## Idées d'amélioration

1. **Vue éclatée animée** : animer l'écartement des pièces (ou une rotation 3D légère en SVG/CSS) et ajouter un zoom sur chaque composant.
2. **Assemblage enrichi** : plusieurs configurations (ATX, micro-ATX, mini-ITX), choix de composants avec vérification de compatibilité (socket, DDR4/DDR5, M.2), et glisser-déposer facultatif.
3. **Parcours enseignant** : export de la progression (fichier à imprimer ou à partager), banque de questions extensible, et mode « classe » avec résultats anonymisés.
