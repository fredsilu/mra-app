
# ROADMAP.md

# MRA - Feuille de route

## Phase 1 - Fondations ✅

Objectif : mettre en place les bases techniques du projet.

### Réalisé

* Initialisation du projet Expo
* Configuration Firebase
* Authentification
* Gestion des utilisateurs
* Gestion des permissions
* Structure générale du projet

**Statut : Terminé**

---

## Phase 2 - Architecture ✅

Objectif : définir les fondations fonctionnelles et techniques.

### Réalisé

* Architecture du projet
* Modèle de données
* Workflow métier
* Collections Firestore
* Principes de développement

**Statut : Terminé**

---

## Phase 3 - Restructuration

Objectif : aligner le code avec l'architecture validée.

### À faire

* Réorganiser les routes Expo Router
* Réorganiser les modules
* Corriger le modèle Person
* Corriger le modèle Request
* Corriger le modèle Case
* Corriger les services
* Corriger les écrans

**Statut : En cours**

---

## Phase 4 - Développement fonctionnel

Objectif : terminer les fonctionnalités principales.

Modules :

* Personnes
* Demandes
* Dossiers
* Activités
* Documents
* Agenda
* Logistique

**Statut : À faire**

---

## Phase 5 - Stabilisation

Objectif : préparer la version de production.

### À faire

* Tests fonctionnels
* Tests de sécurité
* Optimisation
* Correction des anomalies
* Validation métier
* Déploiement

**Statut : À faire**

---

# Priorité actuelle

Notre priorité est **la Phase 3 : Restructuration**.

Aucune nouvelle fonctionnalité ne sera développée tant que la restructuration n'est pas terminée.

---

## ✅ Les documents sont maintenant figés

Nous avons désormais nos trois documents de référence :

* **ARCHITECTURE.md**
* **DATA_MODEL.md**
* **ROADMAP.md**

À partir de maintenant, **nous n'y revenons plus**, sauf si une évolution métier du MRA l'exige.

---

# Prochaine étape

Nous pouvons maintenant commencer le travail concret sur le code.

Je propose de suivre cet ordre, qui est le plus sûr :

1. Réorganisation des routes **Expo Router**.
2. Correction du modèle **Request**.
3. Correction du modèle **Case**.
4. Correction des écrans **Request**.
5. Correction des écrans **Case**.
6. Migration des données si nécessaire.

Nous quittons maintenant la phase de conception et entrons dans la phase de restructuration. C'est à partir d'ici que nous allons progressivement remettre le projet en conformité avec l'architecture que nous avons figée.


État actuel du projet

Architecture : ✅ Validée
Modèle de données : ✅ Validé
Base de données : ✅ Validée
Workflow : ✅ Validé

Prochaine étape :
- Restructuration des routes Expo Router

Ensuite :
- Correction du modèle Request
- Correction du modèle Case
- Correction des écrans
- Reprise du développement


# État actuel du projet

Date : 27/07/2026

## Travaux réalisés

- Réorganisation des routes Expo Router
- Déplacement des écrans People
- Création du layout (app)
- Vérification de la navigation
- Tests OK

## Décisions prises

- Les routes utilisent désormais les groupes Expo Router.
- Aucune modification du modèle métier.

## Problèmes rencontrés

- Les imports des composants devront être corrigés lors de la prochaine séance.

## Prochaine étape

- Corriger request.types.ts
- Corriger request.service.ts
- Adapter request-details.tsx


## État des modules

| Module | État |
|---------|-------|
| Infrastructure | ✅ Terminé |
| Authentification | ✅ Terminé |
| Utilisateurs | ✅ Terminé |
| Personnes | 🔄 En cours |
| Demandes | ⏳ À faire |
| Dossiers | ⏳ À faire |
| Activités | ⏳ À faire |
| Documents | ⏳ À faire |
| Agenda | ⏳ À faire |


Parfait. À partir de maintenant, nous travaillons comme sur un véritable projet logiciel.

## 📌 Règles de travail

À chaque séance, nous suivrons toujours le même cycle :

### 1. Définir l'objectif de la séance

Exemple :

> Aujourd'hui : restructurer les routes Expo Router.

### 2. Réaliser le développement

* Audit
* Correction
* Tests
* Validation

### 3. Mettre à jour ROADMAP.md

