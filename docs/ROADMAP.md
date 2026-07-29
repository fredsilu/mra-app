Je resterais dans la même philosophie que les autres documents : **court, concret, figé et orienté métier**. Une roadmap n'est pas une liste de toutes les fonctionnalités possibles, mais un plan de réalisation.

---

# ROADMAP.md

# MRA – Feuille de route du projet

**Version :** 1.0
**Statut :** Validé

---

# 1. Objectif

Cette feuille de route décrit les différentes phases de développement du projet MRA.

L'objectif est de construire progressivement une application simple, robuste et fidèle au fonctionnement du Ministère de la Relation d'Aide.

Chaque phase doit produire une application fonctionnelle avant de passer à la suivante.

---

# 2. Principes

Le développement suit les principes suivants :

* privilégier les fonctionnalités utiles avant les fonctionnalités avancées ;
* livrer des modules complets plutôt que plusieurs modules inachevés ;
* conserver une architecture simple et évolutive ;
* tester chaque phase avant de passer à la suivante.

---

# 3. Phase 1 – Fondations

## Objectif

Mettre en place l'infrastructure technique de l'application.

### Modules

* Authentification
* Gestion des utilisateurs
* Gestion des rôles
* Dashboard
* Navigation
* Firestore
* Firebase Storage
* Numérotation automatique

### Résultat attendu

L'application est utilisable avec des utilisateurs authentifiés.

---

# 4. Phase 2 – Personnes

## Objectif

Créer la base de toutes les informations du MRA.

### Modules

* Liste des personnes
* Création
* Modification
* Consultation
* Recherche
* Pièces jointes

### Résultat attendu

Toutes les personnes sont enregistrées dans une base unique.

---

# 5. Phase 3 – Demandes

## Objectif

Gérer les sollicitations de relation d'aide.

### Modules

* Création d'une demande
* Affectation d'un conseiller
* Consultation
* Recherche
* Historique

### Résultat attendu

Chaque demande est correctement enregistrée et affectée.

---

# 6. Phase 4 – Agenda

## Objectif

Planifier les rencontres.

### Modules

* Rendez-vous
* Calendrier
* Gestion des disponibilités
* Historique des rendez-vous

### Résultat attendu

Les rendez-vous sont planifiés et consultables.

---

# 7. Phase 5 – Entretiens

## Objectif

Enregistrer les entretiens réalisés.

### Modules

* Création d'un entretien
* Consultation
* Modification
* Recherche
* Pièces jointes

### Résultat attendu

Les conseillers peuvent enregistrer les entretiens réalisés, qu'ils soient avant ou pendant la prise en charge.

---

# 8. Phase 6 – Contrats

## Objectif

Formaliser la prise en charge.

### Modules

* Génération du contrat
* Signature
* Archivage
* Consultation

### Résultat attendu

Le contrat est enregistré et peut être consulté à tout moment.

---

# 9. Phase 7 – Dossiers

## Objectif

Gérer les prises en charge.

### Modules

* Ouverture d'un dossier
* Consultation
* Modification
* Clôture

### Résultat attendu

Les dossiers deviennent le point central de l'accompagnement.

---

# 10. Phase 8 – Activités du dossier

## Objectif

Suivre l'accompagnement de la personne.

### Modules

* Entretiens
* Suivis
* Notes
* Recommandations

### Résultat attendu

Toutes les activités de prise en charge sont historisées.

---

# 11. Phase 9 – Documents

## Objectif

Centraliser tous les documents.

### Modules

* Pièces jointes
* Contrats
* Documents divers
* Téléchargement
* Consultation

### Résultat attendu

Tous les documents sont accessibles depuis l'application.

---

# 12. Phase 10 – Tableaux de bord et rapports

## Objectif

Fournir des indicateurs de pilotage.

### Modules

* Statistiques
* Tableaux de bord
* Rapports
* Export

### Résultat attendu

Les responsables disposent d'une vision globale de l'activité du MRA.

---

# 13. Phase 11 – Optimisation

## Objectif

Préparer la version de production.

### Travaux

* Optimisation des performances
* Sécurité
* Tests
* Corrections
* Documentation
* Formation des utilisateurs

### Résultat attendu

Une application stable, performante et prête à être déployée.

---

# 14. Critères de validation

Une phase est considérée comme terminée lorsque :

* toutes les fonctionnalités prévues sont développées ;
* les tests sont validés ;
* la documentation est mise à jour ;
* aucune anomalie bloquante n'est présente.

