/* ============================================================
   tasks.js — Apprenant B : données, validation, CRUD, localStorage
   Aucun accès au DOM dans ce fichier (rôle de C dans ui.js).
   ============================================================ */

/* ---------- Étape 1 : données et constantes ---------- */

// Clé unique utilisée pour enregistrer les tâches dans le localStorage
const STORAGE_KEY = "tasks";

// Les 4 statuts autorisés pour une tâche ("all" n'en fait pas partie)
const STATUTS_VALIDES = ["a-faire", "en-cours", "terminee", "bloquee"];

// Tableau global de toutes les tâches
let tasks = [];

/* ---------- Étape 2 : validation et utilitaires ---------- */

// Retourne true uniquement si le statut est l'un des 4 statuts autorisés
function isValidStatut(statut) {
  return STATUTS_VALIDES.includes(statut);
}

// Retourne true si le titre est une chaîne qui ne contient pas que des espaces
function isValidTitre(titre) {
  return typeof titre === "string" && titre.trim() !== "";
}

// Retourne true si le titre et le statut sont tous les deux valides
function isValidSaisie(titre, statut) {
  return isValidTitre(titre) && isValidStatut(statut);
}

// Retourne la description nettoyée, ou "" si elle n'est pas une chaîne
function cleanDescription(description) {
  return typeof description === "string" ? description.trim() : "";
}

// Retourne la date du jour au format AAAA-MM-JJ
function getTodayDate() {
  const today = new Date();
  const annee = today.getFullYear();
  const mois = String(today.getMonth() + 1).padStart(2, "0");
  const jour = String(today.getDate()).padStart(2, "0");
  return `${annee}-${mois}-${jour}`;
}

// Retourne un id numérique unique basé sur Date.now()
function generateId() {
  let id = Date.now();
  while (getTaskById(id)) {
    id++;
  }
  return id;
}

/* ---------- Étape 3 : persistance (R7) ---------- */

// Enregistre l'intégralité du tableau tasks dans le localStorage
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Retourne toujours un tableau : les tâches enregistrées, ou [] si rien ou données corrompues
function loadTasks() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

/* ---------- Étape 4 : ajout (R1) ---------- */

// Crée, ajoute et sauvegarde une tâche ; retourne la tâche créée, ou false si la saisie est invalide
function addTask(titre, description, statut) {
  if (!isValidSaisie(titre, statut)) {
    return false;
  }
  const task = {
    id: generateId(),
    titre: titre.trim(),
    description: cleanDescription(description),
    statut: statut,
    date: getTodayDate()
  };
  tasks.push(task);
  saveTasks();
  return task;
}

/* ---------- Étape 5 : recherche, modification, suppression (R3, R4) ---------- */

// Retourne la tâche dont l'id correspond (nombre ou chaîne), ou undefined
function getTaskById(id) {
  return tasks.find((task) => task.id === Number(id));
}

// Modifie titre, description et statut (jamais id ni date) ; retourne true ou false
function updateTask(id, nouveauTitre, nouvelleDesc, nouveauStatut) {
  const task = getTaskById(id);
  if (!task || !isValidSaisie(nouveauTitre, nouveauStatut)) {
    return false;
  }
  task.titre = nouveauTitre.trim();
  task.description = cleanDescription(nouvelleDesc);
  task.statut = nouveauStatut;
  saveTasks();
  return true;
}

// Supprime la tâche et sauvegarde ; retourne true si une tâche a vraiment été supprimée
function deleteTask(id) {
  const nombreAvant = tasks.length;
  tasks = tasks.filter((task) => task.id !== Number(id));
  if (tasks.length === nombreAvant) {
    return false;
  }
  saveTasks();
  return true;
}

/* ---------- Démarrage : recharge les tâches enregistrées (R7) ---------- */

tasks = loadTasks();