En fin de séance, nous renseignerons :

* les travaux réalisés ;
* les décisions prises ;
* les problèmes rencontrés ;
* la prochaine étape.

Ainsi, nous ne perdrons plus jamais le fil du projet.

---

# 🚀 Séance n°1 - Restructuration

## Objectif

**Restructurer complètement la navigation Expo Router pour qu'elle respecte l'architecture validée.**

Pourquoi commencer par là ?

Parce que **tous les autres modules (People, Requests, Cases...) dépendront de cette navigation**. Si nous la corrigeons maintenant, nous éviterons de devoir modifier les chemins et les imports plusieurs fois.

---

# Ce que nous allons faire

## Étape 1 : Créer la nouvelle structure

Nous allons passer de :

```text
app/
    dashboard.tsx
    people.tsx
    person-form.tsx
    requests.tsx
    request-form.tsx
    cases.tsx
    case-form.tsx
    users.tsx
    ...
```

à :

```text
app/
│
├── _layout.tsx
├── index.tsx
│
├── (auth)/
│   └── login.tsx
│
├── (app)/
│   ├── _layout.tsx
│   ├── dashboard.tsx
│   │
│   ├── people/
│   │   ├── index.tsx
│   │   ├── create.tsx
│   │   ├── edit.tsx
│   │   └── [id].tsx
│   │
│   ├── requests/
│   ├── cases/
│   ├── users/
│   ├── agenda/
│   └── logistics/
│
└── access-denied.tsx
```

---

## Étape 2

Adapter les routes :

Au lieu de :

```ts
router.push('/people')
```

nous aurons :

```ts
router.push('/(app)/people')
```

ou les chemins équivalents adaptés à Expo Router.

---

## Étape 3

Créer le layout du groupe `(app)`.

Il contiendra :

* le contrôle d'authentification ;
* la navigation commune ;
* les futurs menus.

---

## Étape 4

Vérifier que :

* la connexion fonctionne ;
* le tableau de bord s'ouvre correctement ;
* chaque module est accessible.

---

# 🎯 Livrable de cette séance

À la fin de cette première séance, nous aurons :

* une navigation propre ;
* une architecture de routes conforme aux documents ;
* une base solide pour corriger les modules **People**, **Requests** et **Cases**.

Ensuite, nous mettrons à jour `ROADMAP.md` avec l'état réel du projet.

**Nous sommes maintenant prêts à commencer la restructuration du code.**
Phase 1 : Fondations            ✅ Terminée
Phase 2 : Architecture          ✅ Terminée
Phase 3 : Restructuration       🔄 En cours
Phase 4 : Développement         ⏳ En attente
Phase 5 : Stabilisation         ⏳ En attente


Nous respecterons toujours cette méthode :

Auditer → Planifier → Déplacer → Tester → Mettre à jour ROADMAP → Passer au module suivant.

Excellent ! 🎉

C'est une étape importante. Nous venons de stabiliser toute la couche de navigation.

## Sprint 1.1 — État

```text
✅ Architecture des routes Expo Router
✅ Alias @
✅ Imports corrigés
✅ Authentification Firebase
✅ Redirection après connexion
✅ Navigation Dashboard → Modules
✅ _layout.tsx stabilisé
```

Je considère que **Sprint 1.1 est terminé**.

---

# Maintenant, on attaque Sprint 1.2

C'est, à mon avis, la dernière grosse étape d'architecture avant de travailler sur le métier du MRA.

## Objectif

Passer d'une architecture "technique" :

```text
src/
    services/
    types/
    validators/
```

à une architecture "fonctionnelle" :

```text
src/
├── features/
│   ├── auth/
│   ├── people/
│   ├── requests/
│   ├── cases/
│   ├── users/
│   ├── agenda/
│   ├── logistics/
│   └── counselors/
│
├── components/
├── config/
├── constants/
├── contexts/
├── hooks/
├── navigation/
├── permissions/
└── utils/
```

---

## Ce que nous ne ferons PAS

❌ Modifier la logique métier.

❌ Modifier Firestore.

❌ Modifier les écrans.

On déplace uniquement les fichiers.

---

## Pourquoi je veux faire cela maintenant

Imagine dans 6 mois.

Tu auras :

```text
People
```

Tu ouvriras :

```text
features/people
```

Tu trouveras :