---

# 15. Vision du projet

Le développement du MRA suit une progression simple et pragmatique.

Chaque phase apporte une valeur métier immédiate tout en préparant les évolutions futures.

L'objectif n'est pas de développer toutes les fonctionnalités possibles, mais de construire un outil fiable, simple d'utilisation et fidèle au fonctionnement du Ministère de la Relation d'Aide.

---

## Une seule modification que je proposerais

Je remplacerais **"Phase 8 – Activités du dossier"** par **"Phase 8 – Accompagnement"**.

En effet, le mot *activité* est un terme technique. Les conseillers, eux, parlent d'**accompagnement**.

La feuille de route deviendrait alors plus naturelle :

* Phase 5 – Entretiens
* Phase 6 – Contrats
* Phase 7 – Dossiers
* **Phase 8 – Accompagnement**

  * Entretiens
  * Suivis
  * Notes
  * Recommandations

Je trouve que cette terminologie est plus proche du vocabulaire du ministère tout en restant suffisamment générale pour accueillir de nouvelles formes d'accompagnement à l'avenir.



Oui. Ton arborescence contient encore des éléments de l’ancienne architecture. Voici le nettoyage à faire **sans casser l’application**.

## À supprimer maintenant

### 1. Le module `decisions`

```text
app/(app)/decisions/
```

La décision métier se déroule désormais en dehors de l’application. Nous avons supprimé le module `Decision` de l’architecture.

Supprime également, s’ils existent :

```text
src/features/decisions/
src/services/decision.service.ts
src/types/decision.types.ts
```

Et retire les liens vers `/decisions` dans le menu ou le dashboard.

---

### 2. Le doublon `agenda`

Tu as actuellement :

```text
app/(app)/agenda/
app/(app)/appointments/
```

Il ne faut garder qu’un seul module.

Nous avons retenu :

```text
app/(app)/appointments/
```

Tu peux donc supprimer :

```text
app/(app)/agenda/
```

Avant suppression, vérifie seulement qu’il n’y a pas un écran calendrier unique dans `agenda`. S’il existe, déplace-le dans :

```text
app/(app)/appointments/calendar.tsx
```

Puis supprime `agenda`.

---

### 3. Le dossier `src/people`

Tu as :

```text
src/people/
src/features/people/
```

Cela crée un doublon.

La bonne localisation est :

```text
src/features/people/
```

Déplace d’abord dans `src/features/people` tout fichier utile encore présent dans :

```text
src/people/
```

Puis supprime :

```text
src/people/
```

---

## À supprimer si ces dossiers correspondent à l’ancienne logique

### `logistics`

```text
app/(app)/logistics/
```

Le module `logistics` n’apparaît pas dans l’architecture validée :

```text
Personnes
Demandes
Rendez-vous
Entretiens
Contrats
Dossiers
Accompagnement
Utilisateurs
```

Tu peux donc le supprimer **s’il ne contient que d’anciens écrans de test ou de démonstration**.

S’il contient la gestion pratique des salles, disponibilités ou lieux, ne le supprime pas immédiatement : ces éléments pourront être intégrés plus tard au module `appointments`.

---

## Concernant `counselors`

Tu as :

```text
app/(app)/counselors/
```

Je ne le supprimerais pas immédiatement.

Les conseillers sont probablement des utilisateurs ayant un rôle particulier. La logique finale devrait être :

```text
users
  └── role: counselor
```

Il n’est donc pas nécessaire d’avoir une collection Firestore `counselors`.

Mais un écran :

```text
/counselors
```

peut rester utile pour afficher uniquement les utilisateurs qui sont conseillers.

Tu peux garder le dossier, mais il devra utiliser les données de `users` :

```ts
users.filter((user) => user.role === 'counselor')
```

Il ne doit pas devenir un deuxième système de gestion des personnes.

---

# Ce que tu dois garder dans `app/(app)`

L’arborescence cible devrait être :

```text
app/
│
├── (app)/
│   ├── people/
│   ├── requests/
│   ├── appointments/
│   ├── interviews/
│   ├── contracts/
│   ├── cases/
│   ├── counselors/
│   ├── users/
│   ├── dashboard.tsx
│   └── _layout.tsx
│
├── (auth)/
│
├── access-denied.tsx
├── index.tsx
└── _layout.tsx
```

Je ne vois pas encore `contracts` dans ta capture. Il faudra le créer lorsque nous développerons ce module.

