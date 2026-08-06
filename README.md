# Nettoyage du module Utilisateurs

## 1. Copier les fichiers

Copier à la racine du projet en conservant l'arborescence :

- `src/features/users/user.types.ts`
- `src/features/users/user.service.ts`
- `src/permissions/index.ts`
- `firestore.rules`

## 2. Corriger automatiquement les trois écrans

Depuis la racine de `mra-app` :

```powershell
powershell -ExecutionPolicy Bypass -File .\apply-ui-cleanup.ps1
```

Le script retire `Logistique` de :

- `app/(app)/users/form.tsx`
- `app/(app)/users/index.tsx`
- `app/(app)/users/user-create.tsx`

## 3. Vérifier

```powershell
npx tsc --noEmit
firebase deploy --only firestore:rules
```

Le déploiement des règles nécessite Firebase CLI et une connexion au bon projet.
