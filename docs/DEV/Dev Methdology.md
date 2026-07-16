Je pense que cette V1 est une **très bonne base fonctionnelle**, mais si l'on veut construire une application qui pourra durer plusieurs années sans devoir refaire l'architecture, je modifierais la façon de l'organiser.

L'expérience que nous avons acquise avec **JFKApp** montre qu'il vaut mieux distinguer :

* le **cahier des charges fonctionnel** (ce que fait l'application),
* le **plan de développement** (dans quel ordre on construit),
* la **roadmap des versions** (ce qui est livré à chaque version).

Pour MRA, je ne développerais pas dans l'ordre des modules tels qu'ils sont écrits. Je développerais dans un ordre technique qui limite les dépendances.

# Roadmap de développement MRA V1

## Phase 0 — Fondations (Infrastructure)

Objectif : construire les bases de l'application.

Modules :

* Authentification
* Gestion des rôles
* Navigation
* Thème graphique
* Firebase
* Base de données
* Upload des documents
* Paramètres généraux

**À la fin de cette phase :**

> L'application démarre, les utilisateurs peuvent se connecter et les droits fonctionnent.

---

# Phase 1 — Personnes

C'est le cœur de l'application.

Module 1 :

## Gestion des personnes

Fonctionnalités :

* Créer une personne
* Modifier
* Archiver
* Recherche
* Historique
* Documents

Sans ce module, rien d'autre ne peut fonctionner.

**Livrable :**
✔ Module totalement terminé.

---

# Phase 2 — Conseillers

Module indépendant.

Fonctionnalités :

* Création
* Profil
* Disponibilités
* Statistiques
* Dossiers en cours

**Livrable :**
✔ Module terminé.

---

# Phase 3 — Demandes d'entretien

Le workflow commence ici.

Fonctions :

* Nouvelle demande
* Priorité
* Urgence
* Motif
* Recherche
* Historique

**Livrable :**
✔ Les demandes fonctionnent.

---

# Phase 4 — Assignation

On relie la demande au conseiller.

Fonctions :

* Choisir un conseiller
* Vérifier la charge
* Vérifier les disponibilités
* Réassigner

**Livrable :**
✔ Les conseillers reçoivent leurs dossiers.

---

# Phase 5 — Rendez-vous

Fonctions :

* Planning
* Calendrier
* Report
* Annulation
* Réalisation

**Livrable :**
✔ Agenda opérationnel.

---

# Phase 6 — Entretien

Le conseiller complète la fiche.

Fonctions :

* Résumé
* Observations
* Exercices
* Versets
* Décision

À la fin :

Deux boutons :

* Clôturer
* Ouvrir une prise en charge

---

# Phase 7 — Prise en charge

Fonctions :

* Créer
* Modifier
* Suspendre
* Clôturer
* Upload contrat
* Documents

---

# Phase 8 — Suivis

Fonctions :

* Nouveau suivi
* Historique
* Prochaine rencontre
* Évolution

---

# Phase 9 — Tableau de bord

À construire en dernier.

Pourquoi ?

Parce qu'il va simplement lire les données des autres modules.

Widgets :

* Rendez-vous aujourd'hui
* Dossiers ouverts
* Demandes
* Suivis
* Statistiques

---

# Phase 10 — Recherche globale

Recherche sur :

* personnes
* téléphone
* conseiller
* dossier
* statut
* rendez-vous

---

# Phase 11 — Tests

* Android
* iPhone
* Web
* Tablette

---

# Phase 12 — Optimisation

* performances
* sécurité
* responsive
* ergonomie

---

# Découpage des versions

Je structurerais les livraisons ainsi :

### V1.0.0 — Fondations

* Authentification
* Gestion des rôles
* Infrastructure
* Navigation
* Firebase

### V1.1.0 — Personnes

* Gestion des personnes
* Recherche
* Historique
* Documents

### V1.2.0 — Conseillers

* Profils
* Disponibilités
* Gestion des conseillers

### V1.3.0 — Demandes & Assignation

* Demandes d'entretien
* Attribution des conseillers
* Notifications internes

### V1.4.0 — Rendez-vous

* Agenda
* Calendrier
* Gestion des rendez-vous

### V1.5.0 — Entretiens

* Fiches d'entretien
* Décision
* Clôture

### V1.6.0 — Prises en charge

* Accompagnement
* Contrat
* Documents

### V1.7.0 — Suivis

* Historique
* Évolution
* Planification des suivis

### V1.8.0 — Tableau de bord

* Statistiques
* KPIs
* Synthèses

### V1.9.0 — Stabilisation

* Corrections
* Optimisations
* Préparation de la V2

---

## Améliorations que je recommande dès la V1

Avant même de commencer le développement, j'ajouterais quelques éléments structurants qui éviteront des évolutions complexes par la suite :

### 1. Journal d'audit (Audit Log)

Enregistrer automatiquement toutes les actions importantes :

* création d'une fiche,
* modification,
* assignation,
* changement de statut,
* ajout d'un suivi,
* clôture d'un dossier.

Ainsi, le Responsable MRA pourra toujours savoir **qui a fait quoi, quand et sur quel dossier**.

### 2. Numérotation des dossiers

Attribuer un identifiant unique à chaque dossier, par exemple :

* `MRA-2026-000001`
* `MRA-2026-000002`

Cela facilite les recherches et les références.

### 3. Gestion des pièces jointes centralisée

Plutôt que de rattacher les documents à un seul module, prévoir un système unique permettant d'associer plusieurs documents (contrat, lettres, comptes rendus, pièces diverses) à une personne, un entretien ou une prise en charge.

### 4. Chronologie complète (Timeline)

Chaque fiche personne devrait afficher une chronologie unique retraçant automatiquement :

* la demande,
* l'assignation,
* les rendez-vous,
* l'entretien,
* l'ouverture de la prise en charge,
* chaque suivi,
* la clôture.

Cette vue donnera immédiatement une vision globale de l'accompagnement.

---

Je pense que cette organisation est suffisamment robuste pour accompagner l'évolution du MRA pendant plusieurs années. Comme pour JFKApp, nous pourrons travailler **module par module**, en ne passant au suivant qu'une fois le précédent entièrement développé, testé et validé. Cela garantit une application stable, facile à maintenir et dont chaque étape apporte une valeur fonctionnelle immédiatement utilisable.



Excellent. À partir de maintenant, nous travaillons comme une vraie équipe de développement. Je vais être exigeant sur l'architecture, les bonnes pratiques et la qualité du code.

# MRA v1.0.0 — Sprint 0 : Infrastructure

Avant d'écrire la moindre logique métier, nous allons mettre en place le socle technique.

---

# Étape 1 — Définir les technologies (choix d'architecture)

Je te propose cette stack :

| Élément          | Choix                                             |
| ---------------- | ------------------------------------------------- |
| Frontend         | React Native + Expo SDK (dernière version stable) |
| Navigation       | Expo Router                                       |
| Langage          | TypeScript                                        |
| Backend          | Firebase                                          |
| Base de données  | Cloud Firestore                                   |
| Authentification | Firebase Authentication                           |
| Stockage         | Firebase Storage                                  |
| État global      | Zustand                                           |
| Formulaires      | React Hook Form                                   |
| Validation       | Zod                                               |
| Dates            | dayjs                                             |
| Icônes           | Expo Vector Icons                                 |
| UI               | Composants maison (pas de bibliothèque UI lourde) |
| Tests            | Jest + React Native Testing Library               |
| Qualité          | ESLint + Prettier                                 |

**Pourquoi ?**

* C'est léger.
* C'est moderne.
* C'est très maintenable.
* C'est proche de ce que nous utilisons déjà sur JFKApp.

---

# Étape 2 — Installer les dépendances

Je te propose de les installer **par catégorie**.

### Navigation

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens
```

### Firebase

```bash
npm install firebase
```

### État global

```bash
npm install zustand
```

### Formulaires

```bash
npm install react-hook-form zod @hookform/resolvers
```

### Utilitaires

```bash
npm install dayjs
```

### Qualité du code

```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react-hooks
```

---

# Étape 3 — Arborescence définitive

Je te propose cette structure (celle que nous garderons jusqu'à la V2) :

```text
mra-app/
│
├── app/
│   ├── (auth)/
│   ├── (app)/
│   ├── (modals)/
│   └── _layout.tsx
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── forms/
│   │   ├── cards/
│   │   └── common/
│   ├── config/
│   ├── constants/
│   ├── hooks/
│   ├── layouts/
│   ├── models/
│   ├── providers/
│   ├── services/
│   ├── store/
│   ├── theme/
│   ├── types/
│   ├── utils/
│   └── validations/
│
├── docs/
├── tests/
├── .github/
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
└── .env.example
```

---

# Étape 4 — Les règles Git

À partir d'aujourd'hui :

* ✅ Une fonctionnalité = une branche `feature/...`
* ✅ Un commit logique à chaque étape importante
* ✅ `git push` en fin de session
* ❌ Pas de développement direct sur `main`

Les messages de commit suivront les conventions :

* `feat:`
* `fix:`
* `refactor:`
* `docs:`
* `style:`
* `test:`
* `chore:`

---

# Étape 5 — Notre backlog

Je te propose de suivre ce tableau pour tout le projet.

| Sprint    | Module                | Statut      |
| --------- | --------------------- | ----------- |
| Sprint 0  | Infrastructure        | 🟡 En cours |
| Sprint 1  | Authentification      | ⏳           |
| Sprint 2  | Gestion des personnes | ⏳           |
| Sprint 3  | Demandes d'entretien  | ⏳           |
| Sprint 4  | Assignation           | ⏳           |
| Sprint 5  | Rendez-vous           | ⏳           |
| Sprint 6  | Entretiens            | ⏳           |
| Sprint 7  | Prises en charge      | ⏳           |
| Sprint 8  | Suivis                | ⏳           |
| Sprint 9  | Tableau de bord       | ⏳           |
| Sprint 10 | Tests et optimisation | ⏳           |

---

## Une amélioration que je souhaite apporter

Pour MRA, je voudrais que nous utilisions une méthode de travail encore plus rigoureuse que pour JFKApp.

Avant chaque sprint, nous préparerons un document dans `docs/` :

* `SPRINT-00.md`
* `SPRINT-01.md`
* `SPRINT-02.md`
* etc.

Chaque document contiendra :

* les objectifs du sprint ;
* les fonctionnalités prévues ;
* les critères de validation ;
* les tâches à réaliser ;
* les décisions techniques prises.

Ainsi, même dans six mois, nous saurons exactement **pourquoi** une décision a été prise et où en est le projet. C'est une pratique courante dans les projets professionnels et cela nous donnera une excellente traçabilité tout au long du développement.