Le dossier `cases` contiendra ensuite les écrans d’accompagnement liés au dossier. Il n’est pas nécessaire de créer immédiatement un dossier séparé `case-activities`.

---

# Ce que tu dois garder dans `src`

```text
src/
│
├── assets/
├── components/
├── config/
├── constants/
├── contexts/
├── features/
├── navigation/
├── permissions/
└── theme/
```

Cette structure est correcte.

À l’intérieur de `features`, nous irons progressivement vers :

```text
src/features/
│
├── people/
├── requests/
├── appointments/
├── interviews/
├── contracts/
├── cases/
├── users/
└── counters/
```

---

## Concernant `src/navigation`

Comme tu utilises **Expo Router**, le routage principal se trouve déjà dans :

```text
app/
```

Tu peux conserver `src/navigation` uniquement s’il contient :

* la configuration du menu ;
* les intitulés des routes ;
* les icônes ;
* les éléments visibles selon les rôles.

Par exemple :

```text
src/navigation/menu-items.ts
```

S’il contient un ancien système basé sur :

```ts
createStackNavigator
createBottomTabNavigator
NavigationContainer
```

alors il faudra le supprimer, car Expo Router gère déjà la navigation.

---

# Nettoyage recommandé

## Suppression certaine

```text
app/(app)/decisions/
app/(app)/agenda/
src/people/
src/features/decisions/       si présent
```

## Suppression probable

```text
app/(app)/logistics/
```

Seulement après vérification de son contenu.

## À garder pour le moment

```text
app/(app)/counselors/
src/navigation/
src/permissions/
```

Nous les réviserons plutôt que de les supprimer.

---

## Arborescence finale immédiate

```text
mra-app/
│
├── app/
│   ├── (app)/
│   │   ├── appointments/
│   │   ├── cases/
│   │   ├── counselors/
│   │   ├── interviews/
│   │   ├── people/
│   │   ├── requests/
│   │   ├── users/
│   │   ├── dashboard.tsx
│   │   └── _layout.tsx
│   ├── (auth)/
│   ├── access-denied.tsx
│   ├── index.tsx
│   └── _layout.tsx
│
└── src/
    ├── assets/
    ├── components/
    ├── config/
    ├── constants/
    ├── contexts/
    ├── features/
    ├── navigation/
    ├── permissions/
    └── theme/
```

Avant chaque suppression, fais un commit de sauvegarde :

```bash
git add .
git commit -m "backup before architecture cleanup"
```

Puis, après le nettoyage :

```bash
git add .
git commit -m "remove obsolete decision and agenda modules"
```



# Point d’avancement — Application MRA

## 1. Architecture métier figée

L’architecture fonctionnelle ne doit plus être redessinée.

```text
Personne
→ Demande
→ Affectation
→ Rendez-vous
→ Entretien
├── Fin du parcours
└── Si accompagnement nécessaire
      → Contrat
      → Dossier
      → Activités du dossier
```

Règles structurantes :

```text
1 personne → plusieurs demandes
1 personne → plusieurs rendez-vous
1 rendez-vous → 0 ou 1 entretien
1 entretien → 0 ou 1 contrat
1 demande → au maximum 1 contrat
1 demande → au maximum 1 dossier
un dossier ne peut pas exister sans demande
le contrat doit précéder la création du dossier
aucune suppression physique des données métier
```

Collections Firestore prévues :

```text
people
requests
appointments
interviews
contracts
cases
case_activities
case_history
attachments
users
counters
```

Architecture technique figée :

```text
src/features/
  module/
    module.types.ts
    module.service.ts
    components/
```

Règle technique :

```text
Écrans → Services → Firestore
```

Les écrans ne doivent jamais accéder directement à Firestore.

---

# 2. Modules déjà validés

## A. People

Statut :

```text
Validé
```

Le module Personnes est considéré comme terminé dans le parcours actuel.

---

## B. Requests

Statut :

```text
Validé
```

La demande constitue le point de départ du parcours d’aide.

La demande contient notamment l’affectation du conseiller.

---

## C. Appointments

Statut :

```text
Validé
```

Cycle de vie conservé :

```ts
scheduled
confirmed
completed
cancelled
no_show
```

L’entretien ne pilote pas automatiquement ce cycle.

Les actions du rendez-vous restent distinctes :

```text
confirmer
marquer absent
annuler
créer ou consulter l’entretien
```

---

# 3. Module Interviews — terminé ou presque terminé

## Modèle métier figé

L’entretien n’a pas de cycle de vie.

