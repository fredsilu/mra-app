// src/config/firebase.ts

import {
  getApp,
  getApps,
  initializeApp,
} from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY,

  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,

  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,

  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,

  messagingSenderId:
    process.env
      .EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,

  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const missingFirebaseVariables =
  Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

if (missingFirebaseVariables.length > 0) {
  throw new Error(
    `Configuration Firebase incomplète. Variables manquantes : ${missingFirebaseVariables.join(
      ', '
    )}`
  );
}

/**
 * Application Firebase principale.
 * Elle conserve la session de l’utilisateur connecté.
 */
export const app =
  getApps().find(
    (firebaseApp) =>
      firebaseApp.name === '[DEFAULT]'
  ) ??
  initializeApp(firebaseConfig);

/**
 * Application Firebase secondaire.
 * Elle sert uniquement à créer de nouveaux comptes
 * sans déconnecter le responsable connecté.
 */
const userCreationAppName = 'user-creation';

export const userCreationApp =
  getApps().find(
    (firebaseApp) =>
      firebaseApp.name === userCreationAppName
  ) ??
  initializeApp(
    firebaseConfig,
    userCreationAppName
  );

export const auth = getAuth(app);

export const userCreationAuth =
  getAuth(userCreationApp);

export const db = getFirestore(app);

export const storage = getStorage(app);