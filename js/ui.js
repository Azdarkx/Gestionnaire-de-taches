/* ============================================================
   ui.js — Apprenant C : DOM dynamique, événements, filtre et recherche
   Aucune modification directe des données : on passe par tasks.js (B).
   ============================================================ */

/* ---------- Étape 6 : source des données (tableau tasks de B) ---------- */

// Seul point de lecture du tableau global : le mock a été remplacé ici
function getAllTasks() {
  return tasks;
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
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const titleError = document.getElementById("titleError");
const taskDesc = document.getElementById("taskDesc");
const taskStatus = document.getElementById("taskStatus");
const statusError = document.getElementById("statusError");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
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
  editButton.addEventListener("click", () => startEdit(task.id));
  deleteButton.addEventListener("click", () => handleDelete(task.id));
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

/* ---------- Messages d'erreur du formulaire ---------- */

// Affiche un message d'erreur et met son champ en rouge
function showFieldError(field, errorElement) {
  errorElement.classList.remove("d-none");
  field.classList.add("is-invalid");
  field.focus();
}

// Cache un message d'erreur et retire le rouge de son champ
function hideFieldError(field, errorElement) {
  errorElement.classList.add("d-none");
  field.classList.remove("is-invalid");
}

// Cache l'erreur du titre (appelée dès que l'utilisateur corrige)
function hideTitleError() {
  hideFieldError(taskTitle, titleError);
}

// Cache l'erreur du statut (appelée dès que l'utilisateur corrige)
function hideStatusError() {
  hideFieldError(taskStatus, statusError);
}

// Cache toutes les erreurs du formulaire
function hideFormErrors() {
  hideTitleError();
  hideStatusError();
}

/* ---------- Étapes 7 et 8 : ajout et modification (R1, R3) ---------- */

// Id de la tâche en cours de modification, ou null en mode ajout
let editingTaskId = null;

// Lit les valeurs saisies dans le formulaire
function getFormValues() {
  return {
    titre: taskTitle.value,
    description: taskDesc.value,
    statut: taskStatus.value
  };
}

// Ajoute ou modifie selon le mode du formulaire ; retourne true si B a accepté
function saveFormValues(values) {
  if (editingTaskId === null) {
    return addTask(values.titre, values.description, values.statut) !== false;
  }
  return updateTask(editingTaskId, values.titre, values.description, values.statut);
}

// Soumission du formulaire : validation, ajout ou modification, rafraîchissement
function handleSubmit(event) {
  event.preventDefault();
  const values = getFormValues();
  if (values.titre.trim() === "") {
    showFieldError(taskTitle, titleError);
    return;
  }
  if (!saveFormValues(values)) {
    showFieldError(taskStatus, statusError);
    return;
  }
  resetForm();
  refreshList();
}

// Pré-remplit le formulaire avec une tâche
function fillForm(task) {
  taskTitle.value = task.titre;
  taskDesc.value = task.description;
  taskStatus.value = task.statut;
}

// Passe le formulaire en mode édition pour la tâche demandée
function startEdit(id) {
  const task = getTaskById(id);
  if (!task) {
    return;
  }
  editingTaskId = task.id;
  fillForm(task);
  hideFormErrors();
  submitBtn.textContent = "Enregistrer";
  cancelEditBtn.classList.remove("d-none");
  taskTitle.focus();
}

// Vide le formulaire et revient en mode ajout
function resetForm() {
  taskForm.reset();
  editingTaskId = null;
  hideFormErrors();
  submitBtn.textContent = "Ajouter";
  cancelEditBtn.classList.add("d-none");
}

/* ---------- Étape 9 : suppression (R4) ---------- */

// Demande confirmation puis supprime la tâche via B
function handleDelete(id) {
  const task = getTaskById(id);
  if (!task || !confirm("Supprimer la tâche « " + task.titre + " » ?")) {
    return;
  }
  deleteTask(task.id);
  if (editingTaskId === task.id) {
    resetForm();
  }
  refreshList();
}

/* ---------- Démarrage ---------- */

// Branche les écouteurs d'événements de la page
function bindEvents() {
  taskForm.addEventListener("submit", handleSubmit);
  cancelEditBtn.addEventListener("click", resetForm);
  taskTitle.addEventListener("input", hideTitleError);
  taskStatus.addEventListener("change", hideStatusError);
  searchInput.addEventListener("input", refreshList);
  statusFilter.addEventListener("change", refreshList);
}

bindEvents();
resetForm();
refreshList();
