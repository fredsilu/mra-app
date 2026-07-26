//src/services/auth.service.ts
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { auth } from '@/config/firebase';

export async function loginWithEmail(
  email: string,
  password: string
) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error('EMAIL_REQUIRED');
  }

  if (!password) {
    throw new Error('PASSWORD_REQUIRED');
  }

  return signInWithEmailAndPassword(
    auth,
    normalizedEmail,
    password
  );
}

export async function logout() {
  return signOut(auth);
}

export async function resetPassword(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error('EMAIL_REQUIRED');
  }

  return sendPasswordResetEmail(
    auth,
    normalizedEmail
  );
}