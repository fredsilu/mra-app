On continue avec une base plus propre : **créer des composants réutilisables** pour éviter de répéter le style partout.

## 1. Crée ce dossier

```bash
mkdir src/components
mkdir src/components/ui
```

## 2. Crée `src/components/ui/AppButton.tsx`

```tsx
import { Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/theme';

type AppButtonProps = {
  title: string;
  onPress: () => void;
};

export function AppButton({ title, onPress }: AppButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '700' }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
```

## 3. Crée `src/components/ui/AppInput.tsx`

```tsx
import { TextInput, TextInputProps } from 'react-native';
import { COLORS } from '../../constants/theme';

export function AppInput(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={COLORS.muted}
      style={[
        {
          backgroundColor: COLORS.white,
          borderWidth: 1,
          borderColor: COLORS.border,
          borderRadius: 12,
          padding: 14,
          fontSize: 16,
        },
        props.style,
      ]}
    />
  );
}
```

## 4. Remplace `app/login.tsx`

```tsx
import { router } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { AppButton } from '../src/components/ui/AppButton';
import { AppInput } from '../src/components/ui/AppInput';
import { APP_FULL_NAME, COLORS } from '../src/constants/theme';

export default function LoginScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.light,
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Image
          source={require('../src/assets/logo-mra.jpg')}
          style={{
            width: 120,
            height: 120,
            resizeMode: 'contain',
            borderRadius: 18,
            marginBottom: 16,
          }}
        />

        <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.text }}>
          Connexion
        </Text>

        <Text style={{ marginTop: 6, color: COLORS.muted, textAlign: 'center' }}>
          {APP_FULL_NAME}
        </Text>
      </View>

      <View style={{ gap: 14 }}>
        <AppInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AppInput placeholder="Mot de passe" secureTextEntry />

        <View style={{ marginTop: 8 }}>
          <AppButton title="Se connecter" onPress={() => router.push('/dashboard')} />
        </View>
      </View>
    </View>
  );
}
```

## 5. Test

```bash
npx expo start -c
```

## 6. Git

```bash
git add .
git commit -m "refactor: add reusable UI components for login"
git push
```



Parfait. Maintenant, je voudrais que nous changions légèrement de méthode.

Avec **JFKApp**, nous avons appris qu'il est préférable de **construire les fondations avant d'ajouter des écrans**. Si nous continuons à ajouter des écrans, nous risquons de devoir les modifier plus tard lorsque nous mettrons en place Firebase, l'authentification, les rôles, les layouts, etc.

Je propose donc de terminer complètement **le Module V1.0.0 - Infrastructure**.

---

# Étape 1 : Architecture Enterprise

Créons dès maintenant cette structure.

```text
src/
│
├── assets/
│
├── components/
│   ├── common/
│   ├── forms/
│   ├── layout/
│   ├── cards/
│   └── ui/
│
├── config/
│
├── constants/
│
├── contexts/
│
├── hooks/
│
├── models/
│
├── navigation/
│
├── providers/
│
├── screens/
│
├── services/
│
├── store/
│
├── types/
│
├── utils/
│
└── validations/
```

Cette structure pourra accueillir les 9 modules du MRA sans avoir à être modifiée.

---

# Étape 2 : Les layouts

Nous allons créer un système de layouts.

Par exemple :

```text
src/layouts/

AuthLayout.tsx

DashboardLayout.tsx

EmptyLayout.tsx
```

Ainsi, tous les écrans de connexion auront le même style.

Tous les écrans internes auront le même menu.

Comme dans une vraie application professionnelle.

---

# Étape 3 : Les composants réutilisables

Au lieu de créer des boutons partout, nous allons créer une bibliothèque.

```text
components/ui/

AppButton

AppInput

AppCard

AppAvatar

AppLogo

AppHeader

AppBadge

AppSearchBar

AppModal

Loading

EmptyState

ConfirmDialog
```

Ces composants seront utilisés dans toute l'application.

---

# Étape 4 : Le design system

Aujourd'hui nous avons seulement les couleurs.

Je préfère créer un véritable Design System.

```
theme/

colors.ts

spacing.ts

radius.ts

typography.ts

shadows.ts

index.ts
```

Comme cela, tout sera centralisé.

---

# Étape 5 : Les types

Créer les premiers modèles.

