Parfait. Nous allons d’abord produire et figer **l’architecture métier et technique de référence**, sans modifier le code pendant cette étape.

# Architecture de référence MRA V1

## 1. Workflow métier officiel

```text
PERSONNE
   ↓
DEMANDE D’ENTRETIEN
   ↓
AFFECTATION DU CONSEILLER
   ↓
PLANIFICATION DU PREMIER RENDEZ-VOUS
   ↓
ENTRETIEN INITIAL
   ↓
DÉCISION
   ├── Pas de prise en charge
   │      └── Demande clôturée
   │
   ├── Orientation vers un autre service
   │      └── Demande clôturée comme orientée
   │
   └── Prise en charge acceptée
          ↓
      CONTRAT SIGNÉ
          ↓
      DOSSIER DE PRISE EN CHARGE
          ↓
      ENTRETIENS + SUIVIS + RECOMMANDATIONS
          ↓
      ENTRETIEN FINAL
          ↓
      CLÔTURE DU DOSSIER
```

## 2. Rôle de chaque objet métier

### Personne

Une personne possède une seule fiche permanente.

Elle peut avoir :

* plusieurs demandes d’entretien ;
* plusieurs dossiers de prise en charge ;
* plusieurs conseillers au fil du temps.

Le conseiller ne doit donc pas être affecté de manière permanente à la personne.

### Demande d’entretien

La demande représente la sollicitation initiale.

Elle doit gérer :

* la personne concernée ;
* l’identité du demandeur éventuel ;
* son lien avec la personne ;
* le motif ;
* la priorité ;
* l’affectation du conseiller ;
* le premier rendez-vous ;
* l’entretien initial ;
* la décision ;
* la signature du contrat ;
* le dossier créé, le cas échéant.

### Dossier de prise en charge

Le dossier est créé uniquement après :

1. décision positive ;
2. accord de la personne ;
3. signature du contrat.

Il doit gérer :

* la demande d’origine ;
* la personne ;
* le conseiller principal ;
* le contrat ;
* les entretiens ;
* les suivis ;
* les recommandations ;
* les documents ;
* les transferts de conseiller ;
* la clôture.

### Activité de dossier

Une même collection peut représenter les échanges réalisés pendant la prise en charge.

```ts
activityType:
  | 'interview'
  | 'follow_up'
  | 'recommendation';
```

```ts
channel:
  | 'in_person'
  | 'phone'
  | 'whatsapp'
  | 'email'
  | 'video'
  | 'other';
```

Chaque activité garde son auteur, même si le dossier est ensuite transféré.

## 3. Collections Firestore cibles

Pour la V1 :

```text
people
requests
cases
case_activities
case_history
attachments
users
counters
```

`appointments` pourra être séparé lorsque l’agenda sera développé. Pour éviter de surcomplexifier immédiatement, le premier rendez-vous peut d’abord rester dans `requests`.

## 4. Relations entre les données

```text
people
  1 ───── N requests

requests
  1 ───── 0..1 cases

people
  1 ───── N cases

cases
  1 ───── N case_activities

cases
  1 ───── N case_history

people / requests / cases / activities
  1 ───── N attachments
```

## 5. Statuts cibles

### Demande

```ts
export type RequestStatus =
  | 'new'
  | 'assigned'
  | 'appointment_scheduled'
  | 'initial_interview_completed'
  | 'decision_pending'
  | 'accepted'
  | 'not_accepted'
  | 'referred'
  | 'cancelled';
```

La demande ne doit plus avoir :

```text
in_progress
completed
closed comme une prise en charge
```

### Dossier

```ts
export type CaseStatus =
  | 'active'
  | 'suspended'
  | 'closing'
  | 'closed';
```

Un dossier ne doit normalement pas passer par `new` puis `assigned`, puisque son conseiller est déjà connu lors de sa création.

## 6. Affectation des conseillers

### Sur la demande

Le conseiller affecté réalise le premier entretien.

```ts
assignedCounselorId
assignedCounselorName
assignedAt
```

### Sur le dossier

