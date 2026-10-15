/*
 * EITT Hardware Quest — Données des exercices : assemblage virtuel et diagnostic de pannes.
 */
window.EITT_DATA = window.EITT_DATA || {};

/* ------------------------------------------------------------------------- */
/*  Assemblage virtuel                                                       */
/* ------------------------------------------------------------------------- */
window.EITT_DATA.assemblage = {
  introduction: "Associez chaque élément à son emplacement sur une carte mère schématique. Choisissez d'abord un élément dans la liste, puis cliquez sur l'emplacement qui lui correspond.",
  avertissement: "Exercice pédagogique : il ne remplace ni la notice des composants ni un vrai montage. La carte mère affichée est fictive et simplifiée.",
  formats: [
    { nom: "ATX", detail: "format standard des PC de bureau, avec généralement plusieurs emplacements PCI Express et quatre emplacements de RAM." },
    { nom: "micro-ATX", detail: "format plus compact, avec en général moins d'emplacements d'extension." },
    { nom: "mini-ITX", detail: "format très compact, avec généralement un seul emplacement PCI Express et deux emplacements de RAM." }
  ],
  compatibilite: "Tous les composants ne sont pas universellement compatibles : le socket de la carte mère doit correspondre au processeur, la génération de RAM (DDR4 ou DDR5) doit être prise en charge, un emplacement M.2 ne gère pas forcément SATA et NVMe, et le boîtier doit accepter le format de la carte mère.",

  emplacements: [
    {
      id: "socket-cpu",
      nom: "Socket du processeur",
      accueille: "le processeur, puis son système de refroidissement posé par-dessus"
    },
    {
      id: "ram",
      nom: "Emplacements mémoire (DIMM)",
      accueille: "des barrettes de mémoire vive"
    },
    {
      id: "m2",
      nom: "Emplacement M.2",
      accueille: "un SSD au format M.2"
    },
    {
      id: "pcie",
      nom: "Emplacement PCI Express x16",
      accueille: "une carte d'extension, typiquement la carte graphique"
    },
    {
      id: "atx24",
      nom: "Connecteur d'alimentation principal (24 broches)",
      accueille: "le câble principal venant de l'alimentation"
    },
    {
      id: "cpu-power",
      nom: "Connecteur d'alimentation du processeur",
      accueille: "le câble d'alimentation dédié au processeur (4+4 ou 8 broches)"
    }
  ],

  /* L'ordre de ce tableau est l'ordre d'installation conseillé (étape par étape). */
  pieces: [
    {
      id: "cpu",
      nom: "Processeur (CPU)",
      composant: "cpu",
      emplacement: "socket-cpu",
      indice: "Cette puce carrée se pose dans un support à contacts, près du centre de la carte mère.",
      explication: "Le processeur se pose dans le socket en respectant le repère (un petit triangle ou des encoches), sans forcer. Chaque socket correspond à une famille de processeurs précise (par exemple AM5 ou LGA1700) : processeur et carte mère doivent être compatibles."
    },
    {
      id: "refroidisseur",
      nom: "Refroidisseur (dissipateur + pâte thermique)",
      composant: "refroidissement",
      emplacement: "socket-cpu",
      apres: "cpu",
      indice: "Il se fixe par-dessus le processeur, avec un bon contact thermique.",
      explication: "Le refroidisseur se fixe sur le processeur, une fois celui-ci en place, avec une fine couche de pâte thermique (parfois déjà appliquée). On retire les films protecteurs sous sa base. Sans refroidissement, un processeur chauffe très vite."
    },
    {
      id: "ram",
      nom: "Barrettes de RAM",
      composant: "ram",
      emplacement: "ram",
      indice: "Ces barrettes allongées s'enclenchent dans des supports parallèles, munis de clips.",
      explication: "Les barrettes de RAM s'enclenchent dans les emplacements mémoire (DIMM), l'encoche alignée avec le détrompeur. La génération (DDR4 ou DDR5) doit correspondre à celle de la carte mère. Quand il n'y a que deux barrettes, le manuel de la carte mère indique les emplacements à utiliser."
    },
    {
      id: "ssd",
      nom: "SSD M.2",
      composant: "ssd",
      emplacement: "m2",
      indice: "Ce SSD ressemble à une petite barrette plate qui se fixe à l'horizontale sur la carte, avec une vis.",
      explication: "Un SSD M.2 s'insère en biais dans son emplacement puis se fixe par une petite vis. Il faut vérifier que l'emplacement accepte son protocole (SATA ou NVMe) et sa longueur."
    },
    {
      id: "gpu",
      nom: "Carte graphique (GPU)",
      composant: "gpu",
      emplacement: "pcie",
      indice: "C'est l'élément le plus encombrant : il se branche dans le plus long des emplacements d'extension.",
      explication: "La carte graphique dédiée se place dans l'emplacement PCI Express x16, en général le plus long, puis se fixe au boîtier. Selon le modèle, elle demande aussi un ou plusieurs câbles d'alimentation PCIe venant de l'alimentation."
    },
    {
      id: "atx24",
      nom: "Câble d'alimentation principal (24 broches)",
      composant: "alimentation",
      emplacement: "atx24",
      indice: "C'est le plus large connecteur d'alimentation de la carte mère, souvent sur son bord.",
      explication: "Ce large connecteur (24 broches) fournit l'énergie principale à la carte mère. Il ne s'enfiche que dans un sens et se verrouille par un clip."
    },
    {
      id: "cpu-power",
      nom: "Câble d'alimentation du processeur (8 broches)",
      composant: "alimentation",
      emplacement: "cpu-power",
      indice: "Ce câble se branche près du socket du processeur, souvent en haut de la carte mère.",
      explication: "Ce câble, issu de l'alimentation, alimente directement la zone du processeur. Sans lui, le PC ne démarre en général pas."
    }
  ]
};