```text
people.service.ts
people.types.ts
people.validation.ts
people.repository.ts
people.mapper.ts
```

Tout est au même endroit.

Tu n'auras plus besoin de chercher dans 6 dossiers différents.

---

# Ensuite...

Une fois cette étape terminée, **on arrête complètement les changements d'architecture**.

À partir de là, on entrera dans le cœur du projet :

* 👤 Module Personnes
* 📝 Module Demandes
* 🤝 Affectation des conseillers
* 📅 Rendez-vous
* 📄 Contrat
* ❤️ Relation d'aide
* 📈 Tableau de bord

C'est là que le MRA prendra réellement vie.

## Avant de déplacer quoi que ce soit

Je voudrais faire un **audit rapide de ton dossier `src`** pour éviter de déplacer des fichiers inutilement.

Peux-tu m'envoyer une capture de l'arborescence complète de `src` (ou simplement copier la liste des dossiers et fichiers principaux) ? Nous établirons ensuite un plan de migration propre, module par module, sans casser l'application.


Excellente idée. Voici un **point d'étape complet** qui permettra à une autre IA (ou à nous en cas de perte de contexte) de reprendre le projet sans ambiguïté.

---

# MRA APP – ÉTAT DU PROJET

## Projet

Application React Native (Expo + Expo Router + Firebase) destinée au **Ministère de la Relation d'Aide (MRA)**.

Architecture :

* Expo Router
* Feature First
* Firebase Auth
* Firestore
* TypeScript
* UI maison (`AppButton`, `AppInput`, etc.)

---

# Principe métier fondamental

Une **Personne** n'est **pas** un **Dossier de relation d'aide (Case)**.

Le workflow est :

```text
Personne
      ↓
Demande
      ↓
Décision
      ↓
(si acceptée)
Création d'un Dossier (Case)
```

Une personne peut :

* avoir plusieurs demandes
* avoir plusieurs dossiers au cours de sa vie

Une demande ne crée jamais automatiquement un dossier.

---

# Workflow cible

```text
Personne
      ↓
Création d'une demande
      ↓
Affectation d'un conseiller
      ↓
Premier rendez-vous
      ↓
Premier entretien
      ↓
Décision

      ├── Refus
      ├── Orientation
      └── Acceptation
                ↓
Signature du contrat
                ↓
Création du dossier
                ↓
Plan d'accompagnement
                ↓
Activités
                ↓
Clôture
```

Ce workflow est désormais la référence métier.

---

# Architecture actuelle

```text
app/
│
├── dashboard
│
├── people
│      index.tsx
│      form.tsx
│
├── requests
│      index.tsx
│      form.tsx
│      [id].tsx
│
├── cases
│
└── users
```

---

# MODULE PERSONNES

## Fonctionnalités terminées

### Création

✔ création

### Modification

✔ édition

### Recherche

✔ nom

✔ téléphone

✔ numéro MRA

### Rafraîchissement

✔ pull to refresh

### Tri

✔ ordre alphabétique

### Détection des doublons

Avant création :

comparaison :

* nom
* téléphone

---

## Numérotation

Numérotation automatique.

Exemple :

```text
MRA-000001
MRA-000002
MRA-000003
```

Compteur Firestore :

```text
counters
      people
           value
```

La numérotation est transactionnelle.

Aucun doublon possible.

---

# MODULE DEMANDES

## Fonctionnalités terminées

### Création

✔

### Choix de la personne

✔

### Motif

✔

### Priorité

✔

### Notes

✔

### Numérotation

Automatique :

```text
REQ-000001
REQ-000002
```

Compteur Firestore :

```text
counters
      requests
```

Transaction Firestore.

---

## Liste

Affiche :

* numéro
* personne
* motif
* statut
* priorité
* conseiller

---

## Navigation

Dashboard

↓

Demandes

↓

Liste

↓

Nouvelle demande

↓

Création

↓

Retour liste

↓

clic

↓

Détail

Tout fonctionne.

---

# Dashboard

Fonctionnel.

Menus :

```text
Personnes

Demandes

Dossiers

Utilisateurs

Déconnexion
```

---

# Firestore

Collections actuelles

```text
people

requests

cases

users

counters
```

---

## Collection counters

```text
people

requests
```

Chaque document contient :

```text
value
```