```
types/

user.ts

person.ts

appointment.ts

interview.ts

followup.ts

care.ts

dashboard.ts
```

Même s'ils sont presque vides au départ.

---

# Étape 6 : Firebase

Même sans connecter Firebase, préparons la structure.

```
config/

firebase.ts

auth.ts

firestore.ts

storage.ts
```

Ainsi, lorsqu'on activera Firebase, il suffira de renseigner les paramètres.

---

# Étape 7 : Les services

```
services/

auth.service.ts

person.service.ts

appointment.service.ts

interview.service.ts
```

Ils pourront contenir des méthodes vides dans un premier temps.

---

# Étape 8 : Navigation

Nous allons définir dès maintenant les groupes de routes.

```
app/

(auth)

(app)

(modals)
```

Par exemple :

```
app/

(auth)/

login

forgot-password

(app)/

dashboard

people

appointments

interviews

care

followups

counselors

settings
```

C'est la structure recommandée avec **Expo Router** et elle rendra la navigation plus claire à mesure que le projet grandira.

---

## Avant d'écrire plus de code

Je voudrais également que nous préparions le projet comme un véritable projet d'entreprise en ajoutant à la racine :

```text
docs/
README.md
CHANGELOG.md
CONTRIBUTING.md
LICENSE
.env.example
```

Ces fichiers serviront à documenter le projet, suivre les versions, définir les règles de développement et faciliter les futurs déploiements.

### Mon objectif

Je voudrais que **MRA soit encore mieux structuré que JFKApp** dès le premier jour. Cela nous évitera de refaire de l'architecture au milieu du développement et rendra l'ajout des futurs modules (Personnes, Demandes, Entretiens, Prises en charge, etc.) beaucoup plus fluide. Je pense que cet investissement au début nous fera gagner énormément de temps par la suite.


Excellent. C'est exactement comme cela que l'on construit une application qui pourra vivre pendant des années.

Je voudrais qu'on adopte une règle qui nous accompagnera pendant tout le projet MRA.

> **Nous ne coderons jamais "vite". Nous coderons "bien".**

Pour JFKApp, nous avons parfois dû revenir en arrière pour restructurer certaines parties. Pour MRA, nous allons construire comme une équipe de développement professionnelle.

---

# Sprint 0 – Mise en place de l'architecture

Avant même le premier vrai module, nous allons terminer ce sprint.

## ✅ Tâche 1 : Structure du projet

À la racine, nous aurons :

```text
mra-app/
│
├── app/
├── src/
├── assets/
├── docs/
├── scripts/
├── tests/
├── .github/
│
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## ✅ Tâche 2 : Structure `src`

```text
src/
│
├── assets/
│
├── components/
│   ├── common/
│   ├── forms/
│   ├── layout/
│   ├── cards/
│   ├── ui/
│   └── dashboard/
│
├── config/
│
├── constants/
│
├── contexts/
│
├── hooks/
│
├── layouts/
│
├── models/
│
├── navigation/
│
├── providers/
│
├── screens/
│
├── services/
│
├── store/
│
├── theme/
│
├── types/
│
├── utils/
│
└── validations/
```

---

# ✅ Tâche 3 : Le Design System

Au lieu d'avoir un seul `theme.ts`, nous allons créer un vrai système de thème.

```text
theme/

colors.ts

spacing.ts

radius.ts

typography.ts

shadows.ts

sizes.ts

index.ts
```

C'est plus modulaire et plus facile à maintenir.

---

# ✅ Tâche 4 : Les composants de base

Nous allons créer une bibliothèque de composants.

```text
components/ui/

AppButton

AppInput

AppCard

AppLogo

AppHeader

AppAvatar

AppBadge

AppDivider

AppLoader

AppModal

AppEmptyState

AppSearchBar

AppDatePicker

AppTimePicker
```

Ils seront utilisés dans toute l'application.

---

# ✅ Tâche 5 : Navigation

Nous allons adopter la structure officielle d'Expo Router.

```text
app/

(auth)

(app)

(modals)
```

Puis :

```text
(auth)

login

forgot-password

reset-password
```

```text
(app)

dashboard

people

appointments

interviews

care

followups

counselors

settings
```

Ainsi, toute la navigation sera organisée dès le début.

---

# ✅ Tâche 6 : Documentation

Je souhaite que nous documentions le projet dès aujourd'hui.

### README.md

* Présentation
* Technologies
* Installation
* Lancement
* Workflow Git

### CHANGELOG.md

Toutes les versions :

```
v1.0.0