/* ------------------------------------------------------------------------- */
/*  Diagnostic de pannes fictives                                            */
/* ------------------------------------------------------------------------- */
window.EITT_DATA.diagnosticAvertissement = {
  simplification: "Les scénarios sont simplifiés : en réalité, une panne peut avoir plusieurs causes, et plusieurs démarches peuvent être raisonnables.",
  securite: "Sécurité : avant toute intervention à l'intérieur du boîtier, éteignez le PC, débranchez le câble secteur, attendez quelques instants et touchez une partie métallique du boîtier pour vous décharger de l'électricité statique. N'ouvrez jamais une alimentation et ne manipulez jamais un composant sous tension."
};

/* verdict : "bon" (démarche recommandée), "moyen" (piste possible mais incomplète), "mauvais" (à éviter) */
window.EITT_DATA.diagnostics = [
  {
    id: "ne-demarre-pas",
    titre: "Le PC ne démarre pas",
    resume: "Vous appuyez sur le bouton de démarrage : rien ne se passe.",
    symptomes: [
      "Aucune lumière et aucun bruit de ventilateur après l'appui sur le bouton de démarrage.",
      "Le PC fonctionnait normalement la veille.",
      "L'écran est éteint : aucun message n'apparaît."
    ],
    hypotheses: [
      "Pas de courant : prise ou multiprise éteinte, câble secteur mal enfoncé.",
      "L'interrupteur situé à l'arrière de l'alimentation est sur la position « arrêt ».",
      "Le bouton de la façade est mal raccordé à la carte mère.",
      "L'alimentation est défectueuse.",
      "Un autre composant défectueux empêche le démarrage."
    ],
    demarches: [
      {
        texte: "Vérifier d'abord l'alimentation électrique extérieure : prise, multiprise, câble secteur et interrupteur à l'arrière du PC.",
        verdict: "bon",
        retour: "Bon réflexe : on commence par les causes les plus simples, les moins coûteuses et les moins risquées à vérifier. Beaucoup de « pannes » viennent d'une multiprise éteinte ou d'un câble mal enfoncé."
      },
      {
        texte: "Remplacer tout de suite la carte mère.",
        verdict: "mauvais",
        retour: "Trop tôt et coûteux : sans aucune vérification préalable, vous risquez de remplacer une pièce en bon état. On élimine d'abord les causes simples."
      },
      {
        texte: "Ouvrir le boîtier de l'alimentation pour examiner ses composants internes.",
        verdict: "mauvais",
        retour: "À ne jamais faire : une alimentation contient des composants qui peuvent conserver une charge dangereuse, même débranchée. Une alimentation suspecte se remplace, elle ne se démonte pas."
      },
      {
        texte: "Réinstaller le système d'exploitation.",
        verdict: "mauvais",
        retour: "Un problème logiciel n'explique pas l'absence totale de signes de vie : sans courant, aucun logiciel ne peut s'exécuter."
      }
    ],
    causes: [
      "Alimentation électrique extérieure coupée ou câble mal enfoncé (cause la plus fréquente).",
      "Interrupteur de l'alimentation en position arrêt.",
      "Connecteur du bouton de façade débranché ou mal raccordé.",
      "Alimentation en panne.",
      "Plus rarement : carte mère ou autre composant défectueux."
    ],
    correction: [
      "Vérifier la prise, la multiprise (en la testant avec un autre appareil) et le câble secteur.",
      "Contrôler que l'interrupteur à l'arrière de l'alimentation est sur la position « marche ».",
      "Si rien ne change : éteindre, débrancher, puis vérifier que les connecteurs d'alimentation de la carte mère sont bien enfoncés et que le bouton de façade est bien raccordé.",
      "Si le PC reste muet, faire tester ou remplacer l'alimentation, puis la carte mère, auprès d'un professionnel si nécessaire."
    ]
  },
  {
    id: "surchauffe",
    titre: "L'ordinateur chauffe anormalement",
    resume: "Le PC devient brûlant et bruyant, puis ralentit ou s'éteint.",
    symptomes: [
      "Les ventilateurs tournent très fort après quelques minutes d'utilisation.",
      "Le PC ralentit nettement lors d'un jeu ou d'un calcul long.",
      "Il s'est éteint brusquement une fois, sans message d'erreur."
    ],
    hypotheses: [
      "Poussière dans le dissipateur, les ventilateurs ou les filtres du boîtier.",
      "Circulation d'air insuffisante dans le boîtier (entrées d'air obstruées, câbles qui gênent).",
      "Mauvais contact entre le dissipateur et le processeur, ou pâte thermique très ancienne.",
      "Ventilateur en panne.",
      "Charge de travail très élevée dans une pièce chaude."
    ],
    demarches: [
      {
        texte: "Relever les températures avec un logiciel de surveillance, vérifier que tous les ventilateurs tournent, puis contrôler l'état de la ventilation (poussière, entrées d'air dégagées).",
        verdict: "bon",
        retour: "Démarche logique : mesurer avant d'agir permet de confirmer le problème et d'identifier le composant concerné. L'inspection visuelle est sans risque quand elle est faite, au besoin, PC éteint et débranché."
      },
      {
        texte: "Déplacer le PC dans un endroit plus aéré et dégager ses entrées d'air.",
        verdict: "moyen",
        retour: "Piste utile : la circulation de l'air compte. Mais sans mesurer les températures ni vérifier les ventilateurs, on ne sait pas si c'est la cause du problème."
      },
      {
        texte: "Passer l'aspirateur dans le PC allumé.",
        verdict: "mauvais",
        retour: "Dangereux pour vous et pour le matériel : on n'intervient jamais à l'intérieur d'un PC sous tension. Il faut éteindre et débrancher, puis dépoussiérer délicatement (pinceau, air comprimé en immobilisant les pales des ventilateurs)."
      },
      {
        texte: "Ajouter de la RAM.",
        verdict: "mauvais",
        retour: "La RAM n'est pas la source principale de chaleur d'un PC : cela ne résoudra pas une surchauffe."
      }
    ],
    causes: [
      "Poussière accumulée qui freine l'air et isole les ailettes du dissipateur.",
      "Flux d'air mal organisé dans le boîtier.",
      "Dissipateur mal fixé ou pâte thermique à renouveler.",
      "Ventilateur qui ne tourne plus ou trop lentement."
    ],
    correction: [
      "Éteindre, débrancher puis ouvrir le boîtier.",
      "Dépoussiérer filtres, ventilateurs et dissipateur avec un pinceau ou de l'air comprimé, en immobilisant les pales des ventilateurs.",
      "Vérifier que le dissipateur est bien fixé et, si besoin, renouveler la pâte thermique en couche fine.",
      "Réorganiser les câbles pour dégager le flux d'air, puis refaire un relevé de températures."
    ]
  },
  {
    id: "memoire-insuffisante",
    titre: "Le système manque de mémoire disponible",
    resume: "Des messages signalent une mémoire insuffisante et le PC ralentit.",
    symptomes: [
      "Un message indique que la mémoire est insuffisante quand plusieurs logiciels sont ouverts.",
      "Le PC ralentit beaucoup avec une dizaine d'onglets de navigateur.",
      "Le voyant d'activité du disque reste allumé de longues périodes."
    ],
    hypotheses: [
      "La quantité de RAM est trop faible pour l'usage actuel.",
      "Un programme consomme de plus en plus de mémoire sans la libérer (fuite mémoire).",
      "Trop de programmes se lancent automatiquement au démarrage.",
      "Le stockage est presque plein et limite l'espace de secours du système."
    ],
    demarches: [
      {
        texte: "Ouvrir le gestionnaire des tâches (ou le moniteur d'activité) pour voir quels programmes utilisent la RAM et si l'usage est anormal.",
        verdict: "bon",
        retour: "Bonne démarche : elle montre ce qui consomme réellement la mémoire et permet de distinguer un manque de RAM d'un programme défaillant."
      },
      {
        texte: "Acheter tout de suite des barrettes de RAM supplémentaires.",
        verdict: "moyen",
        retour: "Peut aider si la RAM est réellement trop juste. Mais sans diagnostic, on ne sait pas si un programme défectueux est en cause, ni si la carte mère accepte ces barrettes (type, capacité, emplacements libres)."
      },
      {
        texte: "Remplacer l'alimentation.",
        verdict: "mauvais",
        retour: "L'alimentation fournit l'énergie, elle n'a pas de lien direct avec la quantité de mémoire disponible."
      },
      {
        texte: "Retirer la carte graphique.",
        verdict: "mauvais",
        retour: "Une carte graphique dédiée possède sa propre mémoire : la retirer ne libère pas de RAM et peut même empêcher l'affichage."
      }
    ],
    causes: [
      "RAM insuffisante pour l'usage (beaucoup d'onglets, logiciels lourds).",
      "Programme qui consomme de plus en plus de mémoire (fuite mémoire).",
      "Trop de logiciels lancés au démarrage.",
      "Stockage presque plein, qui réduit l'espace de secours (fichier d'échange)."
    ],
    correction: [
      "Identifier dans le gestionnaire des tâches les programmes les plus gourmands et fermer ceux qui sont inutiles.",
      "Désactiver les programmes inutiles au démarrage et mettre à jour ou remplacer un logiciel qui consomme anormalement.",
      "Si l'usage normal dépasse la RAM disponible, envisager d'ajouter de la RAM compatible (même génération, emplacements libres, capacité maximale de la carte mère).",
      "Libérer de l'espace de stockage si le disque est presque plein."
    ]
  },
  {
    id: "stockage-plein",
    titre: "Le stockage est presque plein",
    resume: "Il reste très peu d'espace libre sur le disque.",
    symptomes: [
      "Le système signale qu'il reste très peu d'espace libre.",
      "Les mises à jour échouent et l'enregistrement de fichiers devient lent ou impossible.",
      "Le PC ralentit lorsqu'il écrit des données."
    ],
    hypotheses: [
      "De gros fichiers (vidéos, téléchargements, images disque) occupent la majorité de l'espace.",
      "Des applications volumineuses ou inutilisées sont encore installées.",
      "La corbeille, les caches ou les anciennes sauvegardes locales occupent beaucoup de place.",
      "Le disque est simplement trop petit pour l'usage."
    ],
    demarches: [
      {
        texte: "Utiliser l'outil de stockage du système (ou un analyseur d'espace disque) pour repérer les dossiers et fichiers les plus volumineux.",
        verdict: "bon",
        retour: "Bonne démarche : on identifie ce qui occupe vraiment la place avant de supprimer quoi que ce soit."
      },
      {
        texte: "Acheter un second disque sans rien analyser.",
        verdict: "moyen",
        retour: "Peut être une bonne solution à terme, mais sans analyse, on risque d'accumuler des fichiers inutiles et de racheter du stockage trop tôt."
      },
      {
        texte: "Supprimer au hasard des dossiers du système pour libérer de la place.",
        verdict: "mauvais",
        retour: "Dangereux : supprimer des dossiers système peut empêcher le PC de démarrer. On ne supprime que des fichiers dont on connaît l'usage."
      },
      {
        texte: "Formater le disque.",
        verdict: "mauvais",
        retour: "Formater efface tout, système et données personnelles compris : une mesure bien trop radicale pour un simple manque de place."
      }
    ],
    causes: [
      "Fichiers volumineux (vidéos, téléchargements, archives).",
      "Applications ou jeux volumineux inutilisés.",
      "Corbeille, caches et anciennes sauvegardes locales.",
      "Capacité du disque devenue insuffisante."
    ],
    correction: [
      "Faire d'abord une sauvegarde des fichiers importants.",
      "Analyser l'occupation du stockage, vider la corbeille et supprimer les fichiers temporaires et téléchargements inutiles.",
      "Désinstaller les applications inutilisées et déplacer les gros fichiers rarement consultés vers un disque externe ou un autre disque.",
      "Si l'espace manque encore, envisager un stockage supplémentaire (SSD ou disque dur compatible)."
    ]
  },
  {
    id: "pas-d-affichage",
    titre: "L'affichage ne fonctionne pas",
    resume: "Le PC semble démarrer, mais l'écran n'affiche rien.",
    symptomes: [
      "Les ventilateurs tournent et les voyants du boîtier sont allumés.",
      "L'écran indique « pas de signal » ou reste noir.",
      "Une carte graphique dédiée a été installée récemment."
    ],
    hypotheses: [
      "Le câble vidéo est débranché ou l'écran est sur la mauvaise entrée.",
      "L'écran est branché sur la sortie de la carte mère alors qu'une carte graphique dédiée est installée (ou l'inverse).",
      "La carte graphique est mal enfoncée ou son câble d'alimentation n'est pas branché.",
      "Le câble ou l'écran est défectueux."
    ],
    demarches: [
      {
        texte: "Vérifier le câble vidéo, l'entrée sélectionnée sur l'écran et le port utilisé (carte graphique ou carte mère).",
        verdict: "bon",
        retour: "Bonne démarche : ce sont les causes les plus fréquentes et les plus rapides à vérifier, sans toucher à l'intérieur du PC."
      },
      {
        texte: "Tester avec un autre câble ou un autre écran.",
        verdict: "moyen",
        retour: "Très utile pour isoler un câble ou un écran défectueux. Mais on commence généralement par vérifier ce qui est déjà en place : branchements, entrée de l'écran et port utilisé."
      },
      {
        texte: "Réinstaller le système d'exploitation.",
        verdict: "mauvais",
        retour: "Aucune image n'apparaît même au démarrage du PC : le système n'est pas en cause à ce stade."
      },
      {
        texte: "Remplacer le processeur.",
        verdict: "mauvais",
        retour: "Pièce coûteuse et rarement en cause. On vérifie d'abord les branchements vidéo et la carte graphique."
      }
    ],
    causes: [
      "Écran branché sur une sortie inactive (carte mère au lieu de la carte graphique dédiée, ou inversement).",
      "Mauvaise entrée sélectionnée sur l'écran, câble débranché ou défectueux.",
      "Carte graphique mal enclenchée ou câble d'alimentation PCIe débranché.",
      "Plus rarement : composant défectueux."
    ],
    correction: [
      "Vérifier que le câble vidéo est bien enfoncé des deux côtés et que l'écran est réglé sur la bonne entrée.",
      "Avec une carte graphique dédiée, brancher l'écran sur ses sorties (et non sur celles de la carte mère).",
      "Si l'écran reste noir : éteindre, débrancher, puis vérifier que la carte graphique est bien enfoncée et que ses câbles d'alimentation sont branchés.",
      "Essayer un autre câble ou un autre écran pour isoler la cause."
    ]
  }
];