Utilisation via transaction Firestore.

---

# Navigation

Toutes les routes ont été uniformisées.

On utilise maintenant :

```text
/people

/people/form

/requests

/requests/form

/requests/[id]
```

L'ancienne route

```text
/person-form
```

a été supprimée.

---

# Services

## Person

Fonctions :

* getPeople()

* createPerson()

* updatePerson()

* etc.

---

## Requests

Fonctions :

* getRequests()

* getRequest()

* createRequest()

---

## Counter Service

Service unique.

Fonction :

```ts
getNextCounterValue()
```

Utilise

```ts
runTransaction()
```

pour garantir une numérotation atomique.

---

# Décisions déjà prises

## Une Personne

≠

Un Dossier

---

## Un dossier

ne sera créé

QU'APRÈS

une décision d'acceptation.

---

## Les statistiques devront être calculées à partir des Demandes.

Exemples :

* nombre de demandes

* taux d'acceptation

* taux de refus

* taux d'orientation

* temps moyen avant affectation

* temps moyen avant premier entretien

---

# Ce qui reste à développer

Ordre prévu :

## 1.

Affectation d'un conseiller

↓

## 2.

Premier rendez-vous

↓

## 3.

Premier entretien

↓

## 4.

Décision

* Acceptée

* Refusée

* Orientée

↓

## 5.

Signature du contrat

↓

## 6.

Création automatique du dossier

↓

## 7.

Module Case

↓

## 8.

Plan d'accompagnement

↓

## 9.

Activités

↓

## 10.

Clôture du dossier

---

# État d'avancement estimé

| Module                   | État                  |
| ------------------------ | --------------------- |
| Authentification         | ✅ 100 %               |
| Navigation               | ✅ 100 %               |
| Dashboard                | ✅ 100 %               |
| Gestion des utilisateurs | ✅ Fonctionnelle       |
| Personnes                | ✅ 100 %               |
| Demandes                 | ✅ Environ 90 %        |
| Affectation conseiller   | ⏳ À développer        |
| Premier rendez-vous      | ⏳                     |
| Premier entretien        | ⏳                     |
| Décision                 | ⏳                     |
| Contrat                  | ⏳                     |
| Dossiers (Case)          | ⏳ Structure seulement |
| Activités                | ⏳                     |
| Statistiques             | ⏳                     |
| Rapports                 | ⏳                     |

---

# Règles de développement

Ces règles doivent être respectées pour toutes les prochaines évolutions :

1. **Ne jamais casser les fonctionnalités validées.**
2. **Toujours faire évoluer l'existant, jamais réécrire un module complet sans raison.**
3. **Respecter l'architecture Feature First et Expo Router.**
4. **Toute nouvelle fonctionnalité métier doit refléter le fonctionnement réel du MRA avant d'être implémentée.**
5. **Les identifiants métier (MRA-xxxxxx, REQ-xxxxxx, futurs CASE-xxxxxx) sont générés exclusivement via le service transactionnel `counter.service.ts`.**
6. **Les routes doivent rester cohérentes avec l'organisation du projet (`/people`, `/requests`, `/cases`, etc.).**
7. **Avant toute modification de code, analyser les fichiers existants afin d'intégrer la nouvelle fonctionnalité sans créer de duplications ni de régressions.**

Ce document constitue désormais le **contexte de référence** pour la poursuite du développement du projet MRA.


Oui. Je pense que c'est le bon moment pour faire un bilan. Nous avons déjà réalisé une partie importante du socle de l'application et, surtout, nous avons clarifié le métier. Cela nous évitera de refaire des développements plus tard.

# État actuel du projet MRA

## 1. Architecture technique (≈ 100% terminé)

### Plateforme

* ✅ Expo SDK 57
* ✅ React Native 0.86
* ✅ Expo Router
* ✅ Firebase
* ✅ Firestore
* ✅ Authentification Firebase
* ✅ TypeScript strict
* ✅ Alias `@/*`
* ✅ Architecture Feature First

---

### Organisation

```
src/
    features/
        auth/
        people/
        requests/
        users/
        counters/
```

Architecture validée.

---

# 2. Authentification (100%)

Nous avons :

✅ Connexion

✅ Gestion de session

✅ Context Auth

✅ Création d'utilisateurs

✅ Déconnexion

---

