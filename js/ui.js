/* ============================================================
   ui.js — Apprenant C : DOM dynamique, événements, filtre et recherche
   Aucune modification directe des données : on passe par tasks.js (B).
   ============================================================ */

/* ---------- Étape 1 : faux tableau (mock) ---------- */

// Tâches de démonstration (même structure que l'objet Tâche 1.3)
const mockTasks = [
  {
    id: 1762732800000,
    titre: "Faire les courses",
    description: "Acheter du pain et du lait",
    statut: "a-faire",
    date: "2026-11-10"
  },
  {
    id: 1762819200000,
    titre: "Structurer le HTML",
    description: "",
    statut: "en-cours",
    date: "2026-11-11"
  },
  {
    id: 1762905600000,
    titre: "Créer le dépôt GitHub",
    description: "Une branche par personne.",
    statut: "terminee",
    date: "2026-11-12"
  }
];

// Seul endroit à modifier lors de l'assemblage : retourne la source des tâches
function getAllTasks() {
  return mockTasks;
}

/* ---------- Étape 2 : statuts et éléments de la page ---------- */

// Libellé affiché pour chaque valeur de statut (tableau 1.2)
const STATUT_LABELS = {
  "a-faire": "À faire",
  "en-cours": "En cours",
  "terminee": "Terminée",
  "bloquee": "Bloquée"
};

// Classes Bootstrap du badge pour chaque statut (tableau 1.2)
const STATUT_BADGES = {
  "a-faire": ["bg-secondary"],
  "en-cours": ["bg-warning", "text-dark"],
  "terminee": ["bg-success"],
  "bloquee": ["bg-danger"]
};

// Éléments de la page (ID de la Partie 1.1), récupérés une seule fois
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

/* ---------- Étape 3 : générer une carte (R2) ---------- */

// Crée un élément avec ses classes et, si fourni, son texte (jamais innerHTML)
function createElement(tag, classes, text) {
  const element = document.createElement(tag);
  element.classList.add(...classes);
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

// Crée le badge coloré correspondant au statut
function createBadge(statut) {
  return createElement("span", ["badge", ...STATUT_BADGES[statut]], STATUT_LABELS[statut]);
}

// Crée l'en-tête de la carte : titre + badge
function createCardHeader(task) {
  const header = createElement("div", ["d-flex", "justify-content-between", "align-items-start", "gap-2", "mb-2"]);
  const title = createElement("h3", ["card-title", "h5", "mb-0"], task.titre);
  header.append(title, createBadge(task.statut));
  return header;
}

// Crée la ligne « Créée le AAAA-MM-JJ »
function createCardDate(task) {
  const paragraph = createElement("p", ["card-text"]);
  paragraph.append(createElement("small", ["text-muted"], "Créée le " + task.date));
  return paragraph;
}

// Crée un bouton d'action qui connaît l'id de sa tâche
function createActionButton(task, classes, label) {
  const button = createElement("button", ["btn", "btn-sm", ...classes], label);
  button.type = "button";
  button.dataset.id = task.id;
  return button;
}

// Crée la zone des boutons Modifier / Supprimer
function createCardButtons(task) {
  const actions = createElement("div", ["mt-auto", "d-flex", "gap-2"]);
  const editButton = createActionButton(task, ["btn-outline-primary", "btn-edit"], "Modifier");
  const deleteButton = createActionButton(task, ["btn-outline-danger", "btn-delete"], "Supprimer");
  actions.append(editButton, deleteButton);
  return actions;
}

// Construit et retourne la carte complète d'une tâche (modèle 1.6)
function createTaskCard(task) {
  const column = createElement("div", ["col-12", "col-md-6", "col-lg-4"]);
  const card = createElement("div", ["card", "h-100", "shadow-sm", "task-card", "statut-" + task.statut]);
  const body = createElement("div", ["card-body", "d-flex", "flex-column"]);
  card.dataset.id = task.id;
  body.append(
    createCardHeader(task),
    createElement("p", ["card-text"], task.description),
    createCardDate(task),
    createCardButtons(task)
  );
  card.append(body);
  column.append(card);
  return column;
}

/* ---------- Étape 4 : afficher la liste (R2) ---------- */

// Affiche ou cache le message de liste vide
function toggleEmptyMessage(isEmpty) {
  if (isEmpty) {
    emptyMessage.classList.remove("d-none");
  } else {
    emptyMessage.classList.add("d-none");
  }
}

// Vide #taskList puis affiche une carte par tâche du tableau reçu
function renderTasks(tasksArray) {
  taskList.replaceChildren();
  toggleEmptyMessage(tasksArray.length === 0);
  tasksArray.forEach((task) => {
    taskList.append(createTaskCard(task));
  });
}

/* ---------- Étape 5 : filtre et recherche en temps réel (R5, R6) ---------- */

// Texte recherché, sans espaces autour et en minuscules
function getSearchText() {
  return searchInput.value.trim().toLowerCase();
}

// true si la tâche correspond au statut choisi ("all" = tous)
function matchesStatut(task, statut) {
  return statut === "all" || task.statut === statut;
}

// true si le titre ou la description contient le texte recherché
function matchesSearch(task, text) {
  const titre = task.titre.toLowerCase();
  const description = task.description.toLowerCase();
  return titre.includes(text) || description.includes(text);
}

// Retourne un nouveau tableau : tâches qui respectent le filtre ET la recherche
function getFilteredTasks() {
  const statut = statusFilter.value;
  const text = getSearchText();
  return getAllTasks().filter((task) => matchesStatut(task, statut) && matchesSearch(task, text));
}

// Affiche la liste filtrée (appelée après chaque action)
function refreshList() {
  renderTasks(getFilteredTasks());
}

/* ---------- Démarrage ---------- */

// Branche les écouteurs d'événements de la page
function bindEvents() {
  searchInput.addEventListener("input", refreshList);
  statusFilter.addEventListener("change", refreshList);
}

bindEvents();
refreshList();
