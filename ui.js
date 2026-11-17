
const mockTasks = [
  {
    id: 1762732800000,
    titre: "Créer le dépôt GitHub",
    description: "Initialiser le dépôt, inviter le binôme et créer une branche par personne.",
    statut: "terminee",
    date: "2026-11-10"
  },
  {
    id: 1762819200000,
    titre: "Structurer le HTML",
    description: "Formulaire avec labels, zone de recherche, filtres et conteneur des cartes.",
    statut: "terminee",
    date: "2026-11-11"
  }
];

const taskList = document.getElementById("taskList");

const premiereTache = mockTasks[0];
const carte = document.createElement("div");
carte.textContent = premiereTache.titre;
taskList.append(carte);