# 3. Gestion des utilisateurs (≈95%)

Déjà développé :

✅ création utilisateur

✅ modification utilisateur

✅ activation/désactivation

✅ rôles

```
Responsable

Adjoint

Secrétaire

Conseiller

Logistique
```

✅ protection du dernier responsable actif

✅ recherche des conseillers actifs

Permissions :

```
canManageUsers()

canManageAssignments()

canManageAgenda()

canViewPrivateInterview()

...
```

---

# 4. Gestion des personnes (100%)

Déjà réalisé :

✅ CRUD

✅ détection doublons

✅ numérotation

```
MRA-000001
```

✅ navigation

---

# 5. Compteurs Firestore (100%)

Déjà développé :

```
people

requests
```

Numérotation automatique.

---

# 6. Demandes (≈70%)

Déjà réalisé

Création

```
REQ-000001
```

CRUD

Liste

Détail

Priorité

```
Faible

Normale

Élevée

Urgente
```

Historique

Affectation conseiller

Validation

Sécurisation

Interdiction de réaffecter après démarrage (qui sera bientôt remplacée)

---

# 7. Affectation conseiller (100%)

Déjà terminé

Responsable

Adjoint

↓

choisit

↓

Conseiller actif

↓

Demande affectée

↓

Historique enregistré

---

# 8. Ce que nous avons décidé aujourd'hui

C'est probablement la décision la plus importante depuis le début.

## Nous abandonnons

```
firstAppointmentAt

startedAt

completedAt

closedAt
```

dans la collection Request.

Pourquoi ?

Parce que cela mélange plusieurs concepts.

---

## Nous créons une vraie architecture métier.

---

# Nouveau modèle

```
Person
      │
      ▼
Request
      │
      ▼
Appointment
      │
      ▼
Interview
      │
      ▼
Decision
      │
Accepted ?
      │
      ▼
Contract
      │
      ▼
Case
```

Cette décision va énormément simplifier les futurs développements.

---

# 9. Ce qui ne sera plus dans Request

Nous supprimons :

```
Premier rendez-vous

Début prise en charge

Fin prise en charge

Clôture
```

La demande servira uniquement à dire :

> une personne sollicite le ministère.

---

# 10. Ce que nous allons créer

## Appointment

Premier vrai module.

Il gèrera :

✔ date

✔ heure

✔ lieu

✔ conseiller

✔ type

✔ statut

✔ reports

✔ annulations

✔ rappels

✔ agenda

---

Puis Interview

Le rendez-vous est réalisé.

On rédige un compte-rendu.

---

Puis Decision

```
Acceptée

Refusée

Orientée
```

---

Puis Contract

Signature.

---

Puis Case

Le vrai dossier de relation d'aide.

---

# 11. Ce qui est terminé

```
Architecture
██████████████████ 100%

Authentification
██████████████████ 100%

Utilisateurs
█████████████████░ 95%

Permissions
██████████████████ 100%

Compteurs
██████████████████ 100%

Personnes
██████████████████ 100%

Demandes
██████████████░░░░ 70%
```

---

# 12. Ce qu'il reste à construire

```
Appointments
□□□□□□□□□□□□

Interviews
□□□□□□□□□□□□

Decisions
□□□□□□□□□□□□

Contracts
□□□□□□□□□□□□

Cases
□□□□□□□□□□□□

Activities
□□□□□□□□□□□□

Agenda
□□□□□□□□□□□□

Notifications
□□□□□□□□□□□□

Documents
□□□□□□□□□□□□

Rapports
□□□□□□□□□□□□
```

---

# 13. Vision finale du SI MRA

À ce stade, la cible est un véritable système d'information pour le ministère, structuré autour des principales entités :

```
People
│
├── Requests
│
├── Appointments
│
├── Interviews
│
├── Decisions
│
├── Contracts
│
├── Cases
│      ├── Activities
│      ├── Follow-up appointments
│      ├── Documents
│      └── Closure
│
└── Notifications
```

Je te recommande maintenant de **ne plus développer de nouvelles fonctionnalités tant que nous n'avons pas figé le modèle métier complet** (Business Data Model, schéma Firestore, workflows, statuts et règles métier). Nous avons déjà corrigé une première modélisation avant qu'elle ne devienne coûteuse à changer ; consacrer un peu de temps à cette conception nous permettra ensuite de développer les modules beaucoup plus rapidement et avec une architecture stable.