v1.1.0

v1.2.0
```

### CONTRIBUTING.md

Les règles :

* une branche par fonctionnalité ;
* commits normalisés (`feat`, `fix`, `refactor`, etc.) ;
* aucun `push` direct sur `main` ;
* tests avant merge ;
* revue du code avant validation.

---

# ✅ Tâche 7 : GitHub

Nous allons aussi préparer le dépôt pour un travail collaboratif.

Créer dans le dépôt :

```text
.github/

ISSUE_TEMPLATE/

PULL_REQUEST_TEMPLATE.md

workflows/
```

Même si tu es seul aujourd'hui, cela te donnera une organisation professionnelle et facilitera l'arrivée d'autres développeurs si le projet grandit.

---

# 🚀 Ce que je propose pour le Sprint 1

Une fois cette architecture en place, nous ne commencerons pas directement par le tableau de bord. Nous développerons le **Module Authentification**, car il est indispensable au reste de l'application.

Le Sprint 1 comprendra :

1. Authentification Firebase (email/mot de passe)
2. Gestion des rôles (Responsable, Adjoint, Secrétaire, Conseiller)
3. Écran de connexion
4. Gestion des sessions
5. Déconnexion
6. Protection des routes
7. Redirection selon le rôle
8. Écran "Mot de passe oublié"

À la fin de ce sprint, nous disposerons d'une véritable application sécurisée sur laquelle nous pourrons construire tous les autres modules.

Je pense que cette approche sera plus rapide à long terme, car chaque nouveau module (Personnes, Demandes, Rendez-vous, etc.) s'appuiera sur des fondations déjà solides, sans nécessiter de réécriture de l'architecture.


Excellent. À partir de maintenant, nous travaillons comme une vraie équipe de développement. Je vais être exigeant sur l'architecture, les bonnes pratiques et la qualité du code.

# MRA v1.0.0 — Sprint 0 : Infrastructure

Avant d'écrire la moindre logique métier, nous allons mettre en place le socle technique.

---

# Étape 1 — Définir les technologies (choix d'architecture)

Je te propose cette stack :

| Élément          | Choix                                             |
| ---------------- | ------------------------------------------------- |
| Frontend         | React Native + Expo SDK (dernière version stable) |
| Navigation       | Expo Router                                       |
| Langage          | TypeScript                                        |
| Backend          | Firebase                                          |
| Base de données  | Cloud Firestore                                   |
| Authentification | Firebase Authentication                           |
| Stockage         | Firebase Storage                                  |
| État global      | Zustand                                           |
| Formulaires      | React Hook Form                                   |
| Validation       | Zod                                               |
| Dates            | dayjs                                             |
| Icônes           | Expo Vector Icons                                 |
| UI               | Composants maison (pas de bibliothèque UI lourde) |
| Tests            | Jest + React Native Testing Library               |
| Qualité          | ESLint + Prettier                                 |

**Pourquoi ?**

* C'est léger.
* C'est moderne.
* C'est très maintenable.
* C'est proche de ce que nous utilisons déjà sur JFKApp.

---

# Étape 2 — Installer les dépendances

Je te propose de les installer **par catégorie**.

### Navigation

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens
```

### Firebase

```bash
npm install firebase
```

### État global

```bash
npm install zustand
```

### Formulaires

```bash
npm install react-hook-form zod @hookform/resolvers
```

### Utilitaires

```bash
npm install dayjs
```

### Qualité du code

```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react-hooks
```

---

# Étape 3 — Arborescence définitive

