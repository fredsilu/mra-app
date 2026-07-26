Parfait. Alors je propose que nous repartions sur des bases professionnelles, exactement comme nous l'avons fait pour **JFKApp**.

Je veux que le MRA devienne un projet dont, dans deux ans, on puisse encore comprendre chaque décision.

# MRA - Plan de reconstruction de l'architecture

Nous allons travailler en **5 étapes**.

## Étape 1 — Geler l'architecture (maintenant)

Pendant cette étape :

* ❌ aucun nouveau développement
* ❌ aucune nouvelle collection Firestore
* ❌ aucune nouvelle fonctionnalité

Nous produisons uniquement la documentation officielle.

Livrables :

* ✅ ARCHITECTURE.md
* ✅ DATA_MODEL.md
* ✅ WORKFLOWS.md
* ✅ DEVELOPMENT_GUIDE.md
* ✅ ROADMAP.md

Lorsque ces documents seront validés, ils deviendront notre référence.

---

# Étape 2 — Audit complet

Nous relisons ensuite **100 % du projet**.

Pour chaque module, nous répondrons systématiquement à ces questions :

## Métier

Est-ce que cela correspond au fonctionnement réel du MRA ?

## Fonctionnel

Est-ce que l'utilisateur comprend naturellement le workflow ?

## Technique

Le code est-il propre ?

## Architecture

Le module respecte-t-il notre architecture ?

À la fin, chaque module recevra une décision :

```text
CONSERVER
```

ou

```text
MODIFIER
```

ou

```text
SUPPRIMER
```

---

# Étape 3 — Réorganisation

Une fois l'audit terminé :

* restructuration des routes Expo Router ;
* nettoyage des imports ;
* réorganisation des dossiers `src` ;
* correction des modèles.

Toujours **sans ajouter de fonctionnalités**.

---

# Étape 4 — Développement

Ce n'est qu'à partir de ce moment-là que nous reprendrons le développement :

```
Demandes

↓

Agenda

↓

Premier entretien

↓

Décision

↓

Prise en charge

↓

Activités

↓

Documents
```

---

# Étape 5 — Stabilisation

Une fois la V1 terminée :

* tests complets ;
* optimisation ;
* sécurité ;
* préparation de la V2.

---

# Une nouvelle règle de gouvernance

Je te propose également une règle que nous n'avions pas sur JFKApp.

## Chaque décision d'architecture devra être validée selon trois axes

### Validation métier

Est-ce que cela correspond réellement au fonctionnement du MRA ?

### Validation fonctionnelle

Est-ce que cela sera simple pour les utilisateurs ?

### Validation technique

Est-ce que cela restera maintenable dans cinq ans ?

Une décision ne sera considérée comme adoptée que lorsque les trois validations seront positives.

---

# Une deuxième règle

À partir d'aujourd'hui, **aucune décision d'architecture ne sera prise uniquement parce qu'elle est techniquement élégante**.

Le métier sera toujours prioritaire.

Autrement dit :

```
Métier
    ↓
Fonctionnel
    ↓
Technique
```

et jamais l'inverse.

Je pense que c'est une leçon importante que nous tirons de cette phase d'audit.

---

# Enfin, je voudrais ajouter un document qui n'était pas prévu

En plus des cinq documents, je créerais un sixième :

## DECISIONS.md

C'est un journal des décisions d'architecture.

Par exemple :

```
2026-07-26

Décision 001

Une personne peut posséder plusieurs dossiers de prise en charge.

Justification :
Une même personne peut être accompagnée plusieurs fois au cours de sa vie.

Impact :
Collection people inchangée.
Collection cases liée à people.
```

Puis :

```
Décision 002

Une demande est obligatoire avant toute ouverture de dossier.

Justification :
Le fonctionnement réel du MRA commence toujours par une demande.

Impact :
Le module Cases ne crée plus directement de dossier.
```

Et ainsi de suite.

C'est ce document qui nous évitera de retomber dans des contradictions ou de perdre le contexte plusieurs semaines plus tard.

## Mon objectif

Mon objectif n'est plus seulement de t'aider à développer l'application. Je veux que nous construisions un projet dont :

* l'architecture est documentée ;
* chaque décision est traçable ;
* un nouveau développeur puisse rejoindre le projet et comprendre son fonctionnement en quelques heures ;
* les évolutions futures se fassent sans remettre en cause les fondations.

Je suis convaincu que cet investissement en amont nous fera gagner énormément de temps et évitera de nombreuses régressions pendant le reste du développement.


Tu as raison. On arrête d’ajouter des couches.

Nous gardons seulement **3 documents utiles** :

```text
docs/
├── ARCHITECTURE.md
├── DATA_MODEL.md
└── ROADMAP.md
```

Pas d’ADR séparés, pas de multiples guides, pas de bureaucratie.

Et maintenant, on avance ainsi :

1. **Finaliser l’architecture**
2. **Finaliser le modèle de données**
3. **Réorganiser les routes**
4. **Corriger Requests**
5. **Corriger Cases**
6. **Reprendre le développement**

La prochaine étape est donc claire : **rédiger directement `ARCHITECTURE.md` avec les décisions déjà validées**, puis passer immédiatement à `DATA_MODEL.md`.
