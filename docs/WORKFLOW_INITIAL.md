# WORKFLOW_INITIAL.md

# MRA – Workflows fonctionnels

Version : 1.0  
Statut : Validé

---

# 1. Objectif

Ce document décrit les principaux processus fonctionnels du Ministère de la Relation d'Aide (MRA).

Il présente les différentes étapes suivies par les utilisateurs de l'application, depuis l'arrivée d'une personne jusqu'à la clôture éventuelle de son dossier de prise en charge.

---

# 2. Workflow global

```text
Personne
    ↓
Nouvelle demande
    ↓
Affectation d'un conseiller
    ↓
Planification du premier entretien
    ↓
Entretien initial
    ↓
Décision

    ├── Demande refusée
    │        ↓
    │    Clôture de la demande
    │
    ├── Orientation
    │        ↓
    │    Clôture de la demande
    │
    └── Prise en charge acceptée
              ↓
      Signature du contrat
              ↓
      Ouverture du dossier
              ↓
      Entretiens
              ↓
      Suivis
              ↓
      Recommandations
              ↓
      Clôture du dossier
```

---

# 3. Gestion d'une personne

## Étapes

1. Rechercher si la personne existe déjà.
2. Si elle n'existe pas, créer sa fiche.
3. Enregistrer les informations personnelles.
4. La personne devient disponible pour les demandes d'entretien.

---

# 4. Gestion d'une demande

## Création

1. Sélection de la personne.
2. Création de la demande.
3. Enregistrement du motif.
4. Définition de la priorité.
5. Enregistrement du demandeur si nécessaire.
6. Sauvegarde de la demande.

---

## Affectation

1. Le responsable consulte les nouvelles demandes.
2. Il choisit un conseiller.
3. La demande est affectée.
4. Le conseiller est notifié.

---

## Premier entretien

1. Le conseiller planifie le rendez-vous.
2. Le premier entretien est réalisé.
3. Les observations sont enregistrées.
4. Le conseiller prépare sa décision.

---

## Décision

À l'issue du premier entretien, trois possibilités existent.

### Cas 1 : Refus de la prise en charge

La demande est clôturée.

Aucun dossier n'est créé.

---

### Cas 2 : Orientation

La personne est orientée vers un autre service.

La demande est clôturée.

Aucun dossier n'est créé.

---

### Cas 3 : Prise en charge acceptée

La personne accepte la prise en charge.

Le contrat est signé.

Le dossier est créé.

---

# 5. Gestion d'un dossier

## Ouverture

Le dossier est créé à partir de la demande acceptée.

Le conseiller principal est enregistré.

Le numéro de dossier est généré.

---

## Suivi

Pendant toute la durée de la prise en charge, le conseiller peut enregistrer :

- des entretiens ;
- des suivis ;
- des recommandations.

Chaque activité est conservée dans l'historique du dossier.

---

## Changement de conseiller

Si nécessaire :

1. un nouveau conseiller est désigné ;
2. le dossier est mis à jour ;
3. le changement est enregistré dans l'historique.

---

## Clôture

Lorsque la prise en charge est terminée :

1. un entretien final est réalisé ;
2. le motif de clôture est enregistré ;
3. le dossier est clôturé.

Le dossier reste consultable mais ne peut plus être modifié.

---

# 6. Gestion des documents

Des documents peuvent être associés à :

- une personne ;
- une demande ;
- un dossier ;
- une activité.

Les documents sont enregistrés dans Firebase Storage et référencés dans la base de données.

---

# 7. Gestion des utilisateurs

Le responsable du MRA peut :

- créer un utilisateur ;
- modifier ses informations ;
- activer ou désactiver son compte ;
- gérer son rôle et ses permissions.

---

# 8. Tableau de bord

Le tableau de bord permet notamment de consulter :

- les nouvelles demandes ;
- les dossiers actifs ;
- les rendez-vous à venir ;
- les activités récentes ;
- les principaux indicateurs du ministère.

---

# 9. Fin du workflow

Le workflow est terminé lorsque :

- la demande est clôturée sans prise en charge ;

ou

- le dossier de prise en charge est clôturé.

Toutes les informations restent conservées afin de garantir la traçabilité et l'historique du ministère.


Nous respecterons toujours cette méthode :

Auditer → Planifier → Déplacer → Tester → Mettre à jour ROADMAP → Passer au module suivant.