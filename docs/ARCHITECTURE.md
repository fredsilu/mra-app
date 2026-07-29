Je suis d'accord avec l'esprit de ce document. Je ferais simplement quelques ajustements pour qu'il reflète ce que nous avons décidé ensemble, sans ajouter de complexité.

---

# ARCHITECTURE.md

# MRA - Architecture du projet

## 1. Objectif

L'application MRA (Ministère de la Relation d'Aide) permet de gérer le parcours d'une personne, depuis sa demande de relation d'aide jusqu'à la clôture de son accompagnement.

L'application permet notamment de gérer :

* les personnes ;
* les demandes ;
* les rendez-vous ;
* les entretiens ;
* les contrats de prise en charge ;
* les dossiers ;
* les activités du dossier (entretiens, suivis, notes, recommandations...) ;
* les utilisateurs et leurs permissions ;
* la traçabilité des actions.

---

# 2. Principes d'architecture

Le projet est construit autour de quatre principes.

### 1. Le métier pilote le développement

Toute décision technique doit respecter le fonctionnement réel du Ministère de la Relation d'Aide.

L'application s'adapte au ministère, jamais l'inverse.

### 2. Une responsabilité = un module

Chaque module possède :

* ses types ;
* ses services ;
* ses composants ;
* ses écrans.

### 3. Une seule source de vérité

Une information ne doit jamais être dupliquée.

Exemple :

Le dossier référence la personne et la demande sans recopier inutilement leurs informations.

### 4. Principe de simplicité

> **Si une fonctionnalité peut être réalisée simplement sans perdre en qualité, nous privilégions toujours la solution la plus simple.**

Nous évitons :

* les couches inutiles ;
* les workflows artificiels ;
* les fonctionnalités qui ne répondent pas à un besoin métier réel.

---

# 3. Parcours principal

```text
Personne
    ↓
Demande
    ↓
Affectation
    ↓
Rendez-vous (0..n)
    ↓
Entretien(s) (0..n)
    │
    ├── Fin du parcours
    │
    └── Si prise en charge
            ↓
     Signature du contrat
            ↓
     Création du dossier
            ↓
        Accompagnement
            ├── Entretiens
            ├── Suivis
            ├── Notes
            ├── Recommandations
            └── Clôture
```

> Les échanges entre conseillers, les validations internes ou les décisions pastorales ne sont pas modélisés dans l'application. Le MRA enregistre les faits du parcours, sans gérer le processus interne de décision.

---

# 4. Modules

Le projet est composé des modules suivants :

* Authentification
* Personnes
* Demandes
* Rendez-vous
* Entretiens
* Contrats
* Dossiers
* Utilisateurs
* Agenda
* Logistique

Le dossier regroupe ensuite les activités de prise en charge :

* Entretiens
* Suivis
* Notes
* Recommandations
* Clôture

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
Agenda
    ↓
Dossiers
    ↓
Utilisateurs
```

---

# 6. Architecture technique

Chaque module suit la même organisation.

```text
features/
    module/
        types.ts
        service.ts
        components/
```

Les écrans Expo Router utilisent uniquement les services.

Les services communiquent avec Firestore.

Les écrans ne communiquent jamais directement avec Firestore.

---

# 7. Firestore

Collections principales :

```text
people
requests
appointments
interviews
contracts
cases
case_activities
users
attachments
counters
```

Les activités du dossier (entretiens, suivis, notes, recommandations...) sont regroupées dans `case_activities`.

---

# 8. Règles métier

* Une personne peut avoir plusieurs demandes.
* Une personne peut avoir plusieurs rendez-vous.
* Une personne peut avoir plusieurs entretiens avant l'ouverture d'un dossier.
* Une demande peut donner lieu à un seul dossier.
* Un dossier ne peut pas exister sans demande.
* Un dossier est créé après la signature du contrat.
* Une fois le dossier créé, toutes les activités de prise en charge lui sont rattachées.
* Les suppressions physiques des données métier sont interdites.

---

# 9. Sécurité

Les permissions sont basées sur les rôles MRA.

Les écrans vérifient les permissions.

Firestore applique les mêmes règles.

Aucune sécurité ne repose uniquement sur l'interface utilisateur.

---

# 10. Vision du projet

Le MRA doit rester :

* simple à utiliser ;
* fidèle au fonctionnement réel du ministère ;
* facile à maintenir ;
* évolutif.

**Principe fondamental :**

> **Le MRA est un outil d'accompagnement du ministère, pas un outil qui impose son fonctionnement. Il enregistre les faits du parcours de la personne, sans alourdir le travail des conseillers.**

---

Je n'ai volontairement fait que des ajustements issus de nos décisions récentes (suppression de la notion de "décision" comme module, ajout des rendez-vous et des entretiens, clarification du rôle du dossier et du principe de simplicité), sans transformer la structure de ton document. Je pense que cette version peut devenir la référence du projet.
