# DATABASE.md

# MRA – Architecture de la base de données

Version : 1.0
Statut : Validé

---

# 1. Objectif

Ce document décrit l'implémentation de la base de données du projet MRA.

Il définit :

* les collections Firestore ;
* leurs responsabilités ;
* les relations entre les données ;
* les conventions de nommage ;
* la stratégie de numérotation ;
* l'organisation des documents dans Firebase Storage.

Ce document complète **DATA_MODEL.md**, qui décrit le modèle métier.

---

# 2. Technologies

La base de données repose sur les services Firebase suivants :

* **Cloud Firestore** : stockage des données métier
* **Firebase Authentication** : authentification des utilisateurs
* **Firebase Storage** : stockage des documents

---

# 3. Collections Firestore

La base de données est composée des collections suivantes.

| Collection      | Description                                    |
| --------------- | ---------------------------------------------- |
| people          | Personnes suivies par le MRA                   |
| requests        | Demandes d'entretien                           |
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

Une personne :

* peut avoir plusieurs demandes ;
* peut avoir plusieurs dossiers de prise en charge.

---

## requests

Contient les demandes d'entretien.

Chaque demande :

* appartient à une personne ;
* peut aboutir à un dossier de prise en charge ;
* peut également être clôturée sans ouverture de dossier.

---

## cases

Contient les dossiers de prise en charge.

Chaque dossier :

* est lié à une demande ;
* est lié à une personne ;
* possède un conseiller principal.

---

## case_activities

Contient toutes les activités réalisées pendant une prise en charge.

Exemples :

* entretien ;
* suivi ;
* recommandation.

Toutes les activités sont rattachées à un dossier.

---

## case_history

Journal des événements du dossier.

Exemples :

* création ;
* affectation ;
* changement de conseiller ;
* changement de statut ;
* clôture.

Ce journal permet d'assurer la traçabilité des actions.

---

## attachments

Stocke les références des documents enregistrés dans Firebase Storage.

Les fichiers peuvent être associés à :

* une personne ;
* une demande ;
* un dossier ;
* une activité.

---

## users

Contient les utilisateurs autorisés à accéder à l'application.

Le profil utilisateur détermine :

* son rôle ;
* ses permissions ;
* son état (actif ou inactif).

---

## counters

Collection utilisée pour générer les numéros séquentiels.

Exemples :

* numéro de personne ;
* numéro de demande ;
* numéro de dossier.

---

# 5. Relations entre les collections

```text
people
   │
   ├──────────────┐
   │              │
   ▼              ▼
requests       cases
   │              │
   │              ├──────────────┐
   │              │              │
   ▼              ▼              ▼
case_activities  case_history  attachments

people ───────────────────────► attachments

requests ─────────────────────► attachments
```

---

# 6. Numérotation

Les numéros métier sont générés automatiquement à partir de la collection **counters**.

Exemples :

**Personnes**

```text
MRA-P-000001
MRA-P-000002
```

**Demandes**

```text
MRA-R-000001
MRA-R-000002
```

**Dossiers**

```text
MRA-C-000001
MRA-C-000002
```

Les identifiants Firestore ne sont jamais utilisés comme numéros métier.

---

# 7. Firebase Storage

Les documents sont stockés dans Firebase Storage.

Organisation proposée :

```text
storage/
│
├── people/
├── requests/
├── cases/
└── activities/
```

Chaque document est référencé dans la collection **attachments**.

---

# 8. Index Firestore

Les index seront créés en fonction des besoins des écrans de recherche et des tableaux de bord.

Les principaux champs concernés sont notamment :

* personId
* requestId
* caseId
* status
* assignedCounselorId
* primaryCounselorId
* createdAt
* updatedAt

---

# 9. Suppression des données

Les données métier ne sont pas supprimées physiquement.

Les dossiers et demandes sont clôturés selon leur cycle de vie afin de conserver l'historique.

Les documents associés restent accessibles aux utilisateurs autorisés.

---

# 10. Sécurité

L'accès aux données est contrôlé par :

* Firebase Authentication ;
* les rôles et permissions de l'application ;
* les règles de sécurité Firestore ;
* les règles de sécurité Firebase Storage.

---

# 11. Sauvegarde et évolutivité

La structure de la base de données est conçue pour permettre :

* l'ajout de nouvelles collections ;
* l'ajout de nouveaux modules ;
* l'évolution des workflows métier ;

sans remettre en cause les données existantes.

---

# 12. Conclusion

La base de données du MRA est organisée autour des principaux objets métier du ministère : les personnes, les demandes d'entretien et les dossiers de prise en charge. Cette organisation garantit la cohérence des données, leur traçabilité et leur évolutivité tout en restant simple à maintenir.