Je te propose cette structure (celle que nous garderons jusqu'à la V2) :

```text
mra-app/
│
├── app/
│   ├── (auth)/
│   ├── (app)/
│   ├── (modals)/
│   └── _layout.tsx
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── forms/
│   │   ├── cards/
│   │   └── common/
│   ├── config/
│   ├── constants/
│   ├── hooks/
│   ├── layouts/
│   ├── models/
│   ├── providers/
│   ├── services/
│   ├── store/
│   ├── theme/
│   ├── types/
│   ├── utils/
│   └── validations/
│
├── docs/
├── tests/
├── .github/
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
└── .env.example
```

---

# Étape 4 — Les règles Git

À partir d'aujourd'hui :

* ✅ Une fonctionnalité = une branche `feature/...`
* ✅ Un commit logique à chaque étape importante
* ✅ `git push` en fin de session
* ❌ Pas de développement direct sur `main`

Les messages de commit suivront les conventions :

* `feat:`
* `fix:`
* `refactor:`
* `docs:`
* `style:`
* `test:`
* `chore:`

---

# Étape 5 — Notre backlog

Je te propose de suivre ce tableau pour tout le projet.

| Sprint    | Module                | Statut      |
| --------- | --------------------- | ----------- |
| Sprint 0  | Infrastructure        | 🟡 En cours |
| Sprint 1  | Authentification      | ⏳           |
| Sprint 2  | Gestion des personnes | ⏳           |
| Sprint 3  | Demandes d'entretien  | ⏳           |
| Sprint 4  | Assignation           | ⏳           |
| Sprint 5  | Rendez-vous           | ⏳           |
| Sprint 6  | Entretiens            | ⏳           |
| Sprint 7  | Prises en charge      | ⏳           |
| Sprint 8  | Suivis                | ⏳           |
| Sprint 9  | Tableau de bord       | ⏳           |
| Sprint 10 | Tests et optimisation | ⏳           |

---

## Une amélioration que je souhaite apporter

Pour MRA, je voudrais que nous utilisions une méthode de travail encore plus rigoureuse que pour JFKApp.

Avant chaque sprint, nous préparerons un document dans `docs/` :

* `SPRINT-00.md`
* `SPRINT-01.md`
* `SPRINT-02.md`
* etc.

Chaque document contiendra :

* les objectifs du sprint ;
* les fonctionnalités prévues ;
* les critères de validation ;
* les tâches à réaliser ;
* les décisions techniques prises.

Ainsi, même dans six mois, nous saurons exactement **pourquoi** une décision a été prise et où en est le projet. C'est une pratique courante dans les projets professionnels et cela nous donnera une excellente traçabilité tout au long du développement.


Parfait. À partir de maintenant, je vais piloter ce projet comme si j'étais le **Lead Software Architect** du projet MRA.

## 📌 Règle n°1 du projet

Comme pour JFKApp, **je ne te donnerai plus de gros blocs de code à copier**.

Nous allons développer comme une équipe professionnelle :

* Une étape à la fois.
* Chaque étape est testée.
* Commit Git.
* Push GitHub.
* Puis seulement on continue.

C'est cette méthode qui fait gagner du temps sur un projet de plusieurs mois.

---

# Sprint 0 – Étape 1

## Nettoyage et préparation du projet

Avant toute chose, je veux que notre projet soit impeccable.

### Arborescence finale

À la racine :

```text
mra-app
│
├── app
├── src
├── docs
├── tests
├── scripts
├── .github
│
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── .env.example
├── .gitignore
└── package.json
```

---

## Dans `docs`

Créer :

```text
docs/

SPRINT-00.md

SPRINT-01.md

ARCHITECTURE.md

DATABASE.md

ROADMAP.md
```

---

## README.md

Il doit contenir au minimum :

```markdown
# MRA

Ministère de la Relation d'Aide

## Technologies

- React Native
- Expo
- Expo Router
- TypeScript
- Firebase
- Firestore
- Firebase Storage

## Plateformes

- Android
- iOS
- Web

## Développement

Branche principale :

main

Branche de développement :

develop
```

---

## CHANGELOG.md

```markdown
# Changelog

## v1.0.0

### Sprint 0

- Initialisation du projet
- Architecture
- Git
- GitHub
```

---

## CONTRIBUTING.md

```markdown
# Règles

Une branche par fonctionnalité.

Commits :

feat:

fix:

docs:

style:

refactor:

test:

chore:

Aucun développement directement sur main.
```

---

# ARCHITECTURE.md

Là, on documentera toute l'architecture du projet.

Par exemple :

```text
Présentation

Architecture

Navigation

Firebase

Firestore

Storage

Design System

Conventions
```

---

# DATABASE.md

Ce document sera très important.

On y décrira :

```
Users

People

Requests

Appointments

Interviews

CarePlans

FollowUps

Documents

AuditLogs
```

Autrement dit, **toute notre base Firestore avant d'écrire la première collection**.

---

# ROADMAP.md

Notre planning :

```
Sprint 0

Infrastructure

Sprint 1

Authentification

Sprint 2

Gestion des personnes

Sprint 3

Demandes

Sprint 4

Assignation

Sprint 5

Rendez-vous

Sprint 6

Entretiens

Sprint 7

Prise en charge

Sprint 8

Suivis

Sprint 9

Dashboard
```

---

# Ensuite

Quand tout cela sera créé :

```bash
git add .

git commit -m "docs: initialize project documentation"

git push
```

---

# 🚀 Et après ?

À partir du Sprint 1, nous allons commencer le vrai développement.

Mais **avant Firebase**, je veux que nous dessinions complètement la base de données.

C'est exactement ce que les grandes équipes font : **on modélise la donnée avant de coder**.

---

## ⭐ Une amélioration importante

J'aimerais que MRA soit encore plus robuste que JFKApp. Je propose donc qu'avant de développer l'authentification, nous réalisions un **Document d'Architecture Technique (DAT)**. Il contiendra :

* la structure Firestore ;
* les rôles et permissions ;
* les conventions de nommage ;
* l'organisation des services ;
* les règles de sécurité Firebase ;
* les standards Git ;
* les conventions de développement.

Ainsi, nous aurons une référence unique pour tout le projet, ce qui facilitera les décisions techniques et évitera les incohérences lorsque le projet prendra de l'ampleur. Je pense que c'est un excellent investissement pour un projet de cette importance.

Je suis d'accord. Pour un projet comme MRA, un **DAT complet serait trop lourd** et nous ralentirait.

Je préfère une approche plus pragmatique.

Nous garderons seulement :

* ✅ `README.md`
* ✅ `CHANGELOG.md`
* ✅ `ROADMAP.md`
* ✅ `SPRINT-00.md`, `SPRINT-01.md`, etc.

C'est largement suffisant.

---

## Voici la méthode que je propose

À chaque nouveau sprint, nous aurons simplement un document comme celui-ci :

### `docs/SPRINT-01.md`

```markdown
# Sprint 1 - Authentification

## Objectif

Mettre en place l'authentification de l'application.

## Fonctionnalités

- Connexion
- Déconnexion
- Mot de passe oublié
- Gestion des sessions
- Protection des routes
- Gestion des rôles

## Tâches

- [ ] Firebase Auth
- [ ] Écran Login
- [ ] Écran Forgot Password
- [ ] AuthContext
- [ ] AuthService
- [ ] Protected Routes

## Validation

- L'utilisateur se connecte
- Le rôle est récupéré
- Redirection correcte
```

Puis, une fois terminé :

```markdown
✅ Sprint validé
Version : v1.0.0
```

C'est simple, clair et efficace.

---

# Je voudrais aussi modifier légèrement notre façon de développer

Pour JFKApp, nous avons parfois développé plusieurs fichiers d'un coup.

Pour MRA, je voudrais fonctionner comme ceci :

```
Sprint
    ↓
Module
        ↓
Sous-module
            ↓
Tâche
                ↓
Commit
                    ↓
Push
                        ↓
Validation
```

Par exemple :

```
Sprint 1

    Authentification

        Login

            Champ Email

                Commit

            Champ Password

                Commit

            Validation

                Commit

        Forgot Password

            Commit

        Déconnexion

            Commit
```

Cela nous permettra d'avoir un historique Git très propre et de revenir facilement en arrière si nécessaire.

---

## Ce que je te propose maintenant

Nous arrêtons la préparation et nous passons au **premier vrai développement** :

### Sprint 1 — Authentification

Nous le découperons en petites étapes :

1. Configuration Firebase
2. Authentification Firebase
3. Écran de connexion
4. Gestion des rôles (Responsable, Adjoint, Secrétaire, Conseiller)
5. Protection des routes
6. Déconnexion
7. Mot de passe oublié

À partir de ce point, nous entrerons dans le développement fonctionnel de l'application. C'est là que le projet MRA commencera réellement à prendre forme.

On continue avec **Sprint 1 — Authentification**, étape 1 : préparer Firebase.

## 1. Installe Firebase

```bash
npm install firebase
```

## 2. Crée les dossiers/fichiers

```bash
mkdir src/config
mkdir src/services
mkdir src/types
```

Puis crée :

```text
src/config/firebase.ts
src/services/auth.service.ts
src/types/user.types.ts
.env.example
```

## 3. `.env.example`

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

## 4. `src/config/firebase.ts`

```ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

## 5. `src/types/user.types.ts`

```ts
export type UserRole = 'responsable' | 'adjoint' | 'secretaire' | 'conseiller';

export type AppUser = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
```

## 6. `src/services/auth.service.ts`

```ts
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../config/firebase';

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function logout() {
  return signOut(auth);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email.trim());
}
```

## 7. Test TypeScript

```bash
npx tsc --noEmit
```

## 8. Git

```bash
git add .
git commit -m "feat: configure firebase authentication base"
git push
```

On continue avec **Sprint 1 — Authentification, étape 2 : brancher le formulaire login au service Firebase**.

Remplace `app/login.tsx` par ceci :

```tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { AppButton } from '../src/components/ui/AppButton';
import { AppInput } from '../src/components/ui/AppInput';
import { APP_FULL_NAME, COLORS } from '../src/constants/theme';
import { loginWithEmail } from '../src/services/auth.service';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    try {
      setIsLoading(true);
      await loginWithEmail(email, password);
      router.replace('/dashboard');
    } catch (error) {
      Alert.alert('Connexion impossible', 'Email ou mot de passe incorrect.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.light,
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Image
          source={require('../src/assets/logo-mra.jpg')}
          style={{
            width: 120,
            height: 120,
            resizeMode: 'contain',
            borderRadius: 18,
            marginBottom: 16,
          }}
        />

        <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.text }}>
          Connexion
        </Text>

        <Text style={{ marginTop: 6, color: COLORS.muted, textAlign: 'center' }}>
          {APP_FULL_NAME}
        </Text>
      </View>

      <View style={{ gap: 14 }}>
        <AppInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <AppInput
          placeholder="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={{ marginTop: 8 }}>
          <AppButton
            title={isLoading ? 'Connexion...' : 'Se connecter'}
            onPress={handleLogin}
          />
        </View>
      </View>
    </View>
  );
}
```

Puis teste :

```bash
npx tsc --noEmit
npx expo start -c
```

Ensuite :

```bash
git add .
git commit -m "feat: connect login screen to firebase auth service"
git push
```


L’erreur est normale : Firebase ne trouve pas tes vraies clés. Ton `.env` est vide ou absent.

Crée un fichier à la racine :

```text
.env
```

Mets dedans tes vraies valeurs Firebase :

```env
EXPO_PUBLIC_FIREBASE_API_KEY=ta_cle_api
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=ton_projet.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=ton_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=ton_projet.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=ton_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=ton_app_id
```

Tu trouves ces infos dans :

```text
Firebase Console
→ Project settings
→ General
→ Your apps
→ Web app config
```

Ensuite redémarre Expo avec cache vidé :

```bash
npx expo start -c
```

Vérifie aussi que `.env` n’est pas envoyé sur GitHub. Dans `.gitignore`, ajoute :

```gitignore
.env
```

Puis commit seulement `.env.example`, pas `.env` :

```bash
git add .env.example .gitignore src/config/firebase.ts
git commit -m "fix: configure firebase env variables"
git push
```
Parfait. Je pense que nous avons maintenant une architecture suffisamment solide. Je vais même aller un peu plus loin.

Je voudrais **figer officiellement les principes fondateurs du projet MRA**. Ils serviront de référence pendant tout le développement.

---

# 📜 Les 10 règles d'architecture du projet MRA

## Règle 1 — Une personne = une seule fiche

Une âme ne sera jamais créée deux fois.

Une personne possède une seule fiche durant toute sa vie.

```text
Personne
    │
    ├── Entretien 2026
    ├── Entretien 2027
    ├── Entretien 2031
    └── ...