Il s’agit uniquement d’un compte rendu lié à un rendez-vous.

```text
1 rendez-vous → 0 ou 1 entretien
```

Opérations autorisées :

```text
créer
afficher
modifier
```

Concepts supprimés :

```text
start interview
interview in progress
complete interview
status
startedAt
endedAt
completedAt
completeInterview()
```

## Fichiers traités

### `src/features/interviews/interview.types.ts`

Modèle retenu :

```ts
export interface Interview {
  id: string;
  interviewNumber: string;

  appointmentId: string;
  requestId: string;

  personId: string;
  personName: string;

  counselorId: string;
  counselorName: string;

  summary?: string;
  observations?: string;
  recommendations?: string;

  createdAt: Timestamp;
  createdBy: string;
  createdByName?: string;

  updatedAt?: Timestamp;
}
```

Types de création et de mise à jour également simplifiés.

---

### `src/features/interviews/interview.service.ts`

Fonctions conservées :

```ts
getInterviews()
getInterview()
getInterviewByAppointmentId()
createInterview()
updateInterview()
```

Règles intégrées :

```text
un seul entretien par rendez-vous
rendez-vous obligatoire
rendez-vous confirmé ou réalisé
cohérence appointment/request/person/counselor
génération du numéro MRA-I-XXXXXX
liaison appointment.interviewId
```

---

### `app/(app)/interviews/index.tsx`

Nettoyé pour ne plus afficher :

```text
status
startedAt
INTERVIEW_STATUS_LABELS
```

Affichage prévu :

```text
numéro entretien
personne
conseiller
date de création
```

---

### `app/(app)/interviews/form.tsx`

Refactorisé.

Ancienne logique supprimée :

```text
Démarrer l’entretien
Commencer l’entretien
startedAt
```

Nouvelle logique :

```text
Créer l’entretien
```

Conditions :

```text
rendez-vous confirmed ou completed
pas d’entretien existant
conseiller affecté, responsable ou adjoint
```

---

### `app/(app)/interviews/[id].tsx`

Refactorisé pour ne gérer que :

```text
affichage
résumé
observations
recommandations
enregistrement
navigation vers le rendez-vous
```

Aucun cycle de vie d’entretien.

---

### `src/features/appointments/components/AppointmentActions.tsx`

Correction finale :

```text
Démarrer l’entretien
```

remplacé par :

```text
Créer l’entretien
```

Logique conservée :

```text
si interviewId existe → Voir l’entretien
sinon → Créer l’entretien
```

Le bouton est disponible pour :

```ts
confirmed
completed
```

## Statut du module Interviews

```text
Fonctionnellement terminé
```

Dernière vérification recommandée :

```bash
npx tsc --noEmit
```

---

# 4. Module Contracts — démarré

## Rôle métier

Le contrat formalise la décision d’accompagnement prise après l’entretien.

```text
Entretien
→ Contrat
→ Dossier
```

Il n’est pas obligatoire pour tous les entretiens.

```text
1 entretien → 0 ou 1 contrat
```

## Règles décidées

```text
un contrat exige un entretien existant
un contrat exige une demande existante
un entretien ne peut avoir qu’un seul contrat
une demande ne peut avoir qu’un seul contrat
le contrat précède obligatoirement le dossier
aucune suppression physique
```

---

## `src/features/contracts/contract.types.ts`

Créé ou à créer avec cette structure :

```ts
export type ContractStatus =
  | 'active'
  | 'completed'
  | 'cancelled';
```

Le contrat contient :

```text
contractNumber
interviewId
appointmentId
requestId
personId
personName
counselorId
counselorName
objective
commitments
duration
status
startDate
endDate
createdAt
createdBy
updatedAt
updatedBy
```

Statuts :

```text
active
completed
cancelled
```

Ici, un statut est pertinent car le contrat possède réellement une durée de vie métier.

---

## `src/features/contracts/contract.service.ts`

Code proposé.

Fonctions prévues :

```ts
getContracts()
getContract()
getContractByInterviewId()
getContractByRequestId()
createContract()
updateContract()
```

Règles intégrées dans le service :

```text
1 entretien → 0 ou 1 contrat
1 demande → 0 ou 1 contrat
validation de l’entretien
validation de la demande
cohérence interview/request/appointment/person/counselor
génération du numéro MRA-C-XXXXXX
```

Liaisons Firestore prévues lors de la création :

```text
interviews/{interviewId}.contractId
requests/{requestId}.contractId
```

Statut initial :

```ts
status: 'active'
```