Très bonne idée. Faisons le point avant de continuer le développement.

# Roadmap MRA

## Phase 1 — Fondations techniques ✅ (Terminée)

### Infrastructure

* ✅ Expo SDK 57
* ✅ React Native 0.86
* ✅ Expo Router
* ✅ Firebase
* ✅ Authentification
* ✅ Architecture Feature First
* ✅ Permissions

---

### Module People

```
people
```

Etat :

* ✅ CRUD
* ✅ Formulaire
* ✅ Liste
* ✅ Détail
* ✅ Archivage
* ✅ Validation

**Statut : 100 %**

---

### Module Requests

```
requests
```

Etat :

* ✅ Types
* ✅ Service
* ✅ Création
* ✅ Liste
* ✅ Détail
* ✅ Affectation conseiller
* ✅ Annulation

Nous avons également terminé la migration d'architecture :

Avant

```
Request
    ├── firstAppointmentDate
    ├── firstAppointmentLocation
    ├── ...
```

Après

```
Request
    └── initialAppointmentId
```

**Statut : ~95 %**

Il reste uniquement :

* suppression des derniers appels à `scheduleFirstAppointment()`
* adaptation de `requests/[id].tsx`

---

# Phase 2 — Appointments 🚧 (En cours)

Structure

```
appointments
```

Etat

* ✅ appointment.types.ts
* ✅ appointment.service.ts

Reste

* ⏳ form.tsx
* ⏳ index.tsx
* ⏳ [id].tsx

Lorsque cette phase sera terminée, le premier rendez-vous sera totalement indépendant de la demande.

---

# Phase 3 — Interviews

```
Interview
```

Non commencé.

Contiendra :

* entretien
* compte rendu
* observations
* besoins
* prière
* recommandations

**Statut : 0 %**

---

# Phase 4 — Decisions

```
Decision
```

Non commencé.

Exemples :

* suivi
* délivrance
* assistance sociale
* orientation
* accompagnement
* clôture

**Statut : 0 %**

---

# Phase 5 — Contracts

Non commencé.

Servira lorsque la personne entre dans un accompagnement officiel.

**Statut : 0 %**

---

# Phase 6 — Cases

Le dossier complet de la personne.

Le Case deviendra la vue centrale.

Exemple :

```
CASE

Personne

↓

Demandes

↓

Rendez-vous

↓

Entretiens

↓

Décisions

↓

Contrat

↓

Historique
```

**Statut : 0 %**

---

# Ce qui est déjà terminé dans l'application

### Auth

✅

### Utilisateurs

✅

### Permissions

✅

### Personnes

✅

### Demandes

✅ (hors migration finale)

### Affectation des conseillers

✅

### Annulation

✅

### Numérotation

✅

---

# Ce qui reste à développer

## Parcours métier

```
Person
      │
      ▼
Request
      │
      ▼
Appointment
      │
      ▼
Interview
      │
      ▼
Decision
      │
      ▼
Contract
      │
      ▼
Case
```

---

## Modules transverses

* ⏳ Agenda
* ⏳ Calendrier
* ⏳ Notifications
* ⏳ Dashboard
* ⏳ Statistiques
* ⏳ Recherche globale
* ⏳ Historique complet
* ⏳ Rapports
* ⏳ Export PDF
* ⏳ Export Excel

---

# Avancement global estimé

| Module           | Avancement |
| ---------------- | ---------: |
| Infrastructure   |      100 % |
| Authentification |      100 % |
| Personnes        |      100 % |
| Demandes         |       95 % |
| Rendez-vous      |       25 % |
| Entretiens       |        0 % |
| Décisions        |        0 % |
| Contrats         |        0 % |
| Dossiers         |        0 % |
| Agenda           |        0 % |
| Tableau de bord  |        0 % |

## Notre prochaine étape

Nous allons terminer la **migration du module Requests** (suppression définitive de l'ancien système de premier rendez-vous), puis enchaîner immédiatement sur les écrans du module **Appointments** (`form.tsx`, `index.tsx` et `[id].tsx`). Une fois cette phase achevée, le flux **Person → Request → Appointment** sera entièrement opérationnel et servira de base aux modules **Interview**, **Decision**, **Contract** et **Case**.