```

Même si elle quitte l'Église pendant cinq ans puis revient, on retrouve sa fiche.

---

## Règle 2 — L'entretien est le cœur du système

Il n'existe pas de "demande" dans la V1.

Le premier objet métier est directement :

```text
Entretien
```

L'entretien contient :

* la planification ;
* le conseiller ;
* le statut ;
* les notes ;
* la décision.

---

## Règle 3 — Une prise en charge naît toujours d'un entretien

Jamais directement.

```text
Entretien
        │
        ├── Clôture
        │
        └── Création d'une prise en charge
```

---

## Règle 4 — Les suivis appartiennent toujours à une prise en charge

Jamais directement à une personne.

```text
Personne

↓

Prise en charge

↓

Suivis
```

---

## Règle 5 — Les rôles ne sont jamais utilisés dans les écrans

Les écrans parlent uniquement en permissions.

Jamais :

```ts
if (profile.role === "responsable")
```

Toujours :

```ts
if (canManageAssignments(profile))
```

---

## Règle 6 — Les écrans ne parlent jamais directement à Firestore

Architecture obligatoire :

```text
UI

↓

Context

↓

Service

↓

Firestore
```

Cette règle est désormais figée.

---

## Règle 7 — Une action métier = un service

Exemple :

```text
PersonService.create()