Date initiale :

```ts
startDate: serverTimestamp()
```

## Point à vérifier

Il faut vérifier que les types `Interview` et `Request` autorisent bien les champs optionnels :

```ts
contractId?: string;
```

Même si Firestore accepte ces champs sans modification des interfaces, il est préférable de les déclarer pour les écrans et les services futurs.

---

# 5. Roadmap immédiate

## Étape 1 — Valider TypeScript

Lancer :

```bash
npx tsc --noEmit
```

Corriger toutes les erreurs avant de poursuivre.

Priorité absolue :

```text
aucune erreur TypeScript
```

---

## Étape 2 — Finaliser le service Contracts

Vérifier :

```text
contract.types.ts créé
contract.service.ts créé
imports corrects
aucune erreur TypeScript
```

Tester au minimum :

```text
création d’un contrat
blocage d’un second contrat pour le même entretien
blocage d’un second contrat pour la même demande
lecture d’un contrat
modification d’un contrat
```

---

## Étape 3 — Créer l’écran de formulaire du contrat

Fichier :

```text
app/(app)/contracts/form.tsx
```

Fonctionnement attendu :

```text
reçoit interviewId
cherche l’entretien
vérifie si un contrat existe déjà
si oui → ouvre le contrat
sinon → affiche le formulaire
```

Champs :

```text
objectif de l’accompagnement
engagements
durée prévue
```

Données reprises automatiquement :

```text
interviewId
appointmentId
requestId
personId
personName
counselorId
counselorName
createdBy
createdByName
```

---

## Étape 4 — Créer l’écran détail du contrat

Fichier :

```text
app/(app)/contracts/[id].tsx
```

Fonctions :

```text
afficher le contrat
modifier l’objectif
modifier les engagements
modifier la durée
modifier les dates
modifier le statut
ouvrir l’entretien
ouvrir la demande
```

---

## Étape 5 — Créer la liste des contrats

Fichier :

```text
app/(app)/contracts/index.tsx
```

Affichage :

```text
numéro du contrat
personne
conseiller
statut
date de création
```

Filtres futurs possibles :

```text
actifs
terminés
annulés
par conseiller
par personne
```

---

## Étape 6 — Intégrer Contracts dans Interviews

Dans :

```text
app/(app)/interviews/[id].tsx
```

Ajouter une logique :

```text
si contractId existe
→ bouton Voir le contrat

sinon
→ bouton Créer un contrat d’accompagnement
```

Le bouton de création ne doit pas apparaître automatiquement comme une obligation métier. Il représente la décision qu’un accompagnement est nécessaire.

---

## Étape 7 — Intégrer Contracts dans Requests

Dans :

```text
app/(app)/requests/[id].tsx
```

Afficher :

```text
contrat associé
dossier associé
```

Navigation :

```text
Voir le contrat
Voir le dossier
```

---

# 6. Module Cases — étape suivante après Contracts

## Règle fondamentale

```text
Aucun dossier sans contrat
```

Parcours :

```text
Request
→ Interview
→ Contract
→ Case
```

## Types à créer

```text
src/features/cases/case.types.ts
```

Structure probable :

```text
caseNumber
contractId
requestId
personId
personName
counselorId
counselorName
title
objective
status
openedAt
closedAt
createdAt
createdBy
updatedAt
```

Statuts envisageables :

```text
open
suspended
closed
cancelled
```

Ils devront être validés avant implémentation.

---

## Service à créer

```text
src/features/cases/case.service.ts
```

Fonctions probables :

```ts
getCases()
getCase()
getCaseByRequestId()
getCaseByContractId()
createCase()
updateCase()
```

Règles :

```text
un contrat obligatoire
une demande au maximum un dossier
un contrat au maximum un dossier
aucune suppression physique
```

---

## Écrans Cases

```text
app/(app)/cases/index.tsx
app/(app)/cases/form.tsx
app/(app)/cases/[id].tsx
```

---

# 7. Activités du dossier

Après création du dossier :

```text
toute activité d’accompagnement appartient au dossier
```

Collection :

```text
case_activities
```

Types d’activités à définir plus tard, par exemple :

```text
appel
entretien de suivi
visite
prière
orientation
assistance sociale
réunion
note interne
autre
```

Fichiers futurs :

```text
src/features/case-activities/case-activity.types.ts
src/features/case-activities/case-activity.service.ts
```

Ou, selon la convention retenue :

```text
src/features/cases/case-activity.types.ts
src/features/cases/case-activity.service.ts
```

