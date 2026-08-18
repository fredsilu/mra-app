//src/features/auth/auth.service.ts
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";

import { auth } from "@/config/firebase";

export async function loginWithEmail(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("EMAIL_REQUIRED");
  }

  if (!password) {
    throw new Error("PASSWORD_REQUIRED");
  }

  return signInWithEmailAndPassword(auth, normalizedEmail, password);
}

export async function logout() {
  return signOut(auth);
}

export async function resetPassword(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("EMAIL_REQUIRED");
  }

  return sendPasswordResetEmail(auth, normalizedEmail);
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("USER_NOT_AUTHENTICATED");
  }

  if (!user.email) {
    throw new Error("USER_EMAIL_MISSING");
  }

  if (!currentPassword) {
    throw new Error("CURRENT_PASSWORD_REQUIRED");
  }

  if (!newPassword) {
    throw new Error("NEW_PASSWORD_REQUIRED");
  }

  if (newPassword.length < 8) {
    throw new Error("NEW_PASSWORD_TOO_SHORT");
  }

  if (currentPassword === newPassword) {
    throw new Error("PASSWORDS_ARE_IDENTICAL");
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);

  await reauthenticateWithCredential(user, credential);

  await updatePassword(user, newPassword);
}
