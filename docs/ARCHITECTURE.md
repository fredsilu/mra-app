Parfait. Je pense que nous avons trouvé le bon équilibre : **être professionnels sans transformer le projet en usine à gaz**.

Je te propose un `ARCHITECTURE.md` qui tient en 4 à 5 pages maximum et qui servira de référence pendant tout le projet.

---

# ARCHITECTURE.md

# MRA - Architecture du projet

## 1. Objectif

L'application MRA (Ministère de la Relation d'Aide) permet de gérer l'ensemble du processus de relation d'aide de l'ICC, depuis la demande d'entretien jusqu'à la clôture de la prise en charge.

L'application doit permettre :

* la gestion des personnes ;
* la gestion des demandes d'entretien ;
* la gestion des dossiers de prise en charge ;
* le suivi des entretiens et recommandations ;
* la gestion des utilisateurs et des permissions ;
* la traçabilité complète des actions.

---

# 2. Principes d'architecture

Le projet est construit autour de trois principes.

### 1. Le métier pilote le développement

Toute décision technique doit respecter le fonctionnement réel du MRA.

### 2. Une responsabilité = un module

Chaque module possède :

* ses types
* ses services
* ses écrans

### 3. Une seule source de vérité

Une information ne doit jamais être dupliquée.

Exemple :

Le nom de la demande ne doit pas être recopié dans le dossier.

Le dossier référence simplement la demande.

---

# 3. Workflow principal

```text
Personne
    ↓
Demande
    ↓
Affectation
    ↓
Premier entretien
    ↓
Décision

    ├── Refus
    │      ↓
    │   Fin
    │
    └── Acceptation
            ↓
        Signature contrat
            ↓
     Dossier de prise en charge
            ↓
      Entretiens
            ↓
         Suivis
            ↓
     Recommandations
            ↓
      Clôture
```

---

# 4. Modules

Le projet est composé des modules suivants :

* Authentification
* Personnes
* Demandes
* Dossiers
* Activités
* Documents
* Utilisateurs
* Agenda
* Logistique

Chaque module est indépendant.

---

# 5. Navigation

```text
Connexion

↓

Dashboard

↓

Personnes

↓

Demandes

↓

Dossiers

↓

Agenda

↓

Utilisateurs
```

---

# 6. Architecture technique

Chaque module suit la même structure.

```text
feature/
    types
    services
    components
```

Les écrans Expo Router utilisent les services.

Les services communiquent avec Firestore.

Les écrans ne communiquent jamais directement avec Firestore.

---

# 7. Firestore

Collections principales :

```text
people
requests
cases
case_activities
case_history
users
attachments
counters
```

---

# 8. Règles importantes

* Une personne peut avoir plusieurs demandes.
* Une personne peut avoir plusieurs dossiers au cours de sa vie.
* Une demande peut créer au maximum un dossier.
* Un dossier ne peut pas exister sans demande.
* Un dossier ne peut être créé qu'après une décision positive et la signature du contrat.
* Toutes les actions importantes sont historisées.
* Les suppressions physiques sont interdites pour les données métier.

---

# 9. Sécurité

Les permissions sont basées sur les rôles MRA.

Les écrans vérifient les permissions.

Firestore applique les mêmes règles.

Aucune sécurité ne repose uniquement sur l'interface utilisateur.

---

# 10. Objectif du projet

Le projet doit rester :

* simple à comprendre ;
* facile à maintenir ;
* évolutif ;
* fidèle au fonctionnement réel du MRA.

---

## Une seule amélioration que je souhaiterais apporter

J'ajouterais un principe qui, selon moi, va énormément nous aider :

### **Principe de simplicité**

> **Si une fonctionnalité peut être réalisée de manière simple sans perdre en qualité, nous choisirons toujours la solution la plus simple.**

Cela signifie que nous éviterons :

* les abstractions inutiles ;
* les couches supplémentaires sans valeur métier ;
* les optimisations prématurées.

Je pense que ce principe correspond bien à ta remarque : **"avançons et ne compliquons pas les choses"**.

À partir de maintenant, chaque fois que nous hésiterons entre une solution "très élégante" et une solution "simple et robuste", nous choisirons la seconde. C'est souvent ce qui donne les applications les plus faciles à faire évoluer sur le long terme.