Le conseiller principal suit la prise en charge.

```ts
primaryCounselorId
primaryCounselorName
assignedAt
```

En cas de transfert, le dossier est mis à jour et l’événement est enregistré dans `case_history`.

### Sur chaque activité

```ts
performedBy
performedByName
```

L’auteur ne change jamais rétroactivement.

## 7. Numérotation

### Personne

```text
MRA-P-000001
MRA-P-000002
```

### Dossier de prise en charge

```text
MRA-2026-000001
MRA-2026-000002
```

Les deux numérotations devront utiliser des compteurs transactionnels dans :

```text
counters
```

Le calcul actuel basé sur le nombre de documents ou une partie de l’identifiant Firestore devra être remplacé.

## 8. Arborescence technique cible

```text
app/
├── _layout.tsx
├── index.tsx
│
├── (auth)/
│   ├── _layout.tsx
│   └── login.tsx
│
├── (app)/
│   ├── _layout.tsx
│   ├── dashboard.tsx
│   │
│   ├── people/
│   │   ├── index.tsx
│   │   ├── create.tsx
│   │   └── [id].tsx
│   │
│   ├── requests/
│   │   ├── index.tsx
│   │   ├── create.tsx
│   │   └── [id].tsx
│   │
│   ├── cases/
│   │   ├── index.tsx
│   │   └── [id].tsx
│   │
│   ├── agenda/
│   │   └── index.tsx
│   │
│   ├── users/
│   │   ├── index.tsx
│   │   ├── create.tsx
│   │   └── [id].tsx
│   │
│   └── logistics/
│       └── index.tsx
│
└── access-denied.tsx
```

Dans `src/` :

```text
src/
├── assets/
├── components/
├── config/
├── constants/
├── contexts/
├── hooks/
├── navigation/
├── permissions/
├── theme/
├── utils/
│
└── features/
    ├── people/
    ├── requests/
    ├── cases/
    ├── activities/
    ├── attachments/
    └── users/
```

## 9. Règles techniques à figer

* Les écrans utilisent les permissions, jamais les rôles directement.
* Les écrans n’appellent jamais Firestore directement.
* Les services contiennent les opérations métier.
* Un Context n’est utilisé que pour un état réellement global.
* Les écritures liées doivent utiliser une transaction ou un batch.
* Chaque action importante produit une entrée d’audit.
* Aucun document métier n’est supprimé physiquement ; il est archivé ou clôturé.
* Une demande ne peut créer qu’un seul dossier.
* Un dossier ne peut être créé sans demande acceptée et contrat confirmé.
* Les données existantes ne seront pas supprimées avant une migration vérifiée.

## 10. État des éléments actuels

### À conserver presque tels quels

* configuration Firebase ;
* `AuthContext` ;
* système de permissions ;
* gestion des utilisateurs ;
* composants UI ;
* logique générale de `case_history`.

### À restructurer sans réécriture immédiate

* routes Expo Router ;
* imports après déplacement ;
* tableau de bord ;
* organisation `types/services`.

### À corriger fonctionnellement

* `request.types.ts` ;
* `request.service.ts` ;
* `request-details.tsx` ;
* `case.types.ts` ;
* `case.service.ts` ;
* `case-form.tsx` ;
* `case-detail.tsx` ;
* numérotation des personnes et dossiers ;
* champ `assignedCounselorIds` de la personne.

## 11. Ordre officiel de réparation

```text
1. Sauvegarde et branche Git de réparation
2. Document d’architecture figé
3. Réorganisation des routes Expo Router
4. Vérification de la navigation et de l’authentification
5. Correction du modèle Request
6. Correction du service Request
7. Correction des écrans Request
8. Correction du modèle Case
9. Création du dossier depuis une demande acceptée
10. Migration des anciennes données
11. Correction de Person
12. Règles Firestore
13. Tests
14. Reprise du développement des activités de dossier
```

La première opération technique sera donc **la réorganisation des routes, sans changer le métier ni les données**. Cela nous donnera une base propre avant de modifier les modèles.


