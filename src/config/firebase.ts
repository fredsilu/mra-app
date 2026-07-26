// src/config/firebase.ts

import {
  FirebaseApp,
  getApps,
  initializeApp,
} from 'firebase/app';
import {
  Auth,
  getAuth,
} from 'firebase/auth';
import {
  Firestore,
  getFirestore,
} from 'firebase/firestore';
import {
  FirebaseStorage,
  getStorage,
} from 'firebase/storage';

const getRequiredEnvironmentVariable = (
  name: string,
  value: string | undefined
): string => {
  const sanitizedValue = value?.trim();

  if (!sanitizedValue) {
    throw new Error(
      `Configuration Firebase incomplète : la variable ${name} est absente ou vide.`
    );
  }

  return sanitizedValue;
};

const firebaseConfig = {
  apiKey: getRequiredEnvironmentVariable(
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY
  ),

  authDomain: getRequiredEnvironmentVariable(
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
  ),

  projectId: getRequiredEnvironmentVariable(
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID
  ),

  storageBucket: getRequiredEnvironmentVariable(
    'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
  ),

  messagingSenderId: getRequiredEnvironmentVariable(
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  ),

  appId: getRequiredEnvironmentVariable(
    'EXPO_PUBLIC_FIREBASE_APP_ID',
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID
  ),
};

/**
 * Une clé API Firebase Web commence normalement par "AIza".
 * Ce contrôle permet d'identifier rapidement une valeur incorrecte.
 */
if (!firebaseConfig.apiKey.startsWith('AIza')) {
  throw new Error(
    'La variable EXPO_PUBLIC_FIREBASE_API_KEY ne contient pas une clé API Web Firebase valide. Recopie la valeur "apiKey" depuis Firebase Console > Paramètres du projet > Général > Vos applications.'
  );
}

/**
 * Application Firebase principale.
 */
export const app: FirebaseApp =
  getApps().find(
    (firebaseApp) =>
      firebaseApp.name === '[DEFAULT]'
  ) ??
  initializeApp(firebaseConfig);

/**
 * Application Firebase secondaire.
 *
 * Elle permet au responsable connecté de créer
 * un nouvel utilisateur sans être lui-même déconnecté.
 */
const USER_CREATION_APP_NAME =
  'user-creation';

export const userCreationApp: FirebaseApp =
  getApps().find(
    (firebaseApp) =>
      firebaseApp.name ===
      USER_CREATION_APP_NAME
  ) ??
  initializeApp(
    firebaseConfig,
    USER_CREATION_APP_NAME
  );

export const auth: Auth =
  getAuth(app);

export const userCreationAuth: Auth =
  getAuth(userCreationApp);

export const db: Firestore =
  getFirestore(app);

export const storage: FirebaseStorage =
  getStorage(app);