const mockTasks = [
  {
    id: 1762732800000,
    titre: "Créer le dépôt GitHub",
    description:
      "Initialiser le dépôt, inviter le binôme et créer une branche par personne.",
    statut: "terminee",
    date: "2026-11-10",
  },
  {
    id: 1762819200000,
    titre: "Structurer le HTML",
    description:
      "Formulaire avec labels, zone de recherche, filtres et conteneur des cartes.",
    statut: "terminee",
    date: "2026-11-11",
  },
];

const dictionnaire_statut = {
  "a-faire": "À faire",
  "en-cours": "En cours",
  "terminee": "Terminée",
  "bloquee": "Bloquée"
};
const color_statut = {
  "a-faire": "bg-secondary",
  "en-cours": "bg-warning",
  "terminee": "bg-success",
  "bloquee": "bg-danger",
};

const taskList = document.getElementById("taskList");

function createTaskCard(task){

    const carte = document.createElement("div");
    const titre = document.createElement("h3");
    titre.textContent = task.titre;
    const desc = document.createElement("p");
    desc.textContent = task.description;
    const statut = document.createElement("span");
    statut.classList.add("badge",color_statut[task.statut]);
    statut.textContent = dictionnaire_statut[task.statut];
    carte.append(statut, titre, desc);
    taskList.append(carte);

}
createTaskCard(mockTasks[0]);
createTaskCard(mockTasks[1]);








