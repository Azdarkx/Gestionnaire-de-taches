Collaborateur : 

   Moise 
   Farhan
   Melkior

# Gestionnaire de tâches

Application web qui permet de créer, modifier, supprimer, filtrer et rechercher des tâches. Les tâches sont sauvegardées dans le navigateur grâce au `localStorage`.

Projet réalisé en équipe de trois dans le cadre d'un TP, en **HTML, CSS (Bootstrap) et JavaScript pur** (sans framework, sans classe).

---

## Sommaire

1. [Présentation](#1-présentation)
2. [Lancer l'application](#2-lancer-lapplication)
3. [Technologies utilisées](#3-technologies-utilisées)
4. [Fonctionnalités R1 à R7](#4-fonctionnalités-r1-à-r7)
5. [Structure d'une tâche](#5-structure-dune-tâche)
6. [Fonctions de tasks.js](#6-fonctions-de-tasksjs)
7. [Fonctionnement du localStorage](#7-fonctionnement-du-localstorage)
8. [Filtres et recherche](#8-filtres-et-recherche)
9. [Recette (tests R1 à R7)](#9-recette-tests-r1-à-r7)
10. [Équipe et rôles](#10-équipe-et-rôles)
11. [Organisation Git](#11-organisation-git)
12. [Difficultés rencontrées et améliorations possibles](#12-difficultés-rencontrées-et-améliorations-possibles)

---

## 1. Présentation

*Partie rédigée par l'apprenant A.*

Le gestionnaire de tâches affiche un formulaire pour créer une tâche (titre, description, statut) et une liste de cartes. Chaque carte montre le titre, la description, la date de création et un badge coloré selon le statut. Une barre de recherche et un filtre par statut permettent de retrouver rapidement une tâche.

<!-- Capture d'écran : ajouter l'image dans le dépôt (ex. docs/capture.png) puis décommenter la ligne suivante -->
<!-- ![Capture d'écran de l'application](docs/capture.png) -->

## 2. Lancer l'application

*Partie rédigée par l'apprenant A.*

Aucune installation n'est nécessaire.

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/Azdarkx/Gestionnaire-de-taches.git
   ```
2. Ouvrir le dossier `Gestionnaire-de-taches`.
3. Ouvrir `index.html` dans un navigateur (double-clic),
   **ou** dans VS Code : clic droit sur `index.html` → *Open with Live Server*.

## 3. Technologies utilisées

*Partie rédigée par l'apprenant A.*

| Technologie | Utilisation |
|-------------|-------------|
| HTML5 | Structure de la page, formulaire accessible (un `label` par champ) |
| CSS3 + Bootstrap 5 | Mise en page, grille responsive, badges de statut |
| JavaScript pur | Données, CRUD, affichage des cartes, événements |
| localStorage | Sauvegarde des tâches dans le navigateur |
| Git / GitHub | Versionnage, branches, Pull Requests |

### Arborescence

```
Gestionnaire-de-taches/
├── index.html      # Structure de la page (A)
├── style.css       # Mise en forme (A)
├── js/
│   ├── tasks.js    # Données, validation, CRUD, localStorage (B)
│   └── ui.js       # DOM, événements, filtres, recherche (C)
└── README.md       # Documentation (équipe)
```

## 4. Fonctionnalités R1 à R7

*Partie rédigée par l'apprenant C.*

| Réf. | Fonctionnalité |
|------|----------------|
| R1 | Un formulaire (titre, description, statut) ajoute une tâche. Le titre est obligatoire : un titre vide ou composé d'espaces est refusé avec un message d'erreur. |
| R2 | Les tâches s'affichent en cartes générées en JavaScript (aucune carte écrite dans le HTML), avec un badge de couleur par statut. |
| R3 | Le bouton « Modifier » remplit le formulaire avec la tâche ; « Enregistrer » applique les changements, « Annuler » quitte le mode modification. |
| R4 | Le bouton « Supprimer » demande une confirmation puis retire la tâche. |
| R5 | Un filtre propose : toutes, à faire, en cours, terminées, bloquées. |
| R6 | La recherche porte sur le titre et la description, sans tenir compte des majuscules. |
| R7 | Les tâches sont enregistrées dans le `localStorage` et rechargées à l'ouverture de la page. |

### Statuts

| Libellé | Valeur | Badge |
|---------|--------|-------|
| À faire | `a-faire` | gris (`bg-secondary`) |
| En cours | `en-cours` | jaune (`bg-warning`) |
| Terminée | `terminee` | vert (`bg-success`) |
| Bloquée | `bloquee` | rouge (`bg-danger`) |

La valeur `all` (« Toutes ») n'existe que dans le filtre : elle n'est jamais enregistrée dans une tâche.

## 5. Structure d'une tâche

*Partie rédigée par l'apprenant B.*

Une tâche est un objet JavaScript. Toutes les tâches sont rangées dans le tableau global `tasks`.

```js
{
  id: 1718534400000,              // Number, généré avec Date.now()
  titre: "Faire les courses",     // String obligatoire, nettoyée avec trim()
  description: "Acheter du pain", // String, peut être vide ""
  statut: "a-faire",              // "a-faire" | "en-cours" | "terminee" | "bloquee"
  date: "2026-11-17"              // date de création au format AAAA-MM-JJ
}
```

| Propriété | Type | Règle |
|-----------|------|-------|
| `id` | nombre | Unique, créé avec `Date.now()`. Jamais modifié. |
| `titre` | chaîne | Obligatoire, sans espaces au début ni à la fin. |
| `description` | chaîne | Facultative : `""` si elle n'est pas fournie. |
| `statut` | chaîne | Une des 4 valeurs de `STATUTS_VALIDES`. |
| `date` | chaîne | Date du jour au format `AAAA-MM-JJ`. Jamais modifiée. |

## 6. Fonctions de tasks.js

*Partie rédigée par l'apprenant B.*

`js/tasks.js` est le « moteur de données » de l'application. Il ne touche jamais à la page (aucun `document`) : c'est `ui.js` qui appelle ces fonctions puis met l'affichage à jour.

| Fonction | Rôle | Retourne |
|----------|------|----------|
| `isValidStatut(statut)` | Vérifie que le statut est l'un des 4 statuts autorisés | `true` / `false` |
| `isValidTitre(titre)` | Refuse ce qui n'est pas une chaîne, une chaîne vide ou composée d'espaces | `true` / `false` |
| `isValidSaisie(titre, statut)` | Combine les deux validations | `true` / `false` |
| `cleanDescription(description)` | Enlève les espaces inutiles, renvoie `""` si absente | une chaîne |
| `getTodayDate()` | Donne la date du jour au format `AAAA-MM-JJ` | une chaîne |
| `generateId()` | Crée un identifiant numérique unique | un nombre |
| `addTask(titre, description, statut)` | Valide, crée la tâche, l'ajoute avec `push()` et sauvegarde | la tâche créée, ou `false` |
| `getTaskById(id)` | Cherche une tâche avec `find()` | la tâche, ou `undefined` |
| `updateTask(id, nouveauTitre, nouvelleDesc, nouveauStatut)` | Valide puis modifie titre, description et statut (jamais `id` ni `date`), sauvegarde | `true` / `false` |
| `deleteTask(id)` | Supprime la tâche avec `filter()` et sauvegarde | `true` si supprimée, sinon `false` |
| `saveTasks()` | Écrit `tasks` dans le `localStorage` | — |
| `loadTasks()` | Lit le `localStorage` | toujours un tableau |

Règles importantes :

- Les fonctions qui reçoivent un `id` acceptent un **nombre** ou une **chaîne** (par exemple `"1718534400000"` lu dans `dataset.id`) : l'id est converti avec `Number()` avant d'être comparé avec `===`.
- Toutes les fonctions qui modifient `tasks` **sauvegardent elles-mêmes** : `ui.js` n'a jamais besoin d'appeler `saveTasks()`.
- Une saisie invalide ne modifie jamais le tableau : la fonction retourne simplement `false`.

## 7. Fonctionnement du localStorage

*Partie rédigée par l'apprenant B.*

Le `localStorage` est un petit espace de stockage du navigateur qui conserve des données même après la fermeture de la page. Il ne stocke que du **texte**.

- **Clé utilisée :** `"tasks"` (définie une seule fois dans la constante `STORAGE_KEY`).
- **Sauvegarde :** `saveTasks()` transforme le tableau en texte avec `JSON.stringify(tasks)` puis l'enregistre avec `localStorage.setItem`.
- **Chargement :** `loadTasks()` lit le texte avec `localStorage.getItem` puis le retransforme en tableau avec `JSON.parse`.
  - S'il n'y a encore rien d'enregistré, elle retourne `[]` (grâce à `|| []`).
  - Si le contenu est corrompu (par exemple `"abc"`), le `try/catch` évite le plantage et elle retourne `[]`.
- **Au démarrage :** la dernière ligne de `tasks.js`, `tasks = loadTasks();`, recharge les tâches enregistrées (R7).

Pour voir les données : **F12 → Application → Local Storage →** la clé `tasks`.

## 8. Filtres et recherche

*Partie rédigée par l'apprenant C.*

- Le **filtre** (`#statusFilter`) garde uniquement les tâches dont le `statut` correspond à l'option choisie ; l'option `all` affiche toutes les tâches.
- La **recherche** (`#searchInput`) garde les tâches dont le titre **ou** la description contient le texte saisi, sans tenir compte des majuscules (`toLowerCase()`).
- Les deux s'appliquent **en même temps** : `getFilteredTasks()` applique le filtre puis la recherche et retourne un nouveau tableau, que `renderTasks()` affiche.
- Si aucune tâche ne correspond, le message `#emptyMessage` s'affiche.

## 9. Recette (tests R1 à R7)

*Tests réalisés ensemble sur `main`, après les trois fusions. Colonne « Résultat » à compléter (✅ / ❌).*

| Réf. | Test réalisé | Résultat attendu | Résultat |
|------|--------------|------------------|----------|
| R1 | Ajouter une tâche « Test » avec description et statut « En cours » | La carte apparaît, le formulaire se vide | |
| R1 | Valider avec un titre vide, puis avec seulement des espaces | Rien n'est ajouté, `#titleError` s'affiche | |
| R1 | Console : `addTask("X", "", "nimporte")` | Retourne `false`, rien n'est ajouté | |
| R2 | Créer une tâche de chaque statut | 4 badges de 4 couleurs différentes | |
| R2 | Ouvrir `index.html` dans l'éditeur | Aucune carte écrite en dur | |
| R3 | Modifier titre, description et statut, puis tester « Annuler » | Carte mise à jour / rien ne change après Annuler | |
| R4 | Supprimer une tâche (accepter puis refuser la confirmation) | Disparaît / reste | |
| R5 | Tester les 5 options du filtre | Seules les bonnes cartes s'affichent | |
| R6 | Chercher en MAJUSCULES un mot présent seulement dans une description | La tâche est trouvée | |
| R5+R6 | Recherche + filtre combinés, puis une recherche sans résultat | Les deux s'appliquent / `#emptyMessage` s'affiche | |
| R7 | Ajouter, modifier, supprimer, puis recharger (F5) | L'état est conservé | |
| R7 | Vider le `localStorage` et recharger | Liste vide + message, aucune erreur console | |
| Accès. | Naviguer au clavier (Tab) et cliquer sur chaque label | Chaque label met le focus sur son champ | |

### Tests unitaires de tasks.js (apprenant B)

Tous réalisés dans la console du navigateur (F12) : **12 / 12 réussis**, aucune erreur console.

| Appel | Résultat obtenu |
|-------|-----------------|
| `addTask("Faire les courses", "Acheter du pain", "a-faire")` | Objet à 5 propriétés ✅ |
| `addTask("   ", "vide", "a-faire")` | `false`, `tasks` inchangé ✅ |
| `addTask("Test", "", "fini")` | `false` ✅ |
| `addTask("Sans description", undefined, "en-cours")` | `description: ""` ✅ |
| `addTask("   Espaces   ", "", "a-faire")` | `titre: "Espaces"` ✅ |
| `getTaskById(String(tasks[0].id))` | La tâche ✅ |
| `updateTask(tasks[0].id, "Courses", "Pain + lait", "terminee")` | `true`, `id` et `date` inchangés ✅ |
| `updateTask(tasks[0].id, "", "x", "terminee")` | `false`, rien ne change ✅ |
| `updateTask(123, "X", "", "a-faire")` / `deleteTask(123)` | `false` / `false` ✅ |
| `localStorage.getItem("tasks")` | JSON identique à `tasks` ✅ |
| F5 puis `tasks` | Les tâches sont revenues ✅ |
| `localStorage.setItem("tasks", "abc")` puis F5 | `tasks` vaut `[]`, pas d'erreur ✅ |

## 10. Équipe et rôles

| Membre | GitHub | Rôle | Fichiers | Branche |
|--------|--------|------|----------|---------|
| Apprenant A | [@Azdarkx](https://github.com/Azdarkx) | Structure HTML, mise en forme CSS, intégration | `index.html`, `style.css` | `feature/ui-html-css` |
| Apprenant B | [@mangonte72-dotcom](https://github.com/mangonte72-dotcom) | Tableau de tâches, validation, CRUD, localStorage | `js/tasks.js` | `feature/core-crud-storage` |
| Apprenant C | [@farhanbello](https://github.com/farhanbello) | DOM, événements, affichage des cartes, filtres, recherche | `js/ui.js` | `feature/dom-events-filters` |
| Ensemble | — | Recette, corrections, README | `README.md` | `docs/readme` |

## 11. Organisation Git

- **Une branche par personne**, aucun développement directement sur `main`.
- **Contrat commun** fixé au départ : ID HTML, valeurs des statuts, propriétés d'une tâche et noms des fonctions. Toute modification est annoncée aux deux autres.
- **Ordre de fusion :** squelette HTML (A) → `tasks.js` (B) → `ui.js` (C) → README.
- **Pull Requests :** chaque branche est fusionnée dans `main` par une Pull Request relue par les deux autres membres, qui laissent au moins un commentaire.
- **Messages de commit :** `type: description courte`, avec `feat` (fonctionnalité), `fix` (correction), `style` (CSS), `docs` (README), `test`.
  Exemple : `feat: données, validation, CRUD et localStorage dans tasks.js`.
- Après chaque fusion : `git checkout main` puis `git pull`.

## 12. Difficultés rencontrées et améliorations possibles

*À compléter ensemble.*

### Difficultés rencontrées

- Respecter exactement le contrat commun entre les trois fichiers (noms des ID, valeurs des statuts) : un seul nom différent suffit à casser l'assemblage.
- Les id lus dans le HTML sont des chaînes alors que les id des tâches sont des nombres : il a fallu les convertir avec `Number()`.
- Prise en main de Git en équipe : branches, Pull Requests, fusions et récupération du travail des autres.

### Améliorations possibles

- Ajouter une date d'échéance et trier les tâches par date ou par statut.
- Permettre de changer le statut directement depuis la carte.
- Afficher un compteur de tâches par statut.
- Ajouter un mode sombre.