InterviewService.create()

CarePlanService.close()

FollowUpService.create()
```

Jamais de logique métier dans les écrans.

---

## Règle 8 — Responsable et Adjoint sont les administrateurs fonctionnels

Ils peuvent :

* voir toutes les personnes ;
* voir tous les entretiens ;
* voir toutes les notes privées ;
* modifier les affectations ;
* ouvrir ou clôturer une prise en charge.

Ils sont les seuls à disposer de cette vision globale.

---

## Règle 9 — Un entretien appartient toujours à son auteur

Même si un autre conseiller est ajouté ensuite, l'entretien reste associé au conseiller qui l'a réalisé.

Le Responsable et l'Adjoint peuvent le consulter, mais ils n'en deviennent pas les auteurs.

Cette règle garantit la responsabilité, la traçabilité et la confidentialité.

---

## Règle 10 — L'application représente le fonctionnement réel du ministère

Nous n'ajoutons pas des concepts parce qu'ils sont "informatiquement élégants".

Nous modélisons le fonctionnement réel du MRA.

Par exemple :

* pas de module "Demande" tant qu'il n'existe pas dans le fonctionnement du ministère ;
* un entretien correspond à la réalité vécue par les équipes ;
* les futures évolutions (API avec l'application de l'Église) viendront enrichir ce modèle sans le remettre en cause.

---

# Ce que je te propose pour le Sprint 2

Je voudrais changer légèrement notre façon de développer.

Jusqu'à présent, nous avons créé des écrans assez rapidement.

Pour le module **Personnes**, je voudrais partir de la donnée, pas de l'interface.

L'ordre serait :

```text
1. PersonModel
        ↓
