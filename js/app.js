/*
 * EITT Hardware Quest — logique de l'application (JavaScript vanilla, sans dépendance).
 *
 * Organisation du fichier :
 *   1. Outils (création de DOM, normalisation, mélange)
 *   2. Progression locale et récompenses
 *   3. Composants d'interface partagés (liste des composants, fiches)
 *   4. Vues : accueil, explorer, apprendre, quiz, assembler, diagnostic, progression
 *   5. Routeur et initialisation
 *
 * Les données pédagogiques sont dans data/*.js, les illustrations SVG dans js/lab-svg.js.
 */
(function () {
  "use strict";

  const DATA = window.EITT_DATA;
  const ART = window.EITT_SVG;

  if (!DATA || !ART || !DATA.composants || !DATA.quiz || !DATA.assemblage || !DATA.diagnostics) {
    const main = document.getElementById("main");
    if (main) {
      main.textContent = "Les données de l'application n'ont pas pu être chargées. Vérifiez que le dossier data/ est présent, puis rechargez la page.";
    }
    return;
  }

  const COMPONENTS = DATA.composants;
  const STORAGE_KEY = "eitt-hardware-quest:v1";

  /* ======================================================================= */
  /*  1. Outils                                                              */
  /* ======================================================================= */

  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));

  /** Crée un élément DOM. Les textes passent par textContent (pas d'injection HTML). */
  function h(tag, attrs, ...children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((key) => {
        const value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === "class") node.className = value;
        else if (key === "text") node.textContent = value;
        else if (key === "html") node.innerHTML = value; // réservé aux illustrations SVG statiques du projet
        else if (key.indexOf("on") === 0 && typeof value === "function") node.addEventListener(key.slice(2).toLowerCase(), value);
        else if (value === true) node.setAttribute(key, "");
        else node.setAttribute(key, String(value));
      });
    }
    appendChildren(node, children);
    return node;
  }

  function appendChildren(node, children) {
    children.flat(Infinity).forEach((child) => {
      if (child === null || child === undefined || child === false) return;
      node.append(child.nodeType ? child : document.createTextNode(String(child)));
    });
  }

  /** Remplace le contenu d'un nœud ; ignore les valeurs null/false (contrairement à replaceChildren natif). */
  function replaceContent(node, ...children) {
    node.replaceChildren();
    appendChildren(node, children);
  }

  const normalize = (text) => String(text).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  const findComponent = (id) => COMPONENTS.find((component) => component.id === id) || null;
  const categoryName = (id) => (DATA.categories.find((category) => category.id === id) || { nom: id }).nom;
  const fullName = (component) => component.nom + (component.abreviation ? " (" + component.abreviation + ")" : "");
  const plural = (count, singular, pluralForm) => (count > 1 ? pluralForm : singular);

  function isSheetMode() {
    return typeof window.matchMedia === "function" && window.matchMedia("(max-width: 999px)").matches;
  }

  /** Annonce un message aux lecteurs d'écran (zone live visuellement masquée). */
  function announce(message) {
    const region = $("#sr-status");
    if (!region) return;
    region.textContent = "";
    window.setTimeout(() => { region.textContent = message; }, 40);
  }

  function showToast(title, message) {
    const region = $("#toast-region");
    if (!region) return;
    const toast = h("div", { class: "toast" },
      h("div", { class: "toast-body" }, h("strong", { text: title }), h("span", { text: message })),
      h("button", { type: "button", class: "toast-close", "aria-label": "Fermer la notification", onClick: () => toast.remove() }, "×"));
    region.append(toast);
    window.setTimeout(() => toast.remove(), 9000);
  }

  /* ======================================================================= */
  /*  2. Progression locale et récompenses                                   */
  /* ======================================================================= */

  const state = {
    progress: null,
    awardsKnown: [],
    storageAvailable: true,
    explorer: { selectedId: null, query: "", category: "all" },
    learn: { selectedId: null, query: "", category: "all" },
    quiz: null,
    assembly: null,
    diagnostic: { currentId: null, picked: {}, solutionShown: false }
  };

  function defaultProgress() {
    return { discovered: [], quizzes: {}, assembly: [], diagnostics: [], lastQuiz: null };
  }

  const toCount = (value) => (Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0);

  function sanitizeProgress(raw) {
    const progress = defaultProgress();
    if (!raw || typeof raw !== "object") return progress;
    const keepKnown = (list, known) => (Array.isArray(list)
      ? Array.from(new Set(list.filter((id) => known.indexOf(id) !== -1)))
      : []);
    progress.discovered = keepKnown(raw.discovered, COMPONENTS.map((c) => c.id));
    progress.assembly = keepKnown(raw.assembly, DATA.assemblage.pieces.map((p) => p.id));
    progress.diagnostics = keepKnown(raw.diagnostics, DATA.diagnostics.map((d) => d.id));
    DATA.quiz.niveaux.forEach((level) => {
      const entry = raw.quizzes && raw.quizzes[level.id];
      if (entry && typeof entry === "object") {
        progress.quizzes[level.id] = {
          termines: toCount(entry.termines),
          dernier: toCount(entry.dernier),
          meilleur: toCount(entry.meilleur),
          total: toCount(entry.total) || 10
        };
      }
    });
    const last = raw.lastQuiz;
    if (last && typeof last === "object" && DATA.quiz.niveaux.some((l) => l.id === last.niveau)) {
      progress.lastQuiz = { niveau: last.niveau, score: toCount(last.score), total: toCount(last.total) || 10, date: String(last.date || "") };
    }
    return progress;
  }

  function loadProgress() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? sanitizeProgress(JSON.parse(stored)) : defaultProgress();
    } catch (error) {
      state.storageAvailable = false;
      return defaultProgress();
    }
  }

  function persistProgress() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
    } catch (error) {
      state.storageAvailable = false;
    }
  }

  const levelsDone = (progress) => DATA.quiz.niveaux.filter((level) => progress.quizzes[level.id] && progress.quizzes[level.id].termines > 0).length;
  const quizzesDone = (progress) => Object.keys(progress.quizzes).reduce((sum, key) => sum + progress.quizzes[key].termines, 0);

  /** Pourcentage global : moyenne de quatre axes à poids égal (25 % chacun). */
  function computeProgressPercent(progress) {
    const ratios = [
      progress.discovered.length / COMPONENTS.length,
      levelsDone(progress) / DATA.quiz.niveaux.length,
      progress.assembly.length / DATA.assemblage.pieces.length,
      progress.diagnostics.length / DATA.diagnostics.length
    ];
    return Math.round((ratios.reduce((a, b) => a + b, 0) / ratios.length) * 100);
  }

  const AWARDS = [
    {
      id: "explorateur",
      nom: "Explorateur du matériel",
      critere: "Consulter les " + COMPONENTS.length + " fiches de composants.",
      test: (progress) => progress.discovered.length >= COMPONENTS.length
    },
    {
      id: "detective",
      nom: "Détective des composants",
      critere: "Obtenir au moins 7 bonnes réponses sur 10 à un quiz.",
      test: (progress) => Object.keys(progress.quizzes).some((key) => {
        const entry = progress.quizzes[key];
        return entry.total > 0 && entry.meilleur / entry.total >= 0.7;
      })
    },
    {
      id: "architecte",
      nom: "Architecte débutant",
      critere: "Placer correctement les " + DATA.assemblage.pieces.length + " éléments de l'exercice d'assemblage.",
      test: (progress) => progress.assembly.length >= DATA.assemblage.pieces.length
    },
    {
      id: "technicien",
      nom: "Technicien de diagnostic",
      critere: "Trouver une bonne démarche pour chacun des " + DATA.diagnostics.length + " scénarios de diagnostic.",
      test: (progress) => progress.diagnostics.length >= DATA.diagnostics.length
    }
  ];

  const earnedAwardIds = () => AWARDS.filter((award) => award.test(state.progress)).map((award) => award.id);

  function updateHeaderProgress() {
    const chip = $("#header-progress");
    if (chip) chip.textContent = "Progression : " + computeProgressPercent(state.progress) + " %";
  }

  function saveProgress() {
    persistProgress();
    updateHeaderProgress();
    const earned = earnedAwardIds();
    earned.filter((id) => state.awardsKnown.indexOf(id) === -1).forEach((id) => {
      const award = AWARDS.find((item) => item.id === id);
      showToast("Récompense obtenue : " + award.nom, award.critere);
      announce("Récompense obtenue : " + award.nom);
    });
    state.awardsKnown = earned;
  }

  function markDiscovered(componentId) {
    if (state.progress.discovered.indexOf(componentId) === -1) {
      state.progress.discovered.push(componentId);
      saveProgress();
    }
  }

  function recordQuizResult(levelId, score, total) {
    const entry = state.progress.quizzes[levelId] || { termines: 0, dernier: 0, meilleur: 0, total: total };
    entry.termines += 1;
    entry.dernier = score;
    entry.meilleur = Math.max(entry.meilleur, score);
    entry.total = total;
    state.progress.quizzes[levelId] = entry;
    state.progress.lastQuiz = { niveau: levelId, score: score, total: total, date: new Date().toISOString() };
    saveProgress();
  }

  function recordAssemblySuccess(pieceId) {
    if (state.progress.assembly.indexOf(pieceId) === -1) {
      state.progress.assembly.push(pieceId);
      saveProgress();
    }
  }

  function recordDiagnosticSuccess(scenarioId) {
    if (state.progress.diagnostics.indexOf(scenarioId) === -1) {
      state.progress.diagnostics.push(scenarioId);
      saveProgress();
    }
  }

  /* ======================================================================= */
  /*  3. Composants d'interface partagés                                     */
  /* ======================================================================= */

  function badge(text, extraClass) {
    return h("span", { class: "badge" + (extraClass ? " " + extraClass : ""), text: text });
  }

  function ficheSection(title, content) {
    return h("section", { class: "fiche-section" },
      h("h3", { text: title }),
      Array.isArray(content) ? h("ul", null, content.map((item) => h("li", { text: item }))) : h("p", { text: content }));
  }

  function filterComponents(browserState) {
    const query = normalize(browserState.query.trim());
    return COMPONENTS.filter((component) => {
      const inCategory = browserState.category === "all" || component.categorie === browserState.category;
      const searchable = normalize([component.nom, component.abreviation, component.signification].join(" "));
      return inCategory && (!query || searchable.indexOf(query) !== -1);
    });
  }

  /** Identifiant du composant voisin (précédent/suivant), en respectant le filtre en cours. */
  function neighborId(browserState, offset) {
    const filtered = filterComponents(browserState);
    const list = filtered.some((c) => c.id === browserState.selectedId) ? filtered : COMPONENTS;
    const index = Math.max(0, list.findIndex((c) => c.id === browserState.selectedId));
    return list[(index + offset + list.length) % list.length].id;
  }

  function componentButton(component, selected, onSelect) {
    const seen = state.progress.discovered.indexOf(component.id) !== -1;
    return h("button", {
      type: "button",
      class: "component-item" + (selected ? " is-selected" : ""),
      "data-id": component.id,
      "aria-current": selected ? "true" : null,
      onClick: () => onSelect(component.id)
    },
    h("span", { class: "component-item-icon", html: ART.icon(component.id) }),
    h("span", { class: "component-item-text" },
      h("span", { class: "component-item-name", text: component.nom }),
      h("span", { class: "component-item-meta", text: component.abreviation || categoryName(component.categorie) })),
    h("span", { class: "seen-mark" + (seen ? " is-seen" : "") },
      h("span", { "aria-hidden": "true", text: seen ? "✓" : "" }),
      h("span", { class: "sr-only", text: seen ? "Déjà consulté" : "Pas encore consulté" })));
  }

  /** Liste de composants avec recherche par nom et filtre par catégorie (partagée par Explorer et Apprendre). */
  function createBrowser(browserState, idPrefix, onSelect) {
    const searchInput = h("input", {
      id: idPrefix + "-search",
      type: "search",
      class: "field",
      placeholder: "Ex. : RAM, SSD, alimentation…",
      autocomplete: "off",
      onInput: (event) => { browserState.query = event.target.value; refresh(); }
    });
    const categorySelect = h("select", {
      id: idPrefix + "-category",
      class: "field",
      onChange: (event) => { browserState.category = event.target.value; refresh(); }
    },
    h("option", { value: "all", text: "Toutes les catégories" }),
    DATA.categories.map((category) => h("option", { value: category.id, text: category.nom })));

    const counter = h("p", { class: "browser-counter", "aria-live": "polite" });
    const list = h("ul", { id: idPrefix + "-list", class: "component-list" });
    const empty = h("div", { class: "empty-state", hidden: true },
      h("p", { text: "Aucun composant ne correspond à cette recherche." }),
      h("button", { type: "button", class: "btn btn-ghost", onClick: resetFilters }, "Réinitialiser la recherche"));

    function resetFilters() {
      browserState.query = "";
      browserState.category = "all";
      searchInput.value = "";
      categorySelect.value = "all";
      refresh();
      searchInput.focus();
    }

    function refresh() {
      const filtered = filterComponents(browserState);
      list.replaceChildren(...filtered.map((component) =>
        h("li", null, componentButton(component, component.id === browserState.selectedId, onSelect))));
      empty.hidden = filtered.length > 0;
      const seenCount = state.progress.discovered.length;
      counter.textContent = filtered.length + " " + plural(filtered.length, "composant affiché", "composants affichés") +
        " · Consultés : " + seenCount + "/" + COMPONENTS.length;
    }

    searchInput.value = browserState.query;
    categorySelect.value = browserState.category;

    const element = h("div", { class: "browser" },
      h("label", { class: "field-label", for: idPrefix + "-search", text: "Rechercher un composant" }),
      searchInput,
      h("label", { class: "field-label", for: idPrefix + "-category", text: "Filtrer par catégorie" }),
      categorySelect,
      counter,
      list,
      empty);

    refresh();
    return { element: element, refresh: refresh };
  }

  /* ======================================================================= */
  /*  4. Vues                                                                */
  /* ======================================================================= */

  /* ------------------------------- Accueil -------------------------------- */
  function renderHome(main) {
    const shortcut = (href, title, text, cta, iconId) => h("a", { class: "card shortcut", href: href },
      h("span", { class: "shortcut-icon", html: ART.icon(iconId) }),
      h("span", { class: "shortcut-title", text: title }),
      h("span", { class: "shortcut-text", text: text }),
      h("span", { class: "shortcut-cta", "aria-hidden": "true", text: cta + " →" }));

    const skills = [
      "Nommer et situer les principaux composants d'un ordinateur de bureau.",
      "Expliquer le rôle du processeur, de la mémoire, du stockage, de la carte graphique, de l'alimentation et du refroidissement.",
      "Distinguer des notions souvent confondues : RAM et stockage, CPU et GPU, SSD et disque dur.",
      "Repérer les contraintes de compatibilité : socket, type de RAM, emplacement M.2, format de carte mère et de boîtier.",
      "Raisonner pas à pas face à une panne simple, en respectant les règles de sécurité."
    ];

    main.append(
      h("section", { class: "hero container" },
        h("div", { class: "hero-copy" },
          h("p", { class: "eyebrow", text: "EITT — Enseignement Informatique pour Toutes et Tous" }),
          h("h1", { text: "EITT Hardware Quest" }),
          h("p", { class: "slogan", text: "« Explorez les composants. Comprenez la machine. Maîtrisez l'informatique. »" }),
          h("p", { class: "lead", text: "Un laboratoire interactif pour découvrir de quoi est fait un ordinateur : ouvrez le PC en vue éclatée, cliquez sur chaque composant pour comprendre son rôle, testez vos connaissances et entraînez-vous à l'assemblage. Aucune connaissance préalable n'est nécessaire." }),
          h("p", { class: "duration" },
            h("strong", { text: "Durée approximative : " }),
            "10 à 15 minutes pour un premier tour (explorer, puis un quiz), jusqu'à 45 minutes pour tout parcourir."),
          h("div", { class: "hero-actions" },
            h("a", { class: "btn btn-primary btn-large", href: "#/explorer" }, "Entrer dans le laboratoire"),
            h("a", { class: "btn btn-ghost btn-large", href: "#/quiz" }, "Tester mes connaissances"))),
        h("div", { class: "hero-art", html: ART.lab(false) })),

      h("section", { class: "container home-section", "aria-labelledby": "shortcuts-title" },
        h("h2", { id: "shortcuts-title", text: "Choisissez votre parcours" }),
        h("div", { class: "card-grid shortcut-grid" },
          shortcut("#/explorer", "Explorer", "Cliquez sur les composants d'un PC en vue éclatée et découvrez leur rôle.", "Explorer", "carte-mere"),
          shortcut("#/quiz", "Quiz", "30 questions sur trois niveaux, avec correction et explication à chaque réponse.", "Jouer", "cpu"),
          shortcut("#/assembler", "Assembler", "Associez chaque élément à son emplacement sur une carte mère schématique.", "S'entraîner", "ram"),
          shortcut("#/apprendre", "Apprendre", "Consultez des fiches détaillées : fonctionnement, exemples, confusions fréquentes.", "Lire les fiches", "ssd"),
          shortcut("#/diagnostic", "Diagnostic", "Résolvez des pannes fictives en choisissant une démarche de diagnostic.", "Enquêter", "refroidissement"))),

      h("section", { class: "container home-section", "aria-labelledby": "skills-title" },
        h("div", { class: "panel skills-panel" },
          h("h2", { id: "skills-title", text: "Ce que vous saurez faire" }),
          h("ul", { class: "check-list" }, skills.map((skill) => h("li", { text: skill }))),
          h("p", { class: "muted", text: "Votre progression est enregistrée uniquement sur cet appareil, sans compte. Elle peut être perdue si vous effacez les données de votre navigateur." }))));
  }

  /* ------------------------------- Explorer ------------------------------- */
  function renderExplorer(main, param) {
    const explorer = state.explorer;
    explorer.selectedId = null;
    explorer.query = "";
    explorer.category = "all";

    const browser = createBrowser(explorer, "explorer", (id) => selectComponent(id));
    const labWrap = h("div", { class: "lab-scroll", html: ART.lab(true) });
    const svg = $("svg", labWrap);
    const panel = h("aside", { class: "panel fiche-panel", id: "fiche-panel", "aria-label": "Fiche du composant sélectionné" });

    const root = h("section", { class: "view explorer-view container" },
      h("header", { class: "view-head" },
        h("h1", { text: "Explorer le laboratoire" }),
        h("p", { class: "lead", text: "Voici un ordinateur de bureau en vue éclatée : chaque composant est écarté des autres pour que vous puissiez le repérer. Cliquez sur un composant, ou choisissez-le dans la liste, pour lire sa fiche." })),
      h("div", { class: "explorer-grid" },
        h("section", { class: "panel lab-panel", "aria-labelledby": "lab-title" },
          h("div", { class: "lab-head" },
            h("h2", { id: "lab-title", class: "panel-title", text: "Vue éclatée du PC" }),
            h("button", { type: "button", class: "btn btn-ghost", onClick: clearSelection }, "Vue générale")),
          h("p", { class: "scroll-hint muted", text: "Sur petit écran, faites glisser le schéma horizontalement. La liste des composants se trouve sous le schéma." }),
          labWrap),
        h("section", { class: "panel list-panel", "aria-labelledby": "explorer-list-title" },
          h("h2", { id: "explorer-list-title", class: "panel-title", text: "Composants" }),
          browser.element),
        panel));

    function updateSvgSelection() {
      svg.classList.toggle("has-selection", Boolean(explorer.selectedId));
      $$(".part", svg).forEach((part) => {
        const selected = part.getAttribute("data-part") === explorer.selectedId;
        part.classList.toggle("is-selected", selected);
        part.setAttribute("aria-pressed", String(selected));
      });
    }

    function renderPanel() {
      const component = findComponent(explorer.selectedId);
      panel.classList.toggle("is-open", Boolean(component));
      panel.replaceChildren();

      if (!component) {
        panel.append(h("div", { class: "fiche-placeholder" },
          h("h2", { class: "fiche-title", text: "Vue générale" }),
          h("p", { text: "Aucun composant sélectionné. Cliquez sur un élément du schéma ou choisissez-le dans la liste pour afficher sa fiche." }),
          h("p", { class: "muted", text: "Astuce clavier : utilisez Tab pour passer d'un composant à l'autre, puis Entrée pour ouvrir sa fiche." })));
        return;
      }

      panel.append(
        h("div", { class: "fiche-head" },
          h("span", { class: "fiche-icon", html: ART.icon(component.id) }),
          h("div", { class: "fiche-head-text" },
            h("h2", { class: "fiche-title", id: "fiche-title", tabindex: "-1", text: fullName(component) }),
            h("div", { class: "badge-row" }, badge(categoryName(component.categorie)))),
          h("button", { type: "button", class: "btn-icon", "aria-label": "Fermer la fiche et revenir à la vue générale", onClick: clearSelection }, "×")),
        h("p", { class: "fiche-lead", text: component.resume }),
        ficheSection("Rôle principal", component.role),
        ficheSection("Explication simple", component.explication),
        ficheSection("Exemple concret", component.exemple),
        h("div", { class: "fiche-actions" },
          h("button", { type: "button", class: "btn btn-ghost", onClick: () => selectComponent(neighborId(explorer, -1)) }, "← Précédent"),
          h("button", { type: "button", class: "btn btn-ghost", onClick: () => selectComponent(neighborId(explorer, 1)) }, "Suivant →")),
        h("a", { class: "btn btn-primary btn-block", href: "#/apprendre/" + component.id }, "Lire la fiche détaillée"));
    }

    function selectComponent(id) {
      const component = findComponent(id);
      if (!component) return;
      explorer.selectedId = id;
      markDiscovered(id);
      browser.refresh();
      updateSvgSelection();
      renderPanel();
      announce(fullName(component) + " sélectionné. Fiche affichée.");
      if (isSheetMode()) {
        const title = $("#fiche-title", panel);
        if (title) title.focus({ preventScroll: true });
      }
    }

    function clearSelection() {
      const previous = explorer.selectedId;
      explorer.selectedId = null;
      browser.refresh();
      updateSvgSelection();
      renderPanel();
      announce("Retour à la vue générale.");
      if (previous) {
        const part = $('[data-part="' + previous + '"]', svg);
        if (part) part.focus({ preventScroll: true });
      }
    }

    svg.addEventListener("click", (event) => {
      const part = event.target.closest("[data-part]");
      if (part) selectComponent(part.getAttribute("data-part"));
    });
    svg.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const part = event.target.closest("[data-part]");
      if (!part) return;
      event.preventDefault();
      selectComponent(part.getAttribute("data-part"));
    });
    root.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && explorer.selectedId) clearSelection();
    });

    main.append(root);
    updateSvgSelection();
    renderPanel();
    if (param && findComponent(param)) selectComponent(param);
  }

  /* ------------------------------- Apprendre ------------------------------ */
  function renderLearn(main, param) {
    const learn = state.learn;
    learn.query = "";
    learn.category = "all";
    learn.selectedId = param && findComponent(param) ? param : COMPONENTS[0].id;

    const browser = createBrowser(learn, "learn", (id) => showFiche(id, true));
    const article = h("article", { class: "panel fiche-full", "aria-label": "Fiche pédagogique détaillée" });

    const root = h("section", { class: "view learn-view container" },
      h("header", { class: "view-head" },
        h("h1", { text: "Apprendre : les fiches des composants" }),
        h("p", { class: "lead", text: "Chaque fiche explique le rôle du composant, son fonctionnement, un exemple concret et les confusions les plus fréquentes. Les explications sont volontairement simples : elles donnent les repères essentiels." })),
      h("div", { class: "learn-grid" },
        h("section", { class: "panel list-panel", "aria-labelledby": "learn-list-title" },
          h("h2", { id: "learn-list-title", class: "panel-title", text: "Composants" }),
          browser.element),
        article));

    function buildFiche(component) {
      return [
        h("header", { class: "fiche-head fiche-head-large" },
          h("span", { class: "fiche-icon", html: ART.icon(component.id) }),
          h("div", { class: "fiche-head-text" },
            h("h2", { class: "fiche-title", id: "learn-fiche-title", tabindex: "-1", text: fullName(component) }),
            h("div", { class: "badge-row" }, badge(categoryName(component.categorie)), badge(component.signification, "badge-soft")))),
        h("p", { class: "fiche-lead", text: component.resume }),
        ficheSection("Rôle principal", component.role),
        ficheSection("En termes simples", component.explication),
        ficheSection("Comment ça fonctionne", component.fonctionnement),
        ficheSection("Exemple concret", component.exemple),
        ficheSection("Pourquoi c'est important", component.importance),
        ficheSection("Erreurs et confusions fréquentes", component.confusions),
        h("aside", { class: "anecdote" }, h("h3", { text: "Le saviez-vous ?" }), h("p", { text: component.anecdote })),
        h("div", { class: "fiche-actions" },
          h("button", { type: "button", class: "btn btn-ghost", onClick: () => showFiche(neighborId(learn, -1), true) }, "← Précédent"),
          h("button", { type: "button", class: "btn btn-ghost", onClick: () => showFiche(neighborId(learn, 1), true) }, "Suivant →")),
        h("div", { class: "fiche-links" },
          h("a", { class: "btn btn-primary", href: "#/explorer/" + component.id }, "Voir dans le laboratoire"),
          h("a", { class: "btn btn-ghost", href: "#/quiz" }, "Tester mes connaissances"))
      ];
    }

    function showFiche(id, moveFocus) {
      const component = findComponent(id);
      if (!component) return;
      learn.selectedId = id;
      markDiscovered(id);
      browser.refresh();
      article.replaceChildren(...buildFiche(component));
      if (moveFocus) {
        const title = $("#learn-fiche-title", article);
        if (title) title.focus({ preventScroll: !isSheetMode() });
        if (isSheetMode() && typeof article.scrollIntoView === "function") article.scrollIntoView({ block: "start" });
        announce("Fiche affichée : " + fullName(component) + ".");
      }
    }

    main.append(root);
    showFiche(learn.selectedId, false);
  }

  /* --------------------------------- Quiz --------------------------------- */
  let quizHost = null;

  function renderQuiz(main) {
    quizHost = h("section", { class: "view quiz-view container" });
    main.append(quizHost);
    drawQuiz(false);
  }

  function startQuiz(levelId) {
    const pool = DATA.quiz.questions.filter((question) => question.niveau === levelId);
    const questions = shuffle(pool).map((question) => ({
      id: question.id,
      texte: question.question,
      explication: question.explication,
      composant: question.composant,
      options: shuffle(question.options.map((text, index) => ({ text: text, correct: index === question.reponse })))
    }));
    state.quiz = { phase: "question", levelId: levelId, questions: questions, index: 0, score: 0, answers: [], validated: false, selected: null };
    drawQuiz(true);
  }

  function drawQuiz(moveFocus) {
    if (!quizHost) return;
    const quiz = state.quiz;
    quizHost.replaceChildren();
    if (!quiz || quiz.phase === "menu") quizHost.append(buildQuizMenu());
    else if (quiz.phase === "question") quizHost.append(buildQuizQuestion(quiz));
    else quizHost.append(buildQuizResults(quiz));
    if (moveFocus) {
      const target = $("[data-autofocus]", quizHost);
      if (target) target.focus({ preventScroll: false });
    }
  }

  function levelById(levelId) {
    return DATA.quiz.niveaux.find((level) => level.id === levelId);
  }

  function buildQuizMenu() {
    const cards = DATA.quiz.niveaux.map((level) => {
      const count = DATA.quiz.questions.filter((question) => question.niveau === level.id).length;
      const entry = state.progress.quizzes[level.id];
      return h("article", { class: "card level-card" },
        h("p", { class: "level-number", text: "Niveau " + level.id }),
        h("h2", { text: level.titre }),
        h("p", { text: level.description }),
        h("p", { class: "muted", text: count + " questions" + (entry ? " · Meilleur score : " + entry.meilleur + "/" + entry.total : "") }),
        h("button", { type: "button", class: "btn btn-primary", onClick: () => startQuiz(level.id) },
          entry ? "Rejouer le niveau " + level.id : "Commencer le niveau " + level.id));
    });
    return h("div", null,
      h("header", { class: "view-head" },
        h("h1", { text: "Quiz du matériel informatique", tabindex: "-1", "data-autofocus": "true" }),
        h("p", { class: "lead", text: "Choisissez un niveau. Les questions et les réponses sont mélangées à chaque partie. Aucune erreur n'est pénalisée : après chaque réponse, une explication vous aide à comprendre." })),
      h("div", { class: "card-grid level-grid" }, cards),
      h("p", { class: "muted", text: "Le score est un repère personnel pour apprendre, pas une certification officielle." }));
  }

  function buildQuizQuestion(quiz) {
    const total = quiz.questions.length;
    const question = quiz.questions[quiz.index];
    const level = levelById(quiz.levelId);

    const feedback = h("div", { class: "feedback", role: "status", "aria-live": "polite", tabindex: "-1" });
    const scoreLabel = h("p", { class: "quiz-score" });
    const updateScore = () => {
      scoreLabel.textContent = "Score : " + quiz.score + " / " + (quiz.validated ? quiz.index + 1 : quiz.index);
    };
    const validateButton = h("button", { type: "button", class: "btn btn-primary", disabled: true, onClick: validate }, "Valider ma réponse");
    const nextButton = h("button", { type: "button", class: "btn btn-primary", hidden: true, onClick: next },
      quiz.index === total - 1 ? "Voir mes résultats" : "Question suivante →");

    const options = h("fieldset", { class: "options" },
      h("legend", { class: "question-text", text: question.texte }),
      question.options.map((option, index) => h("label", { class: "option", for: "quiz-option-" + index, "data-index": index },
        h("input", {
          type: "radio",
          name: "quiz-option",
          id: "quiz-option-" + index,
          value: index,
          onChange: () => {
            quiz.selected = index;
            validateButton.disabled = false;
            $$(".option", options).forEach((label) => label.classList.toggle("is-selected", Number(label.getAttribute("data-index")) === index));
          }
        }),
        h("span", { class: "option-mark", "aria-hidden": "true" }),
        h("span", { class: "option-text", text: option.text }),
        h("span", { class: "option-flag" }))));

    function validate() {
      if (quiz.selected === null || quiz.validated) {
        if (quiz.selected === null) feedback.textContent = "Choisissez une réponse avant de valider.";
        return;
      }
      const chosen = question.options[quiz.selected];
      const good = chosen.correct;
      const correctOption = question.options.find((option) => option.correct);
      quiz.validated = true;
      if (good) quiz.score += 1;
      quiz.answers.push({ question: question, chosenText: chosen.text, correctText: correctOption.text, correct: good });

      options.disabled = true;
      $$(".option", options).forEach((label) => {
        const option = question.options[Number(label.getAttribute("data-index"))];
        const flag = $(".option-flag", label);
        if (option.correct) {
          label.classList.add("is-correct");
          flag.textContent = "✔ Bonne réponse";
        } else if (Number(label.getAttribute("data-index")) === quiz.selected) {
          label.classList.add("is-wrong");
          flag.textContent = "✖ Votre réponse";
        }
      });

      const linked = findComponent(question.composant);
      replaceContent(feedback, 
        h("p", { class: "feedback-title " + (good ? "is-correct" : "is-wrong"), text: good ? "✔ Bonne réponse !" : "✖ Pas tout à fait." }),
        good ? null : h("p", null, "La bonne réponse était : ", h("strong", { text: correctOption.text })),
        h("p", { text: question.explication }),
        linked ? h("p", null, h("a", { href: "#/apprendre/" + linked.id }, "Revoir la fiche : " + fullName(linked))) : null);
      validateButton.hidden = true;
      nextButton.hidden = false;
      updateProgressBar();
      updateScore();
      feedback.focus({ preventScroll: false });
    }

    function next() {
      quiz.index += 1;
      quiz.validated = false;
      quiz.selected = null;
      if (quiz.index >= total) {
        quiz.phase = "results";
        recordQuizResult(quiz.levelId, quiz.score, total);
        drawQuiz(true);
      } else {
        drawQuiz(true);
      }
    }

    const fill = h("div", { class: "progressbar-fill" });
    const bar = h("div", { class: "progressbar", role: "progressbar", "aria-label": "Progression du quiz", "aria-valuemin": "0", "aria-valuemax": total }, fill);
    function updateProgressBar() {
      const done = quiz.validated ? quiz.index + 1 : quiz.index;
      bar.setAttribute("aria-valuenow", done);
      bar.setAttribute("aria-valuetext", done + " question" + (done > 1 ? "s" : "") + " sur " + total);
      fill.setAttribute("style", "width:" + Math.round((done / total) * 100) + "%");
    }
    updateProgressBar();
    updateScore();

    return h("div", { class: "quiz-card panel" },
      h("div", { class: "quiz-top" },
        h("p", { class: "level-number", text: "Niveau " + level.id + " — " + level.titre }),
        scoreLabel),
      bar,
      h("h2", { class: "quiz-counter", tabindex: "-1", "data-autofocus": "true", text: "Question " + (quiz.index + 1) + " sur " + total }),
      options,
      feedback,
      h("div", { class: "quiz-actions" },
        validateButton,
        nextButton,
        h("button", { type: "button", class: "btn btn-ghost", onClick: () => { state.quiz = null; drawQuiz(true); } }, "Quitter le quiz")));
  }

  function scoreMessage(score, total) {
    const ratio = score / total;
    if (ratio === 1) return "Sans faute : bravo !";
    if (ratio >= 0.7) return "Très bien ! Vous maîtrisez l'essentiel de ce niveau.";
    if (ratio >= 0.4) return "Bon début ! Les explications ci-dessous vous aident à consolider vos connaissances.";
    return "Pas de souci : se tromper fait partie de l'apprentissage. Relisez les explications, puis retentez le niveau quand vous voulez.";
  }

  function buildQuizResults(quiz) {
    const total = quiz.questions.length;
    const level = levelById(quiz.levelId);
    const mistakes = quiz.answers.filter((answer) => !answer.correct);

    const recap = mistakes.length === 0
      ? h("p", { class: "success-note", text: "Aucune erreur à revoir sur ce niveau." })
      : h("ol", { class: "mistake-list" }, mistakes.map((answer) => {
        const linked = findComponent(answer.question.composant);
        return h("li", { class: "mistake" },
          h("p", { class: "mistake-question", text: answer.question.texte }),
          h("p", null, "Votre réponse : ", h("span", { class: "is-wrong-text", text: answer.chosenText })),
          h("p", null, "Bonne réponse : ", h("strong", { text: answer.correctText })),
          h("p", { class: "muted", text: answer.question.explication }),
          linked ? h("p", null, h("a", { href: "#/apprendre/" + linked.id }, "Revoir la fiche : " + fullName(linked))) : null);
      }));

    return h("div", { class: "results" },
      h("div", { class: "panel results-summary" },
        h("p", { class: "level-number", text: "Niveau " + level.id + " — " + level.titre + " terminé" }),
        h("h1", { tabindex: "-1", "data-autofocus": "true", text: "Votre score : " + quiz.score + " / " + total }),
        h("p", { class: "lead", text: scoreMessage(quiz.score, total) }),
        h("div", { class: "quiz-actions" },
          h("button", { type: "button", class: "btn btn-primary", onClick: () => startQuiz(quiz.levelId) }, "Recommencer ce niveau"),
          h("button", { type: "button", class: "btn btn-ghost", onClick: () => { state.quiz = null; drawQuiz(true); } }, "Choisir un autre niveau"),
          h("a", { class: "btn btn-ghost", href: "#/apprendre" }, "Réviser les fiches")),
        h("p", { class: "muted", text: "Ce score est un repère personnel pour apprendre, pas une certification officielle." })),
      h("section", { class: "panel" },
        h("h2", { text: mistakes.length ? "Récapitulatif des erreurs (" + mistakes.length + ")" : "Récapitulatif" }),
        recap));
  }

  /* -------------------------------- Assembler ----------------------------- */
  function renderAssembly(main) {
    const A = DATA.assemblage;
    if (!state.assembly) state.assembly = { placed: [], selectedPieceId: null };
    const session = state.assembly;

    const boardWrap = h("div", { class: "board-scroll", html: ART.board() });
    const svg = $("svg", boardWrap);
    const feedback = h("div", { class: "feedback assembly-feedback", role: "status", "aria-live": "polite", tabindex: "-1" });
    const piecesHost = h("div", { class: "pieces" });
    const stepLabel = h("p", { class: "step-label" });
    const fill = h("div", { class: "progressbar-fill" });
    const bar = h("div", { class: "progressbar", role: "progressbar", "aria-label": "Avancement de l'assemblage", "aria-valuemin": "0", "aria-valuemax": A.pieces.length }, fill);

    const pieceById = (id) => A.pieces.find((piece) => piece.id === id);
    const slotById = (id) => A.emplacements.find((slot) => slot.id === id);
    const nextPiece = () => A.pieces.find((piece) => session.placed.indexOf(piece.id) === -1) || null;

    function setFeedback(kind, parts) {
      feedback.className = "feedback assembly-feedback" + (kind ? " is-" + kind : "");
      replaceContent(feedback, ...parts);
    }

    function paintBoard() {
      $$(".filled", svg).forEach((group) => {
        group.classList.toggle("on", session.placed.indexOf(group.getAttribute("data-piece")) !== -1);
      });
    }

    function paintPieces() {
      const recommended = nextPiece();
      piecesHost.replaceChildren(...A.pieces.map((piece, index) => {
        const placed = session.placed.indexOf(piece.id) !== -1;
        const selected = session.selectedPieceId === piece.id;
        const isNext = recommended && recommended.id === piece.id;
        return h("button", {
          type: "button",
          class: "piece-item" + (placed ? " is-placed" : "") + (selected ? " is-selected" : ""),
          "aria-pressed": String(selected),
          disabled: placed,
          onClick: () => choosePiece(piece.id)
        },
        h("span", { class: "piece-step", "aria-hidden": "true", text: String(index + 1) }),
        h("span", { class: "piece-name", text: piece.nom }),
        h("span", { class: "piece-status", text: placed ? "✔ Placé" : (isNext ? "Étape conseillée" : "À placer") }));
      }));
      const done = session.placed.length;
      stepLabel.textContent = done >= A.pieces.length
        ? "Assemblage terminé : " + done + " éléments sur " + A.pieces.length
        : "Étape " + (done + 1) + " sur " + A.pieces.length + " — élément conseillé : " + recommended.nom;
      bar.setAttribute("aria-valuenow", done);
      bar.setAttribute("aria-valuetext", done + " élément" + (done > 1 ? "s" : "") + " placé" + (done > 1 ? "s" : "") + " sur " + A.pieces.length);
      fill.setAttribute("style", "width:" + Math.round((done / A.pieces.length) * 100) + "%");
    }

    function choosePiece(pieceId) {
      session.selectedPieceId = pieceId;
      const piece = pieceById(pieceId);
      paintPieces();
      setFeedback("info", [
        h("p", null, h("strong", { text: piece.nom }), " est sélectionné."),
        h("p", { text: "Cliquez maintenant sur l'emplacement de la carte mère où il doit aller. Indice : " + piece.indice })
      ]);
      announce(piece.nom + " sélectionné. Choisissez son emplacement sur la carte mère.");
    }

    function flashSlot(slotId) {
      const slot = $('[data-slot="' + slotId + '"]', svg);
      if (!slot) return;
      slot.classList.add("is-wrong");
      window.setTimeout(() => slot.classList.remove("is-wrong"), 900);
    }

    function attemptPlacement(slotId) {
      const slot = slotById(slotId);
      const piece = session.selectedPieceId ? pieceById(session.selectedPieceId) : null;
      if (!slot) return;
      if (!piece) {
        setFeedback("info", [h("p", { text: "Choisissez d'abord un élément dans la liste, puis cliquez sur son emplacement sur la carte mère." })]);
        return;
      }

      if (slotId !== piece.emplacement) {
        flashSlot(slotId);
        setFeedback("wrong", [
          h("p", { class: "feedback-title is-wrong", text: "✖ Pas ici, mais essayez encore !" }),
          h("p", null, "L'emplacement « " + slot.nom + " » accueille " + slot.accueille + ". Ce n'est pas le cas de : ", h("strong", { text: piece.nom }), "."),
          h("p", { text: "Indice : " + piece.indice })
        ]);
        return;
      }

      if (piece.apres && session.placed.indexOf(piece.apres) === -1) {
        const before = pieceById(piece.apres);
        setFeedback("info", [
          h("p", { class: "feedback-title", text: "Bon emplacement, mais pas encore !" }),
          h("p", null, "Il faut d'abord installer : ", h("strong", { text: before.nom }), ". " + piece.nom + " se fixe par-dessus.")
        ]);
        return;
      }

      session.placed.push(piece.id);
      session.selectedPieceId = null;
      recordAssemblySuccess(piece.id);
      paintBoard();
      paintPieces();

      const finished = session.placed.length >= A.pieces.length;
      const parts = [
        h("p", { class: "feedback-title is-correct", text: "✔ Bien joué : " + piece.nom + " est en place." }),
        h("p", { text: piece.explication }),
        finished ? h("p", { class: "success-note" }, "Assemblage terminé ! Rappel : il s'agit d'un exercice pédagogique sur une carte mère fictive. ",
          h("a", { href: "#/quiz" }, "Testez ensuite vos connaissances avec le quiz.")) : null
      ];
      setFeedback("correct", parts);
      announce(piece.nom + " correctement placé." + (finished ? " Assemblage terminé." : ""));
    }

    function reset() {
      session.placed = [];
      session.selectedPieceId = null;
      paintBoard();
      paintPieces();
      setFeedback("info", [h("p", { text: "Exercice réinitialisé. Vos réussites précédentes restent comptées dans votre progression." })]);
      announce("Exercice réinitialisé.");
    }

    svg.addEventListener("click", (event) => {
      const slot = event.target.closest("[data-slot]");
      if (slot) attemptPlacement(slot.getAttribute("data-slot"));
    });
    svg.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const slot = event.target.closest("[data-slot]");
      if (!slot) return;
      event.preventDefault();
      attemptPlacement(slot.getAttribute("data-slot"));
    });

    main.append(h("section", { class: "view assembly-view container" },
      h("header", { class: "view-head" },
        h("h1", { text: "Assembler un PC (exercice guidé)" }),
        h("p", { class: "lead", text: A.introduction })),
      h("div", { class: "notice" },
        h("p", { text: A.avertissement }),
        h("details", null,
          h("summary", { text: "Formats de cartes mères et compatibilité" }),
          h("ul", null, A.formats.map((format) => h("li", null, h("strong", { text: format.nom }), " : " + format.detail))),
          h("p", { text: A.compatibilite }))),
      h("div", { class: "assembly-grid" },
        h("section", { class: "panel board-panel", "aria-labelledby": "board-title" },
          h("h2", { id: "board-title", class: "panel-title", text: "Carte mère schématique (fictive)" }),
          h("p", { class: "scroll-hint muted", text: "Sur petit écran, faites glisser le schéma horizontalement." }),
          boardWrap),
        h("section", { class: "panel pieces-panel", "aria-labelledby": "pieces-title" },
          h("h2", { id: "pieces-title", class: "panel-title", text: "Éléments à placer" }),
          stepLabel,
          bar,
          piecesHost,
          feedback,
          h("button", { type: "button", class: "btn btn-ghost", onClick: reset }, "Recommencer l'exercice")))));

    paintBoard();
    paintPieces();
    setFeedback("info", [h("p", { text: session.placed.length ? "Vous reprenez l'exercice là où vous l'aviez laissé." : "Commencez par choisir un élément dans la liste (l'étape conseillée est indiquée)." })]);
  }

  /* ------------------------------- Diagnostic ----------------------------- */
  const VERDICT_LABELS = {
    bon: "✔ Bonne démarche",
    moyen: "◐ Piste possible, mais pas la plus efficace",
    mauvais: "✖ À éviter"
  };

  function renderDiagnostic(main) {
    const host = h("section", { class: "view diagnostic-view container" });
    main.append(host);

    function drawMenu() {
      const warnings = DATA.diagnosticAvertissement;
      replaceContent(host, 
        h("header", { class: "view-head" },
          h("h1", { tabindex: "-1", "data-autofocus": "true", text: "Diagnostic : résoudre des pannes fictives" }),
          h("p", { class: "lead", text: "Pour chaque scénario, observez les symptômes, passez en revue les hypothèses, puis choisissez la démarche que vous suivriez en premier." })),
        h("div", { class: "notice" }, h("p", { text: warnings.simplification }), h("p", { text: warnings.securite })),
        h("div", { class: "card-grid" }, DATA.diagnostics.map((scenario) => {
          const solved = state.progress.diagnostics.indexOf(scenario.id) !== -1;
          return h("article", { class: "card scenario-card" },
            h("h2", { text: scenario.titre }),
            h("p", { text: scenario.resume }),
            h("p", { class: "scenario-status" + (solved ? " is-solved" : ""), text: solved ? "✔ Bonne démarche trouvée" : "Pas encore résolu" }),
            h("button", { type: "button", class: "btn btn-primary", onClick: () => openScenario(scenario.id) }, solved ? "Rejouer ce scénario" : "Ouvrir ce scénario"));
        })));
      const heading = $("[data-autofocus]", host);
      if (heading && state.diagnostic.currentId) heading.focus();
      state.diagnostic.currentId = null;
    }

    function openScenario(id) {
      state.diagnostic = { currentId: id, picked: {}, solutionShown: false };
      drawScenario();
      const heading = $("[data-autofocus]", host);
      if (heading) heading.focus();
      window.scrollTo(0, 0);
    }

    function drawScenario() {
      const scenario = DATA.diagnostics.find((item) => item.id === state.diagnostic.currentId);
      if (!scenario) { drawMenu(); return; }
      const warnings = DATA.diagnosticAvertissement;
      const feedback = h("div", { class: "feedback", role: "status", "aria-live": "polite", tabindex: "-1" });
      const solutionHost = h("div", { class: "solution" });

      const choices = scenario.demarches.map((approach, index) => {
        const picked = state.diagnostic.picked[index];
        return h("button", {
          type: "button",
          class: "choice" + (picked ? " is-" + approach.verdict : ""),
          "data-index": index,
          onClick: () => choose(index)
        },
        h("span", { class: "choice-text", text: approach.texte }),
        picked ? h("span", { class: "choice-verdict", text: VERDICT_LABELS[approach.verdict] }) : null);
      });

      const showSolutionButton = h("button", {
        type: "button",
        class: "btn btn-ghost",
        hidden: !Object.keys(state.diagnostic.picked).length || state.diagnostic.solutionShown,
        onClick: () => showSolution()
      }, "Afficher la correction");

      function choose(index) {
        const approach = scenario.demarches[index];
        state.diagnostic.picked[index] = true;
        const button = $('.choice[data-index="' + index + '"]', host);
        button.classList.add("is-" + approach.verdict);
        if (!$(".choice-verdict", button)) button.append(h("span", { class: "choice-verdict", text: VERDICT_LABELS[approach.verdict] }));
        feedback.className = "feedback is-" + (approach.verdict === "bon" ? "correct" : approach.verdict === "moyen" ? "info" : "wrong");
        replaceContent(feedback, 
          h("p", { class: "feedback-title", text: VERDICT_LABELS[approach.verdict] }),
          h("p", { text: approach.retour }),
          approach.verdict === "bon" ? null : h("p", { class: "muted", text: "Vous pouvez essayer une autre démarche : aucune pénalité." }));
        if (approach.verdict === "bon") {
          recordDiagnosticSuccess(scenario.id);
          showSolution();
        } else {
          showSolutionButton.hidden = state.diagnostic.solutionShown;
        }
        feedback.focus({ preventScroll: false });
      }

      function showSolution() {
        state.diagnostic.solutionShown = true;
        showSolutionButton.hidden = true;
        replaceContent(solutionHost, 
          h("h3", { text: "Causes possibles" }),
          h("ul", null, scenario.causes.map((cause) => h("li", { text: cause }))),
          h("h3", { text: "Correction pédagogique" }),
          h("ol", null, scenario.correction.map((step) => h("li", { text: step }))),
          h("p", { class: "notice-inline" }, warnings.securite),
          h("p", { class: "muted", text: warnings.simplification }));
      }

      replaceContent(host, 
        h("button", { type: "button", class: "btn btn-ghost back-button", onClick: () => { state.diagnostic.currentId = "menu"; drawMenu(); } }, "← Tous les scénarios"),
        h("header", { class: "view-head" },
          h("h1", { tabindex: "-1", "data-autofocus": "true", text: scenario.titre }),
          h("p", { class: "lead", text: scenario.resume })),
        h("div", { class: "diagnostic-grid" },
          h("section", { class: "panel" },
            h("h2", { text: "Symptômes observés" }),
            h("ul", null, scenario.symptomes.map((symptom) => h("li", { text: symptom }))),
            h("h2", { text: "Hypothèses possibles" }),
            h("ul", null, scenario.hypotheses.map((hypothesis) => h("li", { text: hypothesis })))),
          h("section", { class: "panel" },
            h("h2", { text: "Quelle démarche choisissez-vous en premier ?" }),
            h("div", { class: "choices" }, choices),
            feedback,
            showSolutionButton,
            solutionHost)),
        h("div", { class: "notice" }, h("p", { text: warnings.securite }), h("p", { text: warnings.simplification })));

      if (state.diagnostic.solutionShown) showSolution();
    }

    drawMenu();
  }

  /* ------------------------------ Progression ----------------------------- */
  function renderProgress(main) {
    const progress = state.progress;
    const percent = computeProgressPercent(progress);
    const exercisesDone = progress.assembly.length + progress.diagnostics.length;
    const exercisesTotal = DATA.assemblage.pieces.length + DATA.diagnostics.length;
    const last = progress.lastQuiz;
    const lastLevel = last ? levelById(last.niveau) : null;

    const stat = (label, value, detail) => h("div", { class: "card stat" },
      h("p", { class: "stat-label", text: label }),
      h("p", { class: "stat-value", text: value }),
      detail ? h("p", { class: "muted", text: detail }) : null);

    const awards = AWARDS.map((award) => {
      const earned = award.test(progress);
      return h("li", { class: "award" + (earned ? " is-earned" : "") },
        h("span", { class: "award-mark", "aria-hidden": "true", text: earned ? "★" : "☆" }),
        h("div", null,
          h("p", { class: "award-name" }, award.nom, " ", h("span", { class: "badge " + (earned ? "badge-ok" : "badge-soft"), text: earned ? "Obtenue" : "À débloquer" })),
          h("p", { class: "muted", text: "Critère : " + award.critere })));
    });

    main.append(h("section", { class: "view progress-view container" },
      h("header", { class: "view-head" },
        h("h1", { text: "Ma progression" }),
        h("p", { class: "lead", text: "Un aperçu de ce que vous avez déjà exploré et réussi." })),
      h("div", { class: "panel overall" },
        h("p", { class: "stat-label", text: "Progression globale" }),
        h("p", { class: "stat-value", text: percent + " %" }),
        h("div", { class: "progressbar", role: "progressbar", "aria-label": "Progression globale", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": percent },
          h("div", { class: "progressbar-fill", style: "width:" + percent + "%" })),
        h("p", { class: "muted", text: "Calcul : moyenne de quatre axes à poids égal — fiches consultées, niveaux de quiz terminés (sur " + DATA.quiz.niveaux.length + "), éléments d'assemblage placés et scénarios de diagnostic résolus." })),
      h("div", { class: "card-grid stat-grid" },
        stat("Composants découverts", progress.discovered.length + " / " + COMPONENTS.length),
        stat("Quiz terminés", String(quizzesDone(progress)), levelsDone(progress) + " niveau" + (levelsDone(progress) > 1 ? "x" : "") + " sur " + DATA.quiz.niveaux.length + " terminé" + (levelsDone(progress) > 1 ? "s" : "")),
        stat("Score du dernier quiz", last ? last.score + " / " + last.total : "—", lastLevel ? "Niveau " + lastLevel.id + " — " + lastLevel.titre : "Aucun quiz terminé pour l'instant"),
        stat("Exercices réussis", exercisesDone + " / " + exercisesTotal, progress.assembly.length + " élément" + (progress.assembly.length > 1 ? "s" : "") + " assemblé" + (progress.assembly.length > 1 ? "s" : "") + " · " + progress.diagnostics.length + " diagnostic" + (progress.diagnostics.length > 1 ? "s" : "") + " résolu" + (progress.diagnostics.length > 1 ? "s" : ""))),
      h("section", { class: "panel", "aria-labelledby": "awards-title" },
        h("h2", { id: "awards-title", text: "Récompenses pédagogiques" }),
        h("ul", { class: "award-list" }, awards)),
      h("section", { class: "panel notice-panel" },
        h("h2", { text: "À propos de vos données" }),
        h("p", { text: "Votre progression est enregistrée uniquement sur cet appareil, dans le stockage local de votre navigateur. Aucun compte n'est nécessaire et rien n'est envoyé sur Internet. Elle peut être perdue si vous effacez les données du navigateur ou si vous utilisez la navigation privée." }),
        state.storageAvailable ? null : h("p", { class: "warning", text: "Votre navigateur n'autorise pas l'enregistrement local : la progression n'est conservée que tant que cette page reste ouverte." }),
        h("button", { type: "button", class: "btn btn-danger", onClick: resetProgress }, "Effacer ma progression"))));

    function resetProgress() {
      if (typeof window.confirm === "function" && !window.confirm("Effacer toute votre progression sur cet appareil ? Cette action est définitive.")) return;
      state.progress = defaultProgress();
      state.awardsKnown = [];
      state.assembly = null;
      state.quiz = null;
      persistProgress();
      updateHeaderProgress();
      const mainElement = $("#main");
      mainElement.replaceChildren();
      renderProgress(mainElement);
      announce("Progression effacée.");
    }
  }

  function renderNotFound(main) {
    main.append(h("section", { class: "view container" },
      h("h1", { text: "Page introuvable" }),
      h("p", { class: "lead", text: "Cette page n'existe pas. Revenez à l'accueil pour choisir un parcours." }),
      h("a", { class: "btn btn-primary", href: "#/accueil" }, "Retour à l'accueil")));
  }

  /* ======================================================================= */
  /*  5. Routeur et initialisation                                           */
  /* ======================================================================= */

  const VIEWS = {
    accueil: { title: "Accueil", render: renderHome },
    explorer: { title: "Explorer", render: renderExplorer },
    apprendre: { title: "Apprendre", render: renderLearn },
    quiz: { title: "Quiz", render: renderQuiz },
    assembler: { title: "Assembler", render: renderAssembly },
    diagnostic: { title: "Diagnostic", render: renderDiagnostic },
    progression: { title: "Progression", render: renderProgress }
  };

  function parseHash() {
    const raw = window.location.hash.replace(/^#\/?/, "");
    const parts = raw.split("/");
    let param = null;
    try {
      param = parts[1] ? decodeURIComponent(parts[1]) : null;
    } catch (error) {
      param = null;
    }
    return { name: parts[0] || "accueil", param: param };
  }

  function setActiveNav(name) {
    $$("#site-nav a").forEach((link) => {
      if (link.getAttribute("data-route") === name) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function route(isInitial) {
    const main = $("#main");
    const parsed = parseHash();
    const view = VIEWS[parsed.name];
    main.replaceChildren();
    quizHost = null;

    try {
      if (view) {
        view.render(main, parsed.param);
        document.title = view.title + " — EITT Hardware Quest";
      } else {
        renderNotFound(main);
        document.title = "Page introuvable — EITT Hardware Quest";
      }
    } catch (error) {
      main.replaceChildren(h("section", { class: "view container" },
        h("h1", { text: "Oups, une erreur est survenue" }),
        h("p", { class: "lead", text: "Cette page n'a pas pu s'afficher. Vous pouvez revenir à l'accueil ou recharger la page." }),
        h("a", { class: "btn btn-primary", href: "#/accueil" }, "Retour à l'accueil")));
      if (window.console) window.console.error(error);
    }

    setActiveNav(view ? parsed.name : null);

    const nav = $("#site-nav");
    const toggle = $("#nav-toggle");
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");

    if (!isInitial) {
      window.scrollTo(0, 0);
      main.focus({ preventScroll: true });
    }
  }

  /**
   * Logo EITT : l'attribut data-logo-src de #logo-slot dans index.html pointe vers assets/logo/eitt-mark.png.
   * Si l'attribut est vide ou si l'image est introuvable, un emplacement neutre est affiché :
   * aucun logo n'est inventé.
   */
  function initLogo() {
    const slot = $("#logo-slot");
    const source = slot && slot.getAttribute("data-logo-src");
    if (!source || typeof window.Image !== "function") return;
    const logo = new window.Image();
    logo.onload = () => {
      logo.alt = "";
      slot.replaceChildren(logo);
      slot.classList.add("has-logo");
    };
    logo.src = source;
  }

  function init() {
    state.progress = loadProgress();
    state.awardsKnown = earnedAwardIds();
    updateHeaderProgress();
    initLogo();

    const toggle = $("#nav-toggle");
    const nav = $("#site-nav");
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    window.addEventListener("hashchange", () => route(false));
    route(true);
  }

  init();
}());
