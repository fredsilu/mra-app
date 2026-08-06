Je ferais les mêmes ajustements que pour le **DATA_MODEL** afin que les trois documents (Architecture, Data Model et Database) soient parfaitement cohérents.

---

# DATABASE.md

# MRA – Architecture de la base de données

**Version :** 1.0
**Statut :** Validé

---

# 1. Objectif

Ce document décrit l'implémentation de la base de données du projet MRA.

Il définit :

- les collections Firestore ;
- leurs responsabilités ;
- les relations entre les données ;
- les conventions de nommage ;
- la stratégie de numérotation ;
- l'organisation des documents dans Firebase Storage.

Ce document complète **DATA_MODEL.md**, qui décrit le modèle métier.

---

# 2. Technologies

La base de données repose sur les services Firebase suivants :

- **Cloud Firestore** : stockage des données métier
- **Firebase Authentication** : authentification des utilisateurs
- **Firebase Storage** : stockage des documents

---

# 3. Collections Firestore

| Collection      | Description                                    |
| --------------- | ---------------------------------------------- |
| people          | Personnes suivies par le MRA                   |
| requests        | Demandes de relation d'aide                    |
| appointments    | Rendez-vous                                    |
| interviews      | Entretiens                                     |
| contracts       | Contrats de prise en charge                    |
| cases           | Dossiers de prise en charge                    |
| case_activities | Activités réalisées pendant la prise en charge |
| case_history    | Historique des actions sur un dossier          |
| attachments     | Documents et pièces jointes                    |
| users           | Utilisateurs de l'application                  |
| counters        | Gestion des numéros séquentiels                |

---

# 4. Description des collections

## people

Contient les informations permanentes d'une personne.

Une personne peut avoir :

- plusieurs demandes ;
- plusieurs rendez-vous ;
- plusieurs entretiens ;
- plusieurs dossiers au cours de sa vie.

---

## requests

Contient les demandes de relation d'aide.

Chaque demande :

- appartient à une personne ;
- peut être affectée à un conseiller ;
- peut conduire à la création d'un dossier ;
- peut également être clôturée sans ouverture de dossier.

---

## appointments

Contient les rendez-vous planifiés.

Le rendez-vous est uniquement un **jalon dans le temps**.

Il sert à organiser les rencontres entre une personne et un conseiller.

Il ne contient aucun contenu d'entretien.

---

## interviews

Contient les comptes rendus des entretiens réalisés.

Un entretien :

- appartient à une personne ;
- peut être associé à une demande ;
- peut être lié à un rendez-vous ;
- peut être réalisé avant ou après l'ouverture d'un dossier.

Avant l'ouverture d'un dossier, l'entretien n'est rattaché à aucun dossier.

Après ouverture du dossier, les nouveaux entretiens sont associés au dossier concerné.

---

## contracts

Contient les contrats de prise en charge.

Le contrat formalise l'accord entre la personne et le ministère.

Sa signature permet l'ouverture du dossier.

---

## cases

Contient les dossiers de prise en charge.

Chaque dossier :

- est lié à une personne ;
- est lié à une demande ;
- est lié à un contrat ;
- possède un conseiller principal.

Le dossier représente le début officiel de l'accompagnement.

---

## case_activities

Contient les activités réalisées pendant la prise en charge.

Exemples :

- suivi ;
- note ;
- recommandation.

Les entretiens disposent de leur propre collection et ne sont donc pas stockés ici.

Toutes les activités sont rattachées à un dossier.

---

## case_history

Journal technique des événements du dossier.

Exemples :

- création ;
- changement de conseiller ;
- changement de statut ;
- clôture.

Ce journal assure la traçabilité des actions.

---

## attachments

Stocke les références des documents enregistrés dans Firebase Storage.

Les fichiers peuvent être associés à :

- une personne ;
- une demande ;
- un entretien ;
- un contrat ;
- un dossier ;
- une activité.

---

## users

Contient les utilisateurs autorisés à accéder à l'application.

Le profil utilisateur détermine :

- son rôle ;
- ses permissions ;
- son état (actif ou inactif).

---

## counters

Collection utilisée pour générer les numéros métier.

Exemples :

- numéro de personne ;
- numéro de demande ;
- numéro de rendez-vous ;
- numéro d'entretien ;
- numéro de contrat ;
- numéro de dossier.

---

# 5. Relations entre les collections

```text
people
│
├────────────── requests
│
├────────────── appointments
│
├────────────── interviews
│
├────────────── contracts
│
└────────────── cases
                    │
                    ├────────────── case_activities
                    │
                    ├────────────── case_history
                    │
                    └────────────── attachments

people ─────────────────────────► attachments

requests ───────────────────────► attachments

interviews ─────────────────────► attachments

contracts ──────────────────────► attachments
```

---

# 6. Numérotation

Les numéros métier sont générés automatiquement à partir de la collection **counters**.

Exemples :

**Personnes**

```text
MRA-P-000001
```

**Demandes**

```text
MRA-R-000001
```

**Rendez-vous**

```text
MRA-A-000001
```

**Entretiens**

```text
MRA-I-000001
```

**Contrats**

```text
MRA-T-000001
```

**Dossiers**

```text
MRA-C-000001
```

Les identifiants Firestore ne sont jamais utilisés comme numéros métier.

---

# 7. Firebase Storage

Les documents sont stockés dans Firebase Storage.

```text
storage/
│
├── people/
├── requests/
├── interviews/
├── contracts/
├── cases/
└── activities/
```

Chaque document est référencé dans la collection **attachments**.

---

# 8. Index Firestore

Les index seront créés selon les besoins des écrans de recherche et des tableaux de bord.

Les principaux champs concernés sont :

- personId
- requestId
- appointmentId
- interviewId
- contractId
- caseId
- assignedCounselorId
- primaryCounselorId
- status
- interviewDate
- appointmentDate
- createdAt
- updatedAt

---

# 9. Suppression des données

Les données métier ne sont jamais supprimées physiquement.

Les demandes et les dossiers suivent leur cycle de vie afin de conserver l'historique.

Les documents associés restent accessibles aux utilisateurs autorisés.

---

# 10. Sécurité

L'accès aux données est contrôlé par :

- Firebase Authentication ;
- les rôles et permissions de l'application ;
- les règles de sécurité Firestore ;
- les règles de sécurité Firebase Storage.

---

# 11. Évolutivité

La structure de la base de données est conçue pour permettre :

- l'ajout de nouveaux types d'activités ;
- l'ajout de nouveaux documents ;
- l'évolution des modules métier ;

sans remettre en cause les données existantes.

---

# 12. Conclusion

La base de données du MRA est organisée autour du **parcours de la personne**. Elle distingue clairement les objets métier (personnes, demandes, contrats, dossiers) des événements et activités (rendez-vous, entretiens, suivis, notes, recommandations). Cette organisation garantit une structure simple, cohérente et fidèle au fonctionnement réel du Ministère de la Relation d'Aide.

---

### Une seule recommandation

Je remplacerais **`case_activities`** par **`activities`**.

Pourquoi ?

Aujourd'hui, les activités sont effectivement liées à un dossier. Mais demain, vous pourriez vouloir enregistrer d'autres activités (par exemple une réunion interne, une visite à domicile préparatoire ou une action qui ne dépend pas d'un dossier). Un nom plus générique comme `activities` laisse cette possibilité tout en conservant le champ `caseId` pour rattacher une activité à un dossier lorsque c'est le cas.

Ce n'est pas indispensable pour la V1, mais c'est un petit choix de nommage qui peut faciliter l'évolution future sans compliquer le modèle actuel.