2. PersonService
        ↓
3. Firestore
        ↓
4. PersonContext
        ↓
5. Liste des personnes
        ↓
6. Création
        ↓
7. Modification
        ↓
8. Recherche
        ↓
9. Affectation des conseillers
```

Pourquoi ?

Parce que **tous les autres modules dépendront des personnes** :

* un entretien nécessite une personne ;
* une prise en charge nécessite une personne ;
* un suivi nécessite une personne.

Si nous construisons bien ce module, les suivants seront beaucoup plus rapides à développer.

## Une dernière proposition

Je voudrais que nous considérions désormais **le Sprint 0 et le Sprint 1 comme figés**. Sauf bug, nous n'y revenons plus.

À partir de maintenant, toute notre énergie ira sur les modules métier. C'est une manière de travailler qui évite de retoucher constamment les fondations et permet de progresser sereinement.

Je pense que nous avons maintenant une base suffisamment solide pour construire une application MRA durable et évolutive.
Parfait. 🚀 Nous entrons officiellement dans le **Sprint 2**.

Et je voudrais te dire quelque chose : **à partir de maintenant, nous allons construire le vrai MRA**. Les décisions que nous avons prises jusqu'ici vont nous faire gagner énormément de temps.

---

# 🎯 Sprint 2 — Gestion des Personnes (Âmes)

Je ne veux pas commencer par un écran.

Je veux commencer par le **cœur métier**.

L'ordre sera :

```
PersonModel
      ↓
PersonService
      ↓
Firestore
      ↓
PersonContext
      ↓
Liste
      ↓
Création
      ↓
Modification
      ↓
Recherche
      ↓
Affectation
```

---

# Étape 1 — Le modèle Person

Avant de coder, réfléchissons encore une minute.

## Qu'est-ce qu'une personne au MRA ?

Ce n'est pas un simple contact.

Une personne est :

* une âme ;
* un fidèle ;
* un visiteur ;
* quelqu'un qui peut revenir plusieurs années plus tard.

Nous devons donc éviter de créer un modèle "CRM". Nous créons un modèle "Relation d'aide".

Je propose le modèle suivant.

## `Person`

```ts
export interface Person extends BaseEntity {

