/*
 * EITT Hardware Quest — Données pédagogiques : catégories et fiches de composants.
 *
 * Les données sont écrites en objets JavaScript (et non en fichiers .json chargés par fetch)
 * afin que l'application fonctionne en double-cliquant sur index.html, sans serveur local.
 */
window.EITT_DATA = window.EITT_DATA || {};

window.EITT_DATA.categories = [
  { id: "calcul", nom: "Calcul" },
  { id: "memoire", nom: "Mémoire" },
  { id: "stockage", nom: "Stockage" },
  { id: "connectivite", nom: "Connectivité" },
  { id: "energie-froid", nom: "Alimentation et refroidissement" },
  { id: "structure", nom: "Structure" }
];

window.EITT_DATA.composants = [
  {
    id: "cpu",
    nom: "Processeur",
    abreviation: "CPU",
    signification: "Central Processing Unit (unité centrale de traitement)",
    categorie: "calcul",
    resume: "Le processeur exécute les instructions des programmes et effectue de nombreux calculs.",
    role: "Exécuter les instructions des programmes et effectuer les calculs nécessaires au fonctionnement du système.",
    explication: "On le compare souvent à un cerveau ou à un chef d'orchestre. C'est une image pratique, mais le processeur ne « réfléchit » pas : il exécute des instructions très simples, à une cadence de plusieurs milliards d'opérations par seconde. Il participe au fonctionnement général du système, sans être le seul composant responsable des performances.",
    fonctionnement: "Le processeur lit des instructions en mémoire, les décode, les exécute, puis range le résultat. Il contient plusieurs cœurs, capables de traiter des tâches en parallèle, et une petite mémoire très rapide appelée cache. Sa fréquence, exprimée en gigahertz (GHz), indique la cadence de son horloge, mais elle ne suffit pas à comparer deux processeurs.",
    exemple: "Quand vous modifiez une cellule dans un tableur, le processeur recalcule toutes les formules qui en dépendent.",
    importance: "Il intervient dans presque toutes les tâches. Mais la rapidité ressentie dépend aussi de la quantité de RAM, du type de stockage et, pour certains usages, de la carte graphique.",
    confusions: [
      "Le processeur n'est pas « l'ordinateur » ni la tour : c'est une puce de quelques centimètres posée sur la carte mère.",
      "Plus de GHz ne veut pas toujours dire plus rapide : l'architecture et le nombre de cœurs comptent aussi.",
      "Un processeur n'est pas compatible avec toutes les cartes mères : le socket doit correspondre."
    ],
    anecdote: "Le premier microprocesseur commercial, l'Intel 4004 (1971), comptait environ 2 300 transistors. Un processeur actuel en contient des milliards."
  },
  {
    id: "ram",
    nom: "Mémoire vive",
    abreviation: "RAM",
    signification: "Random Access Memory (mémoire à accès aléatoire)",
    categorie: "memoire",
    resume: "La RAM conserve temporairement les données utilisées par les programmes en cours d'exécution.",
    role: "Conserver temporairement les données et les programmes en cours d'utilisation, pour que le processeur y accède très rapidement.",
    explication: "Imaginez la RAM comme le plan de travail d'un bureau : plus il est grand, plus vous pouvez étaler de documents ouverts en même temps. Le rangement durable, lui, se fait dans les tiroirs, c'est-à-dire dans le stockage. La RAM est généralement volatile : son contenu n'est pas conservé après une coupure d'alimentation.",
    fonctionnement: "Les barrettes de RAM s'enclenchent dans les emplacements mémoire (DIMM) de la carte mère. Le processeur y lit et y écrit beaucoup plus vite que sur un SSD ou un disque dur. Les générations de mémoire (DDR4, DDR5…) ne sont pas interchangeables : la carte mère n'en accepte qu'une.",
    exemple: "Plus vous ouvrez d'onglets et de logiciels, plus la RAM utilisée augmente. Si elle est pleine, le système utilise le stockage comme mémoire de secours, ce qui ralentit nettement l'ordinateur.",
    importance: "Une quantité de RAM insuffisante provoque des ralentissements, car les données doivent être déplacées sans cesse entre la mémoire et le stockage.",
    confusions: [
      "La RAM n'est pas de l'espace de stockage : un fichier enregistré est écrit sur le SSD ou le disque dur, pas dans la RAM.",
      "Ajouter de la RAM n'accélère pas toujours un PC : cela aide surtout quand la mémoire disponible est insuffisante.",
      "Une barrette DDR4 ne peut pas être installée dans un emplacement DDR5 : les encoches sont différentes."
    ],
    anecdote: "Sur beaucoup de PC de bureau, deux barrettes identiques fonctionnent en « double canal » (dual channel) : le processeur peut alors les utiliser en parallèle pour augmenter le débit mémoire."
  },
  {
    id: "carte-mere",
    nom: "Carte mère",
    abreviation: "",
    signification: "Motherboard",
    categorie: "connectivite",
    resume: "Elle accueille et relie de nombreux composants de l'ordinateur, et leur permet de communiquer.",
    role: "Accueillir et interconnecter les composants : processeur, mémoire, stockage, cartes d'extension, ports…",
    explication: "La carte mère est un grand circuit imprimé. On peut la voir comme le plan d'une ville : ses « routes » (les pistes de cuivre) permettent aux composants d'échanger des données et de recevoir de l'énergie. Elle fournit des connexions électriques et des interfaces de communication entre les éléments compatibles.",
    fonctionnement: "Elle comporte un socket pour le processeur, des emplacements pour la RAM, des ports PCI Express pour les cartes d'extension, des connecteurs de stockage (SATA, M.2) et des connecteurs d'alimentation. Elle intègre aussi un chipset, un micrologiciel (UEFI/BIOS) et les ports situés à l'arrière du PC. Elle existe en plusieurs formats (ATX, micro-ATX, mini-ITX) qui déterminent sa taille et son nombre d'emplacements.",
    exemple: "Avant d'acheter un processeur, on vérifie que le socket de la carte mère lui correspond. De même, le type de RAM (DDR4 ou DDR5) doit être pris en charge par la carte mère.",
    importance: "Elle impose les compatibilités entre les composants : c'est souvent la première pièce à choisir pour monter un PC cohérent.",
    confusions: [
      "Une carte mère n'accepte pas tous les processeurs ni tous les types de RAM.",
      "Le chipset n'est pas le processeur : c'est un circuit de la carte mère qui gère une partie des communications et des fonctions disponibles.",
      "La carte mère n'est pas le « cerveau » du PC : elle relie et alimente les composants, mais ne calcule pas à la place du processeur."
    ],
    anecdote: "Le format ATX a été défini par Intel en 1995. Ses évolutions (micro-ATX, mini-ITX…) sont toujours utilisées plus de trente ans plus tard dans les PC de bureau."
  },
  {
    id: "gpu",
    nom: "Carte graphique",
    abreviation: "GPU",
    signification: "Graphics Processing Unit (processeur graphique)",
    categorie: "calcul",
    resume: "Elle réalise les calculs nécessaires au traitement graphique.",
    role: "Calculer les images à afficher et accélérer les calculs graphiques (3D, vidéo), ainsi que certains calculs massivement parallèles.",
    explication: "Le processeur est excellent pour enchaîner des tâches variées. Le GPU, lui, contient un très grand nombre de petites unités de calcul qui travaillent en même temps : c'est idéal pour calculer des millions de pixels à chaque image. Selon le système, il peut être intégré au processeur ou fourni par une carte graphique dédiée.",
    fonctionnement: "Un GPU intégré partage la RAM du système. Une carte dédiée possède sa propre mémoire vidéo (VRAM) et se place généralement dans un emplacement PCI Express x16. Elle dispose de sorties vidéo (HDMI, DisplayPort), demande souvent un refroidissement important et, selon le modèle, des câbles d'alimentation supplémentaires.",
    exemple: "Dans un jeu en 3D, le GPU calcule les formes, la lumière et les textures de chaque image, de nombreuses fois par seconde.",
    importance: "Indispensable pour produire l'affichage (qu'il soit intégré ou dédié). Déterminante pour les jeux, la 3D, le montage vidéo et certains calculs scientifiques ou d'intelligence artificielle.",
    confusions: [
      "« GPU » désigne la puce de calcul ; la « carte graphique » est la carte complète qui l'accueille avec sa mémoire et son refroidissement.",
      "Un PC sans carte graphique dédiée peut afficher une image si son processeur intègre un GPU.",
      "Plus de VRAM ne signifie pas automatiquement plus de performances : la puissance du GPU compte aussi."
    ],
    anecdote: "Le terme « GPU » a été popularisé par NVIDIA en 1999, avec la GeForce 256."
  },
  {
    id: "ssd",
    nom: "Stockage SSD",
    abreviation: "SSD",
    signification: "Solid State Drive (unité de stockage à semi-conducteurs)",
    categorie: "stockage",
    resume: "Un SSD conserve les données sans alimentation électrique : système, applications et fichiers.",
    role: "Stocker durablement le système d'exploitation, les applications et les fichiers, avec un accès rapide.",
    explication: "Un SSD ressemble à une très grande clé USB rapide : il garde les données dans des puces de mémoire flash, sans pièce mobile, et les conserve même quand l'ordinateur est éteint.",
    fonctionnement: "Un contrôleur gère la lecture et l'écriture dans les puces de mémoire flash (NAND). Il existe des SSD au format 2,5 pouces (reliés en SATA) et au format M.2, qui s'enfichent directement sur la carte mère et utilisent le protocole SATA ou NVMe (souvent plus rapide). Chaque cellule supporte un nombre limité d'écritures, mais le contrôleur répartit l'usure.",
    exemple: "Installer le système d'exploitation sur un SSD permet généralement de démarrer l'ordinateur et d'ouvrir les logiciels bien plus vite qu'avec un disque dur classique.",
    importance: "Le stockage influence fortement la réactivité ressentie : démarrage, ouverture des logiciels, chargement des fichiers.",
    confusions: [
      "Un SSD n'est pas de la RAM : même éteint, il conserve les données.",
      "« M.2 » est un format, pas une vitesse : un SSD M.2 peut être SATA ou NVMe.",
      "Un SSD ne remplace pas une sauvegarde : en cas de panne ou de suppression, les données peuvent être perdues."
    ],
    anecdote: "Un SSD M.2 au format le plus courant mesure environ 8 cm de long sur 2 cm de large : à peu près la taille d'une plaquette de chewing-gum."
  },
  {
    id: "hdd",
    nom: "Disque dur",
    abreviation: "HDD",
    signification: "Hard Disk Drive",
    categorie: "stockage",
    resume: "Il stocke les données sur des plateaux magnétiques en rotation.",
    role: "Stocker de grandes quantités de données à un coût réduit par téraoctet.",
    explication: "Le disque dur ressemble à un tourne-disque : des plateaux tournent pendant qu'une tête de lecture/écriture se déplace au-dessus pour lire ou écrire les données, enregistrées sous forme magnétique.",
    fonctionnement: "Les plateaux tournent (souvent à 5 400 ou 7 200 tours par minute) et la tête se positionne au-dessus de la bonne zone. Ces déplacements physiques rendent le disque plus lent qu'un SSD et plus sensible aux chocs. Il se relie généralement en SATA et demande aussi un connecteur d'alimentation.",
    exemple: "Un disque dur de plusieurs téraoctets convient bien pour archiver des photos ou des vidéos que l'on consulte rarement.",
    importance: "Il reste utile pour le stockage de masse. Il est moins adapté pour installer le système d'exploitation si l'on recherche de la réactivité.",
    confusions: [
      "Un disque dur n'est pas de la mémoire vive, même si le mot « mémoire » est parfois utilisé pour le désigner.",
      "Un disque dur n'est pas indestructible : les chocs, surtout en fonctionnement, peuvent l'endommager.",
      "Stocker ses données sur un seul disque reste risqué : il faut prévoir une copie de sauvegarde."
    ],
    anecdote: "Le premier disque dur commercial, celui de la machine IBM RAMAC (1956), utilisait cinquante disques de 24 pouces et stockait environ 5 millions de caractères, soit moins de 4 Mo."
  },
  {
    id: "alimentation",
    nom: "Alimentation",
    abreviation: "PSU",
    signification: "Power Supply Unit (bloc d'alimentation)",
    categorie: "energie-froid",
    resume: "Elle convertit l'électricité du secteur en tensions continues adaptées aux composants du PC.",
    role: "Convertir le courant alternatif du secteur en tensions continues (par exemple 12 V, 5 V, 3,3 V) adaptées aux composants.",
    explication: "Les composants d'un PC ne se branchent pas directement sur une prise murale : ils demandent des tensions basses et stables. L'alimentation joue le rôle de « traducteur » entre le secteur et l'électronique.",
    fonctionnement: "Elle reçoit le courant alternatif du secteur, le convertit en courant continu et le distribue par plusieurs câbles : un connecteur principal vers la carte mère, un ou plusieurs connecteurs pour le processeur, des connecteurs PCIe pour la carte graphique et des connecteurs SATA pour le stockage. Sa puissance maximale s'exprime en watts. Une certification comme 80 PLUS renseigne sur son rendement énergétique.",
    exemple: "Un PC équipé d'une carte graphique puissante nécessite une alimentation de puissance suffisante, avec les connecteurs PCIe adaptés.",
    importance: "Une alimentation de qualité et correctement dimensionnée contribue à la stabilité et à la sécurité de tout le PC.",
    confusions: [
      "La puissance indiquée (en watts) est un maximum possible, pas la consommation permanente du PC.",
      "Une alimentation n'est pas une batterie : elle ne stocke pas d'énergie.",
      "Une alimentation ne s'ouvre pas : elle peut contenir des éléments dangereux, même une fois débranchée."
    ],
    anecdote: "Le rendement d'une alimentation varie avec la charge : il est généralement meilleur à charge moyenne que très faible ou proche du maximum."
  },
  {
    id: "refroidissement",
    nom: "Système de refroidissement",
    abreviation: "",
    signification: "Dissipateur, ventilateurs, pâte thermique",
    categorie: "energie-froid",
    resume: "Il évacue la chaleur produite par certains composants pour les maintenir dans une plage de fonctionnement appropriée.",
    role: "Évacuer la chaleur produite, surtout par le processeur et la carte graphique, afin de maintenir les températures dans une plage de fonctionnement appropriée.",
    explication: "Tout composant électronique qui travaille produit de la chaleur. Le refroidissement la conduit vers un radiateur, puis l'air la disperse : c'est le principe du radiateur d'une voiture ou du ventilateur d'un four.",
    fonctionnement: "Dans un refroidissement à air, une pâte thermique améliore le contact entre le processeur et la base du dissipateur. La chaleur circule ensuite vers des ailettes métalliques, sur lesquelles un ventilateur envoie de l'air. Il existe aussi des systèmes à circuit d'eau fermé (AIO). Les ventilateurs du boîtier renouvellent l'air pour évacuer la chaleur hors du PC.",
    exemple: "Quand un jeu sollicite fortement le processeur, sa température monte et les ventilateurs accélèrent. Si le dissipateur est encrassé, le processeur peut réduire sa fréquence pour se protéger.",
    importance: "Un bon refroidissement limite les ralentissements dus à la chaleur, les arrêts intempestifs et le bruit, et protège les composants.",
    confusions: [
      "Plus de pâte thermique n'est pas mieux : une couche fine et régulière suffit.",
      "Le refroidissement liquide n'est pas automatiquement meilleur : tout dépend du modèle et du boîtier.",
      "Un ventilateur bruyant ne signifie pas toujours que le PC est en panne : il peut simplement réagir à une charge élevée ou à de la poussière."
    ],
    anecdote: "Un processeur qui surchauffe réduit automatiquement sa fréquence pour se protéger : ce mécanisme s'appelle le « thermal throttling » (bridage thermique)."
  },
  {
    id: "reseau",
    nom: "Carte réseau",
    abreviation: "NIC",
    signification: "Network Interface Controller",
    categorie: "connectivite",
    resume: "Elle permet à l'ordinateur de communiquer avec un réseau, filaire (Ethernet) ou sans fil (Wi-Fi).",
    role: "Permettre à l'ordinateur d'échanger des données avec un réseau local ou avec Internet.",
    explication: "La carte réseau est la « porte » de l'ordinateur vers le réseau : elle transforme les données du PC en signaux adaptés au câble ou aux ondes radio, et inversement.",
    fonctionnement: "Sur la plupart des cartes mères, un contrôleur Ethernet est déjà intégré, avec son port RJ45 à l'arrière. Le Wi-Fi peut être intégré, ou ajouté sous forme de carte (PCIe ou M.2) ou de clé USB. Chaque interface possède une adresse physique unique, l'adresse MAC. Pour accéder à Internet, il faut aussi une box ou un routeur et un abonnement.",
    exemple: "Brancher un câble Ethernet entre le PC et la box Internet crée une connexion filaire, souvent plus stable que le Wi-Fi.",
    importance: "Sans interface réseau, le PC ne peut ni accéder à Internet ni échanger de fichiers avec d'autres appareils, sauf avec un support amovible.",
    confusions: [
      "La carte réseau n'est pas la connexion Internet : il faut aussi une box ou un routeur et un abonnement.",
      "Le débit réel ne dépend pas que de la carte : le routeur, l'abonnement, la distance (en Wi-Fi) et le site distant jouent aussi.",
      "Beaucoup de PC n'ont pas besoin d'une carte réseau séparée : elle est souvent intégrée à la carte mère."
    ],
    anecdote: "Le réseau Ethernet a été conçu dans les années 1970 au centre de recherche Xerox PARC, par une équipe où figurait Robert Metcalfe."
  },
  {
    id: "boitier",
    nom: "Boîtier",
    abreviation: "",
    signification: "Tour, châssis",
    categorie: "structure",
    resume: "Il accueille et protège les composants, contribue à leur organisation et participe à la circulation de l'air.",
    role: "Accueillir, maintenir et protéger les composants, et organiser la circulation de l'air.",
    explication: "Le boîtier est le « squelette » du PC : il fixe les composants, protège l'électronique et guide l'air frais vers les zones qui chauffent.",
    fonctionnement: "Il comporte un châssis métallique ou plastique avec des points de fixation pour la carte mère, des baies pour le stockage, une place pour l'alimentation et des emplacements pour des ventilateurs. La façade offre souvent un bouton d'alimentation et des ports USB. Chaque boîtier accepte certains formats de cartes mères (ATX, micro-ATX, mini-ITX) et limite la taille des cartes graphiques et des dissipateurs.",
    exemple: "Un boîtier mini-ITX compact convient à un petit PC de salon. Un boîtier ATX, plus grand, laisse plus de place et d'air, mais encombre davantage.",
    importance: "Il détermine la taille des composants utilisables, la facilité de montage, la ventilation et le niveau sonore.",
    confusions: [
      "Dans le langage courant, on dit parfois « l'ordinateur » pour la tour, mais le boîtier n'est qu'une partie de la machine : sans composants, il ne fait rien.",
      "Un boîtier fermé ou rempli de câbles en désordre peut gêner la circulation de l'air.",
      "Un plus grand boîtier ne refroidit pas mieux automatiquement : l'agencement des flux d'air compte."
    ],
    anecdote: "Beaucoup de boîtiers ont des filtres à poussière amovibles : les nettoyer régulièrement aide à garder le PC au frais."
  }
];