Parfait. À partir de maintenant, on change de méthode.

On ne va plus "coder au fil de l'eau". On va travailler comme pour **JFKApp**, avec une vraie gouvernance d'architecture.

Je propose les livrables suivants avant toute nouvelle fonctionnalité.

# Phase A — Architecture (priorité absolue)

Nous allons créer 5 documents qui deviendront la référence officielle du projet.

## 1. ARCHITECTURE.md ⭐ (document maître)

Ce document décrira :

* la vision générale du MRA ;
* les modules ;
* les collections Firestore ;
* les relations entre les objets ;
* les règles métier ;
* les conventions de développement.

Ce sera **la Constitution du projet**.

---

## 2. DATA_MODEL.md

Uniquement le modèle de données.

Exemple :

```text
Person
│
├── Requests
│      │
│      └── 0 ou 1 Case
│                  │
│                  ├── Activities
│                  ├── Documents
│                  └── History
```

Puis chaque collection sera détaillée.

---

## 3. WORKFLOWS.md

Tous les workflows métier.

Par exemple :

```text
Nouvelle personne

↓

Nouvelle demande

↓

Assignation

↓

Premier rendez-vous

↓

Décision

↓

Contrat

↓

Ouverture dossier
```

Puis :

```text
Dossier

↓

Entretien

↓

Suivi

↓

Clôture
```

---

## 4. DEVELOPMENT_GUIDE.md

Les règles de développement.

Exemple :

✔ jamais d'accès Firestore dans les écrans

✔ toujours passer par un service

✔ chaque action importante écrit un audit

✔ toutes les créations utilisent un compteur

✔ etc.

---

## 5. ROADMAP.md

Le document des versions.

V1.0

V1.1

V1.2

...

Ainsi, dans 6 mois, nous saurons toujours pourquoi une décision a été prise.

---

# Phase B — Audit complet

Ensuite, nous parcourrons **chaque module**.

Pas seulement le code.

Nous vérifierons :

```text
Module Personnes

✓ métier

✓ écran

✓ Firestore

✓ sécurité

✓ architecture

✓ navigation

✓ services
```

Puis :

```text
Demandes

↓

Dossiers

↓

Agenda

↓

Utilisateurs

↓

Logistique
```

Chaque module recevra une note.

---

# Phase C — Restructuration

Ensuite seulement :

* déplacement des routes Expo Router ;
* nettoyage des imports ;
* correction des modèles ;
* migration Firestore.

Sans ajouter une seule nouvelle fonctionnalité.

---

# Ce que je voudrais également changer

Il y a une erreur que j'ai commise au début.

J'ai raisonné comme un développeur.

Toi, tu raisonnes comme un **responsable métier**.

Pour une application comme le MRA, **c'est le métier qui doit piloter l'architecture**, pas l'inverse.

À partir de maintenant, je propose que chaque nouveau module soit validé selon trois niveaux :

### 1. Validation métier

> Est-ce que cela correspond réellement au fonctionnement du MRA ?

### 2. Validation fonctionnelle

> Est-ce que l'utilisateur comprend naturellement le workflow ?

### 3. Validation technique

> Est-ce que le code est propre, maintenable et évolutif ?

Nous ne passerons au développement qu'une fois ces trois validations obtenues.

---

## Je propose également une règle supplémentaire

À chaque fois que nous terminons un module, nous le déclarons **"gelé"**.

Exemple :

```text
✓ Infrastructure : GELÉE

✓ Authentification : GELÉE

✓ Utilisateurs : GELÉ

✓ Personnes : GELÉ
```

À partir de ce moment-là, on ne modifie plus ce module sauf si :

* il y a un bug ;
* ou une évolution fonctionnelle décidée.

Cela évitera de revenir en arrière plusieurs fois sur les mêmes écrans, ce qui est exactement ce qui nous est arrivé ces derniers jours.

Je pense que cette méthode sera beaucoup plus adaptée à un projet de cette taille et nous donnera une base solide pour faire évoluer le MRA pendant plusieurs années.
