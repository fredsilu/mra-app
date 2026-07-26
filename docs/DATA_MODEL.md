Entendu. Nous ne changeons plus rien.

L'architecture est **figée**.

Nous passons directement au deuxième document.

# DATA_MODEL.md

Ce document décrit uniquement les données du système.

---

# 1. Vue d'ensemble

```text
Personne
    │
    ├── Demandes
    │        │
    │        └── 0 ou 1 Dossier
    │                     │
    │                     ├── Activités
    │                     ├── Historique
    │                     └── Documents
    │
    └── Plusieurs dossiers possibles au cours de la vie
```

---

# 2. Collections Firestore

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

---

# 3. Collection : people

Une personne est enregistrée une seule fois.

Une personne peut avoir :

* plusieurs demandes ;
* plusieurs dossiers de prise en charge.

Principaux champs :

```text
id
personNumber
firstName
lastName
gender
birthDate
phone
email
address
maritalStatus
church
createdAt
updatedAt
createdBy
```

---

# 4. Collection : requests

Une demande représente la sollicitation initiale.

Une demande appartient à une seule personne.

Une demande peut créer un seul dossier.

Principaux champs :

```text
id
requestNumber
personId

requestedBy
relationship

reason
priority

status

assignedCounselorId
assignedCounselorName

appointmentDate

decision

decisionDate

contractSigned

caseId

createdAt
updatedAt
createdBy
```

---

# 5. Collection : cases

Un dossier est créé uniquement après une décision positive.

Il est toujours lié à une demande.

Principaux champs :

```text
id
caseNumber

personId

requestId

status

primaryCounselorId
primaryCounselorName

openedAt

closedAt

closingReason

createdAt
updatedAt
createdBy
```

---

# 6. Collection : case_activities

Toutes les activités réalisées pendant la prise en charge.

Principaux champs :

```text
id

caseId

activityType

date

title

notes

performedBy
performedByName

createdAt
updatedAt
```

---

# 7. Collection : case_history

Historique technique du dossier.

Principaux champs :

```text
id

caseId

action

description

performedBy

performedAt
```

---

# 8. Collection : attachments

Documents associés aux personnes, demandes ou dossiers.

Principaux champs :

```text
id

entityType

entityId

fileName

fileUrl

uploadedBy

uploadedAt
```

---

# 9. Collection : users

Utilisateurs de l'application.

Principaux champs :

```text
id

displayName

email

role

permissions

isActive

createdAt
updatedAt
```

---

# 10. Collection : counters

Gestion des numéros séquentiels.

Principaux champs :

```text
people

requests

cases
```

---

## Relations

```text
people
    1 ---- N requests

people
    1 ---- N cases

requests
    1 ---- 0..1 cases

cases
    1 ---- N case_activities

cases
    1 ---- N case_history

people / requests / cases
    1 ---- N attachments
```

---

Je m'arrête ici pour ce document afin de respecter notre méthode : **simple, figé et sans ajouter d'éléments non validés**.

La prochaine étape sera **ROADMAP.md**, puis nous commencerons immédiatement la restructuration du projet.
