Parfait. Nous figeons également le modèle de données.

Nous passons au dernier document : **ROADMAP.md**.

L'objectif est qu'il soit simple, concret et qu'il reflète exactement notre façon de travailler.

---

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
