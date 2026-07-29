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