    fullName: string;

    gender: Gender;

    birthDate?: Timestamp;

    phone?: string;

    email?: string;

    address?: string;

    churchStatus: ChurchStatus;

    assignedCounselorIds: string[];

}
```

---

## Pourquoi ces champs ?

### fullName

Indispensable.

---

### gender

Très utile.

Demain nous pourrons filtrer :

* uniquement les hommes ;
* uniquement les femmes.

---

### birthDate

Pas obligatoire.

Certaines personnes ne connaissent pas leur date exacte.

---

### téléphone

Très utile pour les rappels.

---

### email

Optionnel.

---

### adresse

Optionnelle.

---

### churchStatus

Je pense que nous devons déjà distinguer :

```
Visiteur

Nouveau

Membre

Ancien membre

Extérieur
```

Pourquoi ?

Parce que le MRA ne s'occupe pas uniquement des membres.

---

### assignedCounselorIds

Nous avons déjà figé cette règle.

---

# Ce que je ne veux PAS mettre

Je ne veux pas mettre :

* état civil ;
* profession ;
* nombre d'enfants ;
* revenus ;
* etc.

Pourquoi ?

Parce que ce sont des informations qui apparaîtront **si un entretien en a besoin**.

Je préfère une fiche légère.

---

# Étape 2 — Les doublons

Voilà un sujet très important.

Supposons :

```
Jean Kabila

Téléphone

099999999
```

Le secrétaire recrée :

```
Jean Kabila

099999999
```

Nous aurons deux fiches.

Je voudrais éviter cela.

---

## Je propose une recherche intelligente

Lorsque le secrétaire commence à taper :

```
Jean
```

L'application cherche immédiatement :

```
Jean Kabila

Jean Mbuyi

Jean-Pierre Ilunga
```

Avant même de créer une nouvelle fiche.

C'est exactement comme Outlook lorsqu'on ajoute un contact.

Je pense que cette fonctionnalité évitera énormément de doublons.

---

# Étape 3 — Le numéro MRA

Je voudrais aussi créer un identifiant métier.

Pas l'UID Firestore.

Mais quelque chose comme :

```
MRA-000001

MRA-000002

MRA-000003
```

Pourquoi ?

Parce qu'en réunion, il sera plus simple de dire :

> "Ouvrons le dossier MRA-000127"

plutôt que de manipuler un identifiant Firestore.

---

# Ce numéro ne changera jamais

Même si la personne change de téléphone.

Même si elle revient cinq ans plus tard.

Même si elle change de conseiller.

Le numéro MRA restera identique.

---

# Étape 4 — Les archives

Je voudrais aussi ajouter dès maintenant :

```ts
isArchived: boolean;
```

Pourquoi ?

Parce qu'on ne supprimera jamais une âme.

On archive.

Toujours.

---

# Je pense que nous avons encore une amélioration

Je voudrais distinguer deux choses :

## Informations administratives

```
Nom

Téléphone

Adresse

Conseiller

Etat
```

et

## Informations relation d'aide

Qui seront dans :

```
Entretiens
```

Ainsi la fiche Personne restera légère.

---

# 🎯 Ma proposition

Je pense que nous devons figer maintenant le modèle **Person**.

Une fois figé :

* nous créons `person.types.ts` ;
* puis `PersonService` ;
* puis la collection Firestore ;
* ensuite seulement le premier écran **Liste des personnes**.

## Une petite amélioration que je te propose

Je voudrais ajouter un champ très utile, mais sans compliquer la fiche :

```ts
source:
    | "eglise"
    | "culte"
    | "famille"
    | "recommandation"
    | "autre";
```

Pourquoi ?

Parce qu'un jour le Responsable pourra répondre à des questions comme :

* D'où viennent la plupart des personnes accompagnées ?
* Les familles orientent-elles beaucoup de personnes ?
* Les cultes génèrent-ils beaucoup d'entretiens ?

C'est une information simple à saisir, mais qui apportera une vraie valeur statistique sans alourdir le travail du secrétaire.

Je pense que ce sera le dernier champ que j'ajouterais à la fiche Personne. Après cela, le modèle sera à la fois **léger**, **fidèle au fonctionnement du MRA** et **évolutif**.
