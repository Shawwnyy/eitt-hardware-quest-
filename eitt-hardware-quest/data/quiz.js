/*
 * EITT Hardware Quest — Données du quiz (30 questions, 3 niveaux).
 *
 * Chaque question : { id, niveau, question, options[], reponse (index de la bonne option),
 *                     explication, composant (id de la fiche à revoir) }
 * L'ordre des questions et des options est mélangé à chaque partie.
 */
window.EITT_DATA = window.EITT_DATA || {};

window.EITT_DATA.quiz = {
  niveaux: [
    {
      id: 1,
      titre: "Débutant",
      description: "Identifier les composants, comprendre leurs fonctions de base et associer un nom à une fonction."
    },
    {
      id: 2,
      titre: "Intermédiaire",
      description: "Comprendre les relations entre composants, repérer des différences techniques et choisir selon un besoin simple."
    },
    {
      id: 3,
      titre: "Avancé",
      description: "Comprendre les contraintes de compatibilité, interpréter une configuration et analyser des situations plus complexes."
    }
  ],

  questions: [
    /* ------------------------- Niveau 1 — Débutant ------------------------- */
    {
      id: "n1-01",
      niveau: 1,
      question: "Quel composant exécute les instructions des programmes et réalise la plupart des calculs ?",
      options: ["Le processeur (CPU)", "L'alimentation", "Le boîtier", "La carte réseau"],
      reponse: 0,
      explication: "Le processeur lit et exécute les instructions des programmes. L'alimentation fournit l'énergie, le boîtier protège les composants et la carte réseau gère les échanges avec un réseau.",
      composant: "cpu"
    },
    {
      id: "n1-02",
      niveau: 1,
      question: "Que devient en général le contenu de la RAM lorsque l'ordinateur est éteint ?",
      options: [
        "Il reste conservé tel quel, comme sur un SSD",
        "Il est perdu, car la RAM est une mémoire volatile",
        "Il est transféré dans le processeur",
        "Il est copié dans l'alimentation"
      ],
      reponse: 1,
      explication: "La RAM a besoin d'électricité pour conserver ses données : elle est volatile. C'est pourquoi un document non enregistré est perdu en cas de coupure de courant. Le stockage (SSD, disque dur) conserve les données sans alimentation.",
      composant: "ram"
    },
    {
      id: "n1-03",
      niveau: 1,
      question: "Quel composant accueille les autres et leur permet de communiquer entre eux ?",
      options: ["Le dissipateur thermique", "La carte mère", "Le disque dur", "La carte graphique"],
      reponse: 1,
      explication: "La carte mère accueille le processeur, la RAM, les cartes d'extension, etc., et fournit les circuits qui les relient.",
      composant: "carte-mere"
    },
    {
      id: "n1-04",
      niveau: 1,
      question: "Quel composant transforme le courant du secteur en tensions adaptées aux composants du PC ?",
      options: ["La carte mère", "L'alimentation", "Le processeur", "La carte réseau"],
      reponse: 1,
      explication: "L'alimentation convertit le courant alternatif du secteur en tensions continues (par exemple 12 V, 5 V et 3,3 V). La carte mère adapte ensuite certaines tensions pour le processeur, mais elle ne se branche pas sur le secteur.",
      composant: "alimentation"
    },
    {
      id: "n1-05",
      niveau: 1,
      question: "Quel composant sert à conserver durablement le système d'exploitation, les applications et les fichiers ?",
      options: ["Le SSD", "La RAM", "Le dissipateur", "Le processeur"],
      reponse: 0,
      explication: "Un SSD (comme un disque dur) conserve les données même sans alimentation électrique. La RAM, elle, ne garde les données que temporairement.",
      composant: "ssd"
    },
    {
      id: "n1-06",
      niveau: 1,
      question: "À quoi sert la pâte thermique ?",
      options: [
        "À coller définitivement le processeur sur la carte mère",
        "À améliorer le transfert de chaleur entre le processeur et son dissipateur",
        "À lubrifier le ventilateur",
        "À protéger le boîtier de la poussière"
      ],
      reponse: 1,
      explication: "La pâte thermique comble les minuscules irrégularités entre le processeur et la base du dissipateur, pour que la chaleur passe mieux. On l'applique en couche fine.",
      composant: "refroidissement"
    },
    {
      id: "n1-07",
      niveau: 1,
      question: "Quel composant est spécialisé dans les calculs d'affichage, comme les images en 3D ?",
      options: ["Le SSD", "La carte graphique (GPU)", "L'alimentation", "Le boîtier"],
      reponse: 1,
      explication: "Le GPU est conçu pour calculer très rapidement un grand nombre de pixels en parallèle. Il peut être intégré au processeur ou fourni par une carte graphique dédiée.",
      composant: "gpu"
    },
    {
      id: "n1-08",
      niveau: 1,
      question: "Pour brancher un câble Ethernet (RJ45) à un PC, de quoi a-t-on besoin ?",
      options: [
        "D'une interface réseau (souvent déjà intégrée à la carte mère)",
        "D'un ventilateur supplémentaire",
        "D'une barrette de RAM",
        "D'un SSD"
      ],
      reponse: 0,
      explication: "L'interface réseau (contrôleur Ethernet) gère la communication avec le réseau. Sur la plupart des cartes mères, elle est déjà intégrée : le port RJ45 est présent à l'arrière du PC.",
      composant: "reseau"
    },
    {
      id: "n1-09",
      niveau: 1,
      question: "Quel est le rôle principal du boîtier ?",
      options: [
        "Calculer les images à l'écran",
        "Accueillir et protéger les composants, et participer à la circulation de l'air",
        "Convertir le courant électrique",
        "Stocker les fichiers de l'utilisateur"
      ],
      reponse: 1,
      explication: "Le boîtier fixe et protège les composants, organise leur agencement et guide l'air pour les refroidir.",
      composant: "boitier"
    },
    {
      id: "n1-10",
      niveau: 1,
      question: "Quelle association entre un composant et sa fonction est correcte ?",
      options: [
        "RAM → conserver durablement les photos",
        "Dissipateur → évacuer la chaleur du processeur",
        "Alimentation → afficher l'image sur l'écran",
        "Carte mère → refroidir la carte graphique"
      ],
      reponse: 1,
      explication: "Le dissipateur évacue la chaleur du processeur. Les photos se conservent sur un stockage, l'image est calculée par le GPU et le refroidissement relève des dissipateurs et ventilateurs.",
      composant: "refroidissement"
    },

    /* ---------------------- Niveau 2 — Intermédiaire ----------------------- */
    {
      id: "n2-01",
      niveau: 2,
      question: "Quelle est la principale différence entre un SSD et un disque dur (HDD) ?",
      options: [
        "Le SSD stocke les données dans des puces de mémoire flash sans pièce mobile ; le HDD utilise des plateaux magnétiques en rotation",
        "Le SSD est volatile alors que le HDD ne l'est pas",
        "Le HDD n'a pas besoin d'être alimenté",
        "Le SSD ne peut contenir que le système d'exploitation"
      ],
      reponse: 0,
      explication: "Les deux conservent les données sans alimentation. Le SSD n'a pas de pièce mobile, ce qui le rend plus rapide et plus résistant aux chocs ; le disque dur coûte en général moins cher par téraoctet.",
      composant: "hdd"
    },
    {
      id: "n2-02",
      niveau: 2,
      question: "Un PC devient très lent quand on ouvre beaucoup d'onglets. Le moniteur système montre une RAM presque pleine et un disque très sollicité. Quelle piste est la plus probable ?",
      options: [
        "La RAM est insuffisante pour cet usage",
        "L'alimentation est trop puissante",
        "Le boîtier est trop grand",
        "La carte réseau est défectueuse"
      ],
      reponse: 0,
      explication: "Quand la RAM est pleine, le système déplace des données vers le stockage (fichier d'échange), beaucoup plus lent. Fermer des programmes ou, si la carte mère l'accepte, ajouter de la RAM peut aider.",
      composant: "ram"
    },
    {
      id: "n2-03",
      niveau: 2,
      question: "Pour l'affichage, un processeur doté d'un GPU intégré utilise généralement :",
      options: [
        "Une mémoire vidéo dédiée, soudée à la carte mère",
        "Une partie de la RAM du système, partagée avec le processeur",
        "Le SSD comme mémoire graphique",
        "L'alimentation comme mémoire graphique"
      ],
      reponse: 1,
      explication: "Un GPU intégré n'a en général pas de VRAM dédiée : il partage la RAM du système. Une carte graphique dédiée possède sa propre VRAM.",
      composant: "gpu"
    },
    {
      id: "n2-04",
      niveau: 2,
      question: "Toutes choses égales par ailleurs, que permet un processeur à 8 cœurs par rapport à un processeur à 4 cœurs ?",
      options: [
        "Traiter tous les logiciels exactement deux fois plus vite",
        "Mener davantage de tâches en parallèle, ce qui profite aux logiciels capables de les exploiter",
        "Consommer forcément moins d'énergie",
        "Se passer de RAM"
      ],
      reponse: 1,
      explication: "Plus de cœurs permettent de traiter plus de tâches en même temps. Mais un logiciel qui n'utilise qu'un ou deux cœurs n'ira pas deux fois plus vite : le gain dépend du logiciel et de l'architecture.",
      composant: "cpu"
    },
    {
      id: "n2-05",
      niveau: 2,
      question: "Vous voulez surtout jouer à des jeux 3D récents. Quel composant a généralement le plus d'impact sur la fluidité (images par seconde) ?",
      options: [
        "La carte graphique",
        "Le boîtier",
        "Le port Ethernet",
        "La couleur des ventilateurs"
      ],
      reponse: 0,
      explication: "Dans la plupart des jeux 3D, la carte graphique est le facteur principal. Le processeur, la RAM et le stockage influencent aussi l'expérience (temps de chargement, régularité).",
      composant: "gpu"
    },
    {
      id: "n2-06",
      niveau: 2,
      question: "Que désigne « NVMe » pour un SSD ?",
      options: [
        "Un format de barrette de mémoire",
        "Un protocole de communication rapide, souvent utilisé via le bus PCI Express",
        "Un type de câble d'alimentation",
        "Une marque de carte mère"
      ],
      reponse: 1,
      explication: "NVMe est un protocole conçu pour la mémoire flash, souvent utilisé avec le format M.2 via PCIe. Il offre généralement de meilleurs débits que le SATA. « M.2 » désigne le format physique, pas le protocole.",
      composant: "ssd"
    },
    {
      id: "n2-07",
      niveau: 2,
      question: "Une alimentation porte l'indication « 650 W ». Que signifie cette valeur ?",
      options: [
        "Le PC consomme toujours 650 W",
        "C'est la puissance maximale que l'alimentation peut délivrer",
        "C'est sa durée de vie en heures",
        "C'est la vitesse de son ventilateur"
      ],
      reponse: 1,
      explication: "La puissance indiquée est un maximum. La consommation réelle dépend de ce que demandent les composants à chaque instant : elle est le plus souvent bien inférieure.",
      composant: "alimentation"
    },
    {
      id: "n2-08",
      niveau: 2,
      question: "Quel est l'intérêt d'un ventilateur de boîtier ?",
      options: [
        "Produire de l'électricité pour le PC",
        "Renouveler l'air du boîtier en évacuant l'air chaud et en faisant entrer de l'air plus frais",
        "Accélérer le SSD",
        "Ranger les câbles"
      ],
      reponse: 1,
      explication: "Les ventilateurs du boîtier créent un flux d'air : de l'air plus frais entre, l'air chauffé par les composants est évacué.",
      composant: "boitier"
    },
    {
      id: "n2-09",
      niveau: 2,
      question: "Pourquoi installe-t-on souvent deux barrettes de RAM (2 × 8 Go) plutôt qu'une seule de 16 Go sur un PC de bureau ?",
      options: [
        "Pour exploiter le double canal (dual channel), qui peut augmenter le débit mémoire",
        "Parce qu'un PC ne démarre pas avec une seule barrette",
        "Parce qu'une barrette de 16 Go ne fonctionne jamais correctement",
        "Pour se passer de SSD"
      ],
      reponse: 0,
      explication: "Un PC démarre avec une seule barrette. Mais deux barrettes permettent généralement d'utiliser deux canaux mémoire en parallèle. Le gain dépend du processeur et des usages.",
      composant: "ram"
    },
    {
      id: "n2-10",
      niveau: 2,
      question: "Vous devez archiver 4 To de vidéos au meilleur coût par téraoctet, sans besoin de vitesse particulière. Quel stockage est généralement le plus adapté ?",
      options: [
        "Un disque dur (HDD)",
        "Une barrette de RAM de 4 Go",
        "Un SSD NVMe haut de gamme, car il est toujours moins cher par téraoctet",
        "Une carte graphique avec beaucoup de VRAM"
      ],
      reponse: 0,
      explication: "Les disques durs offrent généralement le coût par téraoctet le plus bas. Les SSD sont plus rapides mais plus chers à capacité égale (les prix évoluent). Pour des archives, il faut aussi prévoir une copie de sauvegarde.",
      composant: "hdd"
    },

    /* ------------------------- Niveau 3 — Avancé --------------------------- */
    {
      id: "n3-01",
      niveau: 3,
      question: "Un processeur utilise le socket AM5. Peut-on l'installer sur une carte mère dotée d'un socket LGA1700 ?",
      options: [
        "Oui, tous les sockets sont interchangeables",
        "Oui, avec un adaptateur universel",
        "Non : les sockets sont différents, le processeur doit correspondre au socket de la carte mère",
        "Oui, mais seulement si la RAM est en DDR5"
      ],
      reponse: 2,
      explication: "Chaque socket a une disposition de contacts précise. AM5 (AMD) et LGA1700 (Intel) sont incompatibles. Avant d'acheter, on vérifie la liste des processeurs pris en charge par la carte mère.",
      composant: "carte-mere"
    },
    {
      id: "n3-02",
      niveau: 3,
      question: "Peut-on insérer une barrette de DDR5 dans un emplacement conçu pour de la DDR4 ?",
      options: [
        "Oui, elles sont identiques",
        "Non : leurs encoches et leurs caractéristiques électriques diffèrent, elles ne sont pas interchangeables",
        "Oui, en forçant légèrement",
        "Oui, mais seulement pour une barrette de 16 Go"
      ],
      reponse: 1,
      explication: "DDR4 et DDR5 ont des encoches à des positions différentes pour éviter l'erreur de montage. Il ne faut jamais forcer : la carte mère (et le processeur) ne gèrent qu'un type de mémoire donné.",
      composant: "ram"
    },
    {
      id: "n3-03",
      niveau: 3,
      question: "Le fabricant d'une carte graphique recommande une alimentation d'au moins 750 W. Votre alimentation fait 450 W. Que conclure ?",
      options: [
        "C'est suffisant : l'alimentation ne concerne que la carte mère",
        "Il faut très probablement prévoir une alimentation plus puissante, avec les connecteurs adaptés",
        "Il suffit d'ajouter un ventilateur",
        "Il faut changer de boîtier"
      ],
      reponse: 1,
      explication: "La puissance recommandée tient compte de l'ensemble de la configuration. Une alimentation trop juste peut provoquer des arrêts ou des instabilités. Il faut aussi vérifier que les connecteurs PCIe requis par la carte graphique sont disponibles.",
      composant: "alimentation"
    },
    {
      id: "n3-04",
      niveau: 3,
      question: "Un SSD M.2 est-il compatible avec n'importe quel emplacement M.2 ?",
      options: [
        "Oui, « M.2 » garantit toujours la compatibilité",
        "Non : un SSD M.2 peut être SATA ou NVMe, et un emplacement peut ne gérer que l'un des deux ; il faut consulter la fiche de la carte mère",
        "Oui, seule la couleur du connecteur change",
        "Non, le M.2 ne peut contenir que de la RAM"
      ],
      reponse: 1,
      explication: "« M.2 » désigne un format physique. Selon la carte mère, un emplacement accepte SATA, NVMe ou les deux, et la longueur prise en charge varie (2242, 2260, 2280…).",
      composant: "ssd"
    },
    {
      id: "n3-05",
      niveau: 3,
      question: "Peut-on installer une carte mère de format ATX dans un boîtier prévu uniquement pour des cartes mères mini-ITX ?",
      options: [
        "Oui, tous les boîtiers acceptent tous les formats",
        "Non : une carte ATX est plus grande et ne rentre pas dans un boîtier mini-ITX",
        "Oui, si on retire l'alimentation",
        "Oui, mais seulement avec un SSD M.2"
      ],
      reponse: 1,
      explication: "Un boîtier accepte en général son format et des formats plus petits (un boîtier ATX accepte souvent micro-ATX et mini-ITX), mais pas l'inverse.",
      composant: "boitier"
    },
    {
      id: "n3-06",
      niveau: 3,
      question: "Un PC a 2 barrettes de 8 Go installées, mais le système n'en voit que 8 Go. Quelle première vérification, PC éteint et débranché, est la plus pertinente ?",
      options: [
        "Remplacer le processeur",
        "Vérifier que la seconde barrette est bien enclenchée, puis la tester seule et dans un autre emplacement",
        "Changer d'alimentation",
        "Remplacer le boîtier"
      ],
      reponse: 1,
      explication: "Une barrette mal enclenchée est une cause fréquente. Tester une barrette à la fois, dans différents emplacements, permet d'isoler la barrette ou l'emplacement défaillant. On éteint et on débranche toujours avant d'intervenir.",
      composant: "ram"
    },
    {
      id: "n3-07",
      niveau: 3,
      question: "Après un montage neuf, la température du processeur grimpe très vite alors que le ventilateur tourne fort. Quelle cause est plausible ?",
      options: [
        "Le dissipateur est mal fixé, ou son film protecteur n'a pas été retiré",
        "Le SSD est trop rapide",
        "La RAM est en DDR5",
        "Le boîtier est de couleur noire"
      ],
      reponse: 0,
      explication: "Si le contact entre le dissipateur et le processeur est mauvais, la chaleur s'évacue mal. On vérifie la fixation, le retrait du film plastique sous le dissipateur et la quantité de pâte thermique.",
      composant: "refroidissement"
    },
    {
      id: "n3-08",
      niveau: 3,
      question: "Une carte mère possède 4 emplacements de RAM DDR5 et prend en charge 128 Go au maximum. Quelle capacité maximale par barrette si l'on remplit les 4 emplacements avec des barrettes identiques ?",
      options: ["16 Go", "32 Go", "64 Go", "128 Go"],
      reponse: 1,
      explication: "128 Go ÷ 4 = 32 Go par barrette. Cette limite dépend de la carte mère et du processeur : il faut toujours vérifier leurs spécifications.",
      composant: "ram"
    },
    {
      id: "n3-09",
      niveau: 3,
      question: "Vous installez une carte graphique dédiée, mais l'écran reste branché sur la sortie vidéo de la carte mère. Que se passe-t-il typiquement ?",
      options: [
        "L'image passe automatiquement par la carte dédiée",
        "Si le processeur a un GPU intégré, l'image vient de lui et la carte dédiée n'est pas utilisée pour l'affichage ; sinon, il n'y a pas d'image",
        "Le PC refuse de démarrer",
        "L'écran s'allume seulement s'il y a un SSD"
      ],
      reponse: 1,
      explication: "Les sorties vidéo de la carte mère dépendent du GPU intégré du processeur. Pour utiliser la carte dédiée, il faut brancher l'écran sur ses propres sorties (HDMI, DisplayPort).",
      composant: "gpu"
    },
    {
      id: "n3-10",
      niveau: 3,
      question: "Un SSD SATA de 2,5 pouces doit fonctionner dans un PC de bureau. De quoi a-t-il besoin ?",
      options: [
        "D'un emplacement M.2 uniquement",
        "D'un port SATA de la carte mère (câble de données) et d'un connecteur d'alimentation SATA venant de l'alimentation",
        "D'un emplacement PCI Express x16",
        "D'aucun câble : il fonctionne par induction"
      ],
      reponse: 1,
      explication: "Un SSD SATA 2,5 pouces demande deux liaisons : une pour les données et une pour l'alimentation. Un SSD M.2 reçoit l'alimentation et les données directement par son emplacement.",
      composant: "ssd"
    }
  ]
};