Il faudra choisir une seule organisation et la conserver.

---

# 8. Historique du dossier

Collection prévue :

```text
case_history
```

Objectif :

```text
tracer les changements importants
statut
affectation
contrat
fermeture
réouverture
actions sensibles
```

Aucune suppression physique.

---

# 9. Ordre de développement consolidé

```text
1. Corriger toutes les erreurs TypeScript
2. People — terminé
3. Requests — terminé
4. Appointments — terminé
5. Interviews — terminé
6. Contracts — en cours
7. Cases
8. Case activities
9. Case history
10. Attachments
11. Agenda transversal
12. Logistics
13. Tests fonctionnels complets
14. Règles Firestore
15. Tests de sécurité et permissions
16. Stabilisation Web / Android / iOS
```

---

# 10. Prochaine action exacte

Nous sommes ici :

```text
Contracts
└── contract.types.ts
└── contract.service.ts
```

La prochaine action est :

```text
1. confirmer que les deux fichiers sont créés
2. lancer npx tsc --noEmit
3. corriger les éventuelles erreurs
4. créer app/(app)/contracts/form.tsx
```

Ce message peut servir de **contexte de reprise** dans une nouvelle fenêtre. Le titre conseillé serait :

```text
MRA App — Reprise développement Contracts après finalisation Interviews
```
Excellent. Si le projet compile sans erreur (`npx tsc --noEmit`), nous pouvons maintenant passer aux interfaces utilisateur.

Je te propose l'ordre suivant, qui est le plus cohérent et limite les retours en arrière :

## Phase 1 — Contracts (UI)

### 1. Formulaire de création

```text
app/(app)/contracts/form.tsx
```

Fonctions :

* création d'un contrat depuis un entretien ;
* récupération automatique des informations de l'entretien ;
* saisie de :

  * Objectif de l'accompagnement
  * Engagements
  * Durée prévue
* appel à `createContract()`.

---

### 2. Détail du contrat

```text
app/(app)/contracts/[id].tsx
```

Fonctions :

* consulter le contrat ;
* modifier :

  * objectif,
  * engagements,
  * durée,
  * statut,
  * dates ;
* ouvrir l'entretien lié ;
* ouvrir la demande liée.

---

### 3. Liste des contrats

```text
app/(app)/contracts/index.tsx
```

Avec :

* recherche,
* filtre par statut,
* ouverture du détail,
* bouton « Nouveau contrat » (uniquement depuis un entretien).

---

### 4. Intégration avec Interviews

Dans :

```text
app/(app)/interviews/[id].tsx
```

Ajouter :

```text
Si contractId existe
      ↓
Voir le contrat

Sinon
      ↓
Créer un contrat d'accompagnement
```

Cette étape relie définitivement le parcours :

```text
Rendez-vous
      ↓
Entretien
      ↓
Contrat
```

---

## Phase 2 — Cases

Une fois Contracts terminé :

```text
Contract
      ↓
Case
      ↓
Case Activities
```

---

# Une amélioration que je recommande avant d'aller plus loin

Maintenant que les modules **People**, **Requests**, **Appointments**, **Interviews** et **Contracts** sont bien structurés, il est intéressant d'ajouter un **tableau de bord de la personne**.

Par exemple, dans :

```text
app/(app)/people/[id].tsx
```

avoir une vue chronologique :

```text
Jean Dupont

──────────────

Demandes

• Demande 001
     ↓

Rendez-vous

• 12/07/2026
• 19/07/2026
• 26/07/2026

     ↓

Entretien

• MRA-I-000012

     ↓

Contrat

• MRA-C-000004

     ↓

Dossier

• MRA-D-000003

     ↓

Activités

• Appel
• Visite
• Prière
• Orientation
```

Cette vue deviendra le **véritable dossier 360° de la personne**, très utile pour les conseillers, les responsables et les superviseurs.

---

## Je te propose donc l'ordre final suivant

✅ People
✅ Requests
✅ Appointments
✅ Interviews
🟡 Contracts *(en cours)*
⬜ Dashboard Personne (vue 360°)
⬜ Cases
⬜ Case Activities
⬜ Attachments
⬜ Agenda
⬜ Logistics
⬜ Statistiques & tableaux de bord
⬜ Tests fonctionnels complets
⬜ Sécurité Firestore
⬜ Mise en production

À ce stade, l'architecture est suffisamment stable pour poursuivre sereinement sans devoir revenir modifier les fondations.
