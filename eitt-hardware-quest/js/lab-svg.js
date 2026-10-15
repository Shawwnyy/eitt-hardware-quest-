/*
 * EITT Hardware Quest — Illustrations SVG (vue éclatée du PC, carte mère schématique, icônes).
 *
 * Toutes les illustrations sont dessinées ici, en SVG pur : aucune image externe, aucune bibliothèque 3D.
 * Les couleurs sont définies en CSS (css/style.css) pour rester cohérentes avec l'identité EITT.
 *
 * API :
 *   EITT_SVG.icon(id)            -> markup d'une petite icône 24×24 pour un composant
 *   EITT_SVG.lab(interactive)    -> vue éclatée (zones cliquables si interactive = true)
 *   EITT_SVG.board()             -> carte mère schématique de l'exercice d'assemblage
 */
(function () {
  "use strict";

  /* ------------------------------ Icônes ---------------------------------- */
  const ICON_PATHS = {
    "cpu": '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
    "ram": '<rect x="2.5" y="6.5" width="19" height="9" rx="1"/><path d="M6 9.5v3M10 9.5v3M14 9.5v3M18 9.5v3M5 15.5v3M8 15.5v3M12 15.5v3M16 15.5v3M19 15.5v3"/>',
    "carte-mere": '<rect x="3.5" y="3.5" width="17" height="17" rx="1.5"/><rect x="7" y="7" width="5" height="5"/><path d="M15 7v7M7 16h6M17 17h.01"/>',
    "gpu": '<rect x="2.5" y="6.5" width="19" height="9" rx="1.5"/><circle cx="9" cy="11" r="2.8"/><circle cx="16" cy="11" r="2.8"/><path d="M5 15.5v3M8 15.5v3"/>',
    "ssd": '<rect x="3" y="7.5" width="18" height="9" rx="1.5"/><rect x="6" y="10" width="4" height="4"/><rect x="12" y="10" width="4" height="4"/><path d="M19 10v4"/>',
    "hdd": '<rect x="4" y="3.5" width="16" height="17" rx="2"/><circle cx="12" cy="11" r="4"/><circle cx="12" cy="11" r="1"/><path d="M8 18h8"/>',
    "alimentation": '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M13 7.5l-3.5 5H12l-1 4 3.5-5H12z"/>',
    "refroidissement": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="1.6"/><path d="M12 10.4c0-3 1-5 3-6M13.6 12c3 0 5 1 6 3M12 13.6c0 3-1 5-3 6M10.4 12c-3 0-5-1-6-3"/>',
    "reseau": '<circle cx="12" cy="5.5" r="2.2"/><circle cx="5.5" cy="18" r="2.2"/><circle cx="18.5" cy="18" r="2.2"/><path d="M11 7.5L6.5 16M13 7.5l4.5 8.5M8 18h8"/>',
    "boitier": '<rect x="6" y="2.5" width="12" height="19" rx="2"/><path d="M9 6h6M9 9h6"/><circle cx="12" cy="16.5" r="1.8"/>'
  };

  function icon(id) {
    const paths = ICON_PATHS[id] || ICON_PATHS["carte-mere"];
    return '<svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      paths + "</svg>";
  }

  /* ----------------------- Noms accessibles des pièces -------------------- */
  function accessibleName(id, fallback) {
    const list = (window.EITT_DATA && window.EITT_DATA.composants) || [];
    const found = list.find((c) => c.id === id);
    if (!found) return fallback;
    return found.abreviation ? found.nom + " (" + found.abreviation + ")" : found.nom;
  }

  /* ----------------- Petits générateurs de formes répétitives ------------- */
  function fanBlades(cx, cy, radius, cls) {
    let out = "";
    for (let i = 0; i < 4; i += 1) {
      const angle = (Math.PI / 2) * i + Math.PI / 4;
      const x = (cx + Math.cos(angle) * radius).toFixed(1);
      const y = (cy + Math.sin(angle) * radius).toFixed(1);
      out += '<line class="' + cls + '" x1="' + cx + '" y1="' + cy + '" x2="' + x + '" y2="' + y + '"/>';
    }
    return out;
  }

  /* ---------------------------- Vue éclatée -------------------------------- */
  function labPart(interactive, id, fallbackName, hit, inner) {
    const name = accessibleName(id, fallbackName);
    const hitRect = interactive
      ? '<rect class="hit" x="' + hit[0] + '" y="' + hit[1] + '" width="' + hit[2] + '" height="' + hit[3] + '"/>'
      : "";
    const attrs = interactive
      ? ' id="part-' + id + '" data-part="' + id + '" role="button" tabindex="0" aria-pressed="false" aria-label="' +
        name + ' : afficher la fiche"'
      : "";
    const title = interactive ? "<title>" + name + "</title>" : "";
    return '<g class="part"' + attrs + ">" + title + hitRect + inner + "</g>";
  }

  function lab(interactive) {
    const ia = Boolean(interactive);

    const caseBody =
      '<rect class="shape case-body" x="20" y="20" width="860" height="600" rx="28"/>' +
      '<rect class="detail faint" x="40" y="40" width="820" height="560" rx="18"/>' +
      '<rect class="detail" x="776" y="48" width="38" height="20" rx="3"/>' +
      '<circle class="detail" cx="846" cy="58" r="10"/><circle class="accent-dot" cx="846" cy="58" r="3.5"/>' +
      '<text class="label" x="44" y="598">Boîtier</text>';

    const links =
      '<g class="links" aria-hidden="true">' +
      '<path class="link" d="M400 106V125"/>' +
      '<path class="link" d="M400 181V215"/>' +
      '<path class="link" d="M598 270H526"/>' +
      '<path class="link" d="M230 293L305 316"/>' +
      '<path class="link" d="M480 486V420"/>' +
      '<path class="link" d="M620 407L542 415"/>' +
      '<path class="cable" d="M226 435C262 435 262 400 290 400"/>' +
      '<path class="cable" d="M700 500C700 450 600 440 550 380"/>' +
      "</g>";

    /* Carte mère */
    let ramSlots = "";
    for (let i = 0; i < 4; i += 1) {
      ramSlots += '<rect class="detail" x="' + (470 + i * 15) + '" y="215" width="9" height="130" rx="2"/>';
    }
    const motherboard = labPart(ia, "carte-mere", "Carte mère", [282, 187, 276, 288],
      '<rect class="shape" x="290" y="195" width="260" height="270" rx="10"/>' +
      '<rect class="detail dashed" x="372" y="215" width="56" height="56" rx="4"/>' +
      '<rect class="detail" x="381" y="224" width="38" height="38" rx="2"/>' +
      ramSlots +
      '<rect class="detail" x="305" y="310" width="60" height="12" rx="2"/>' +
      '<rect class="detail" x="430" y="360" width="44" height="44" rx="4"/>' +
      '<rect class="detail" x="305" y="410" width="235" height="10" rx="2"/>' +
      '<rect class="detail" x="534" y="330" width="12" height="60" rx="2"/>' +
      '<path class="detail faint" d="M310 290H350V250M470 360V350H500M330 380H420"/>' +
      '<text class="label" x="304" y="452">Carte mère</text>');

    /* Disque dur */
    const hdd = labPart(ia, "hdd", "Disque dur", [52, 356, 182, 140],
      '<rect class="shape" x="60" y="385" width="160" height="100" rx="8"/>' +
      '<circle class="detail" cx="125" cy="435" r="36"/>' +
      '<circle class="detail" cx="125" cy="435" r="9"/>' +
      '<path class="detail" d="M188 404L141 428"/><circle class="detail" cx="190" cy="402" r="5"/>' +
      '<rect class="detail" x="212" y="420" width="14" height="30" rx="2"/>' +
      '<text class="label" x="60" y="378">HDD</text>');

    /* SSD */
    const ssd = labPart(ia, "ssd", "Stockage SSD", [72, 248, 166, 70],
      '<rect class="shape" x="80" y="275" width="150" height="36" rx="4"/>' +
      '<rect class="detail" x="95" y="282" width="26" height="22" rx="2"/>' +
      '<rect class="detail" x="128" y="282" width="26" height="22" rx="2"/>' +
      '<rect class="detail" x="161" y="282" width="26" height="22" rx="2"/>' +
      '<rect class="gold" x="222" y="280" width="8" height="26"/>' +
      '<text class="label" x="80" y="265">SSD</text>');

    /* RAM */
    let ramSticks = "";
    [600, 630].forEach(function (x) {
      ramSticks += '<rect class="shape" x="' + x + '" y="205" width="22" height="130" rx="3"/>';
      for (let i = 0; i < 4; i += 1) {
        ramSticks += '<rect class="detail" x="' + (x + 4) + '" y="' + (214 + i * 26) + '" width="14" height="20" rx="2"/>';
      }
      ramSticks += '<rect class="gold" x="' + x + '" y="327" width="22" height="8"/>';
    });
    const ram = labPart(ia, "ram", "Mémoire vive", [592, 172, 70, 170],
      ramSticks + '<text class="label" x="600" y="195">RAM</text>');

    /* Carte réseau */
    const network = labPart(ia, "reseau", "Carte réseau", [612, 340, 172, 86],
      '<rect class="shape" x="620" y="372" width="150" height="42" rx="4"/>' +
      '<rect class="detail" x="650" y="380" width="34" height="26" rx="2"/>' +
      '<rect class="detail" x="705" y="382" width="30" height="22" rx="2"/>' +
      '<rect class="detail" x="770" y="366" width="8" height="54" rx="2"/>' +
      '<rect class="gold" x="640" y="410" width="90" height="6"/>' +
      '<text class="label" x="620" y="362">Réseau</text>');

    /* Alimentation */
    const psu = labPart(ia, "alimentation", "Alimentation", [592, 490, 256, 118],
      '<rect class="shape" x="600" y="500" width="240" height="100" rx="10"/>' +
      '<circle class="detail" cx="690" cy="540" r="34"/><circle class="detail" cx="690" cy="540" r="22"/>' +
      '<circle class="detail" cx="690" cy="540" r="7"/>' + fanBlades(690, 540, 22, "detail") +
      '<rect class="detail" x="790" y="528" width="36" height="44" rx="4"/>' +
      '<rect class="gold" x="798" y="538" width="4" height="12"/><rect class="gold" x="808" y="538" width="4" height="12"/>' +
      '<rect class="gold" x="818" y="538" width="4" height="12"/>' +
      '<text class="label" x="612" y="592">Alimentation</text>');

    /* Carte graphique */
    const gpu = labPart(ia, "gpu", "Carte graphique", [272, 478, 288, 130],
      '<rect class="gold" x="340" y="486" width="160" height="9"/>' +
      '<rect class="shape" x="290" y="495" width="260" height="70" rx="8"/>' +
      '<rect class="detail" x="280" y="495" width="10" height="70" rx="2"/>' +
      '<circle class="detail" cx="370" cy="530" r="24"/><circle class="detail" cx="370" cy="530" r="6"/>' + fanBlades(370, 530, 22, "detail") +
      '<circle class="detail" cx="470" cy="530" r="24"/><circle class="detail" cx="470" cy="530" r="6"/>' + fanBlades(470, 530, 22, "detail") +
      '<text class="label" x="290" y="592">GPU</text>');

    /* Système de refroidissement */
    let fins = "";
    for (let i = 0; i < 6; i += 1) {
      fins += '<line class="detail" x1="358" y1="' + (58 + i * 8) + '" x2="442" y2="' + (58 + i * 8) + '"/>';
    }
    const cooling = labPart(ia, "refroidissement", "Système de refroidissement", [342, 40, 320, 76],
      '<rect class="shape" x="350" y="50" width="100" height="56" rx="6"/>' + fins +
      '<circle class="shape-flat" cx="400" cy="78" r="21"/><circle class="detail" cx="400" cy="78" r="21"/>' +
      '<circle class="detail" cx="400" cy="78" r="5"/>' + fanBlades(400, 78, 18, "detail") +
      '<text class="label" x="466" y="84">Refroidissement</text>');

    /* Processeur */
    const cpu = labPart(ia, "cpu", "Processeur", [364, 117, 110, 72],
      '<rect class="shape" x="372" y="125" width="56" height="56" rx="4"/>' +
      '<rect class="detail" x="388" y="141" width="24" height="24" rx="2"/>' +
      '<path class="accent-fill" d="M377 130h8l-8 8z"/>' +
      '<text class="label" x="440" y="158">CPU</text>');

    /* Boîtier : en premier dans le DOM pour rester « derrière » les autres pièces. */
    const casePart = labPart(ia, "boitier", "Boîtier", [20, 20, 860, 600], caseBody);

    const labelAttrs = ia
      ? 'role="group" aria-label="Vue éclatée interactive d\'un ordinateur de bureau"'
      : 'role="img" aria-label="Illustration d\'un ordinateur de bureau en vue éclatée : boîtier, carte mère, processeur, mémoire, stockage, carte graphique, alimentation et refroidissement"';

    return '<svg class="lab-svg' + (ia ? " is-interactive" : "") + '" viewBox="0 0 900 640" xmlns="http://www.w3.org/2000/svg" ' +
      labelAttrs + ">" + casePart + links + motherboard + hdd + ssd + ram + network + psu + gpu + cooling + cpu + "</svg>";
  }

  /* ------------------ Carte mère schématique (assemblage) ------------------ */
  function boardSlot(id, name, hit, shape, filled, label) {
    return '<g class="slot" data-slot="' + id + '" role="button" tabindex="0" aria-label="Emplacement : ' + name + '">' +
      "<title>" + name + "</title>" +
      '<rect class="hit" x="' + hit[0] + '" y="' + hit[1] + '" width="' + hit[2] + '" height="' + hit[3] + '"/>' +
      shape + filled + label + "</g>";
  }

  function board() {
    /* Pins du connecteur 24 broches et du connecteur CPU */
    let pins24 = "";
    for (let i = 0; i < 12; i += 1) {
      pins24 += '<rect class="pin" x="565" y="' + (157 + i * 15) + '" width="10" height="10"/>' +
        '<rect class="pin" x="581" y="' + (157 + i * 15) + '" width="10" height="10"/>';
    }
    let pins8 = "";
    for (let i = 0; i < 8; i += 1) {
      pins8 += '<rect class="pin" x="' + (139 + i * 15) + '" y="40" width="9" height="14"/>';
    }
    let slots = "";
    let sticks = "";
    for (let i = 0; i < 4; i += 1) {
      const x = 330 + i * 22;
      slots += '<rect class="slot-shape" x="' + x + '" y="80" width="14" height="170" rx="2"/>';
      if (i === 1 || i === 3) {
        sticks += '<rect class="piece" x="' + x + '" y="80" width="14" height="170" rx="2"/>' +
          '<rect class="piece-detail" x="' + (x + 3) + '" y="100" width="8" height="30"/>' +
          '<rect class="piece-detail" x="' + (x + 3) + '" y="150" width="8" height="30"/>' +
          '<rect class="piece-detail" x="' + (x + 3) + '" y="200" width="8" height="30"/>';
      }
    }

    const socket = boardSlot("socket-cpu", "Socket du processeur", [110, 72, 200, 170],
      '<rect class="slot-shape" x="130" y="80" width="130" height="130" rx="6"/>' +
      '<rect class="slot-inner" x="142" y="92" width="106" height="106" rx="3"/>',
      '<g class="filled" data-piece="cpu"><rect class="piece" x="152" y="102" width="86" height="86" rx="6"/>' +
        '<rect class="piece-detail" x="172" y="122" width="46" height="46" rx="3"/>' +
        '<text class="piece-text" x="195" y="151" text-anchor="middle">CPU</text></g>' +
        '<g class="filled" data-piece="refroidisseur"><circle class="piece cooler" cx="195" cy="145" r="66"/>' +
        '<circle class="piece-detail" cx="195" cy="145" r="46"/><circle class="piece-detail" cx="195" cy="145" r="10"/>' +
        fanBlades(195, 145, 44, "piece-line") + "</g>",
      '<text class="slot-label" x="130" y="232">Socket du processeur</text>');

    const cpuPower = boardSlot("cpu-power", "Connecteur d'alimentation du processeur", [120, 24, 400, 46],
      '<rect class="slot-shape" x="130" y="34" width="130" height="26" rx="4"/>' + pins8,
      '<g class="filled" data-piece="cpu-power"><rect class="piece" x="130" y="34" width="130" height="26" rx="4"/>' +
        '<rect class="piece" x="150" y="4" width="90" height="30" rx="4"/></g>',
      '<text class="slot-label" x="272" y="52">Alim. processeur</text>');

    const memory = boardSlot("ram", "Emplacements mémoire (DIMM)", [322, 52, 150, 230],
      slots, '<g class="filled" data-piece="ram">' + sticks + "</g>",
      '<text class="slot-label" x="330" y="72">Mémoire (DIMM)</text>');

    const m2 = boardSlot("m2", "Emplacement M.2", [120, 246, 200, 72],
      '<rect class="slot-shape" x="130" y="256" width="170" height="24" rx="3"/>' +
      '<circle class="slot-inner" cx="312" cy="268" r="5"/>',
      '<g class="filled" data-piece="ssd"><rect class="piece" x="135" y="258" width="160" height="20" rx="3"/>' +
        '<rect class="piece-detail" x="145" y="261" width="30" height="14"/>' +
        '<rect class="piece-detail" x="182" y="261" width="30" height="14"/>' +
        '<rect class="piece-detail" x="219" y="261" width="30" height="14"/></g>',
      '<text class="slot-label" x="130" y="302">Emplacement M.2</text>');

    const pcie = boardSlot("pcie", "Emplacement PCI Express x16", [40, 340, 410, 112],
      '<rect class="slot-shape" x="50" y="390" width="330" height="22" rx="3"/>',
      '<g class="filled" data-piece="gpu"><rect class="piece" x="40" y="350" width="400" height="70" rx="8"/>' +
        '<circle class="piece-detail" cx="140" cy="385" r="25"/><circle class="piece-detail" cx="140" cy="385" r="6"/>' +
        fanBlades(140, 385, 23, "piece-line") +
        '<circle class="piece-detail" cx="250" cy="385" r="25"/><circle class="piece-detail" cx="250" cy="385" r="6"/>' +
        fanBlades(250, 385, 23, "piece-line") +
        '<text class="piece-text" x="360" y="391" text-anchor="middle">GPU</text></g>',
      '<text class="slot-label" x="50" y="444">PCI Express x16</text>');

    const atx24 = boardSlot("atx24", "Connecteur d'alimentation principal (24 broches)", [470, 112, 150, 244],
      '<rect class="slot-shape" x="560" y="150" width="36" height="190" rx="4"/>' + pins24,
      '<g class="filled" data-piece="atx24"><rect class="piece" x="560" y="150" width="36" height="190" rx="4"/>' +
        '<rect class="piece" x="596" y="170" width="38" height="150" rx="4"/></g>',
      '<text class="slot-label" x="596" y="124" text-anchor="end">Alim. carte mère</text>' +
      '<text class="slot-label" x="596" y="142" text-anchor="end">(24 broches)</text>');

    const decor =
      '<g class="decor" aria-hidden="true">' +
      '<circle class="hole" cx="40" cy="40" r="6"/><circle class="hole" cx="600" cy="440" r="6"/>' +
      '<circle class="hole" cx="40" cy="440" r="6"/><circle class="hole" cx="440" cy="40" r="6"/>' +
      '<rect class="decor-chip" x="410" y="270" width="56" height="56" rx="5"/>' +
      '<path class="trace" d="M70 320H110V350M310 330H410V350M480 300H540V380M470 100V130H540"/>' +
      "</g>";

    return '<svg class="board-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" role="group" ' +
      'aria-label="Carte mère schématique et fictive, avec ses emplacements">' +
      '<rect class="board" x="20" y="20" width="600" height="440" rx="14"/>' +
      decor + socket + cpuPower + memory + m2 + pcie + atx24 + "</svg>";
  }

  window.EITT_SVG = { icon: icon, lab: lab, board: board };
}());
