Je modifierais effectivement le modèle de données pour qu'il soit aligné avec ce que nous avons décidé. Aujourd'hui, il reste des traces de l'ancienne architecture (décision dans la demande, activités uniquement dans le dossier, absence des rendez-vous et des entretiens avant dossier).

Voici la version que je figerais.

---

# DATA_MODEL.md

## 1. Vue d'ensemble

```text
Personne
│
├── Demandes
│
├── Rendez-vous
│
├── Entretiens (avant prise en charge)
│
├── Contrats
│
└── Dossiers
      ├── Activités
      ├── Historique
      └── Documents
```

Une personne peut avoir plusieurs demandes au cours de sa vie.

Une demande peut conduire à une prise en charge ou non.

Les premiers entretiens sont réalisés **avant** l'ouverture éventuelle d'un dossier.

Après la signature du contrat, un dossier est créé et toutes les nouvelles activités y sont rattachées.

---

# 2. Collections Firestore

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

---

# 3. Collection : people

Une personne est enregistrée une seule fois.

Une personne peut avoir :

* plusieurs demandes ;
* plusieurs rendez-vous ;
* plusieurs entretiens ;
* plusieurs dossiers au cours de sa vie.

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

Elle appartient à une seule personne.

Elle peut conduire à l'ouverture d'un seul dossier.

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

caseId

createdAt
updatedAt
createdBy
```

> Plus de champ `decision`, `decisionDate` ou `contractSigned`. Ces éléments sont matérialisés par le contrat et le dossier.

---

# 5. Collection : appointments

Les rendez-vous servent uniquement à planifier les rencontres.

Ils ne contiennent aucun contenu métier.

```text
id

appointmentNumber

personId

requestId

counselorId
counselorName

date
location

status

notes

createdAt
updatedAt
createdBy
```

---

# 6. Collection : interviews

Les entretiens enregistrent le contenu des échanges avec la personne.

Avant l'ouverture d'un dossier :

* `caseId = null`

Après ouverture du dossier :

* `caseId` contient le dossier concerné.

```text
id

interviewNumber

personId

requestId

caseId

appointmentId

counselorId
counselorName

date

summary

observations

recommendations

createdAt
updatedAt
createdBy
```

---

# 7. Collection : contracts

Le contrat formalise l'accord de prise en charge.

Sa signature permet la création du dossier.

```text
id

contractNumber

personId

requestId

signedDate

status

attachmentId

createdAt
updatedAt
createdBy
```

---

# 8. Collection : cases

Le dossier représente la prise en charge de la personne.

```text
id

caseNumber

personId

requestId

contractId

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

# 9. Collection : case_activities

Toutes les activités réalisées pendant la prise en charge.

```text
id

caseId

activityType

activityDate

title

description

performedBy
performedByName

createdAt
updatedAt
```

Les principaux types d'activités sont :

* Entretien
* Suivi
* Note
* Recommandation

---

# 10. Collection : case_history

Historique technique du dossier.

```text
id

caseId

action

description

performedBy

performedAt
```

---

# 11. Collection : attachments

Documents associés aux personnes, demandes, contrats ou dossiers.

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

# 12. Collection : users

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

# 13. Collection : counters

```text
people

requests

appointments

interviews

contracts

cases
```

---

# Relations

```text
people
    1 ---- N requests

people
    1 ---- N appointments

people
    1 ---- N interviews

people
    1 ---- N cases

requests
    1 ---- N appointments

requests
    1 ---- N interviews

requests
    1 ---- 0..1 contracts

requests
    1 ---- 0..1 cases

contracts
    1 ---- 1 cases

cases
    1 ---- N case_activities

cases
    1 ---- N case_history

people / requests / contracts / cases
    1 ---- N attachments
```

## Deux remarques importantes

Je ne mettrais **pas** les entretiens dans `case_activities`. Je conserverais une collection `interviews` indépendante. Les entretiens sont suffisamment riches (résumé, observations, recommandations, pièces jointes éventuelles...) pour mériter leur propre collection. En revanche, lors d'un entretien réalisé dans le cadre d'un dossier, on peut ajouter automatiquement une entrée dans `case_history` indiquant qu'un entretien a eu lieu.

Enfin, je renommerais simplement le champ `date` en `interviewDate` dans `interviews` et `appointmentDate` dans `appointments`. Cela rend le modèle plus explicite et évite toute ambiguïté lorsqu'on manipule plusieurs dates dans le code.
