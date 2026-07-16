//src/services/user.service.ts

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile } from '../types/user.types';

export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  const userReference = doc(db, 'users', uid);
  const userSnapshot = await getDoc(userReference);

  if (!userSnapshot.exists()) {
    return null;
  }

  const data = userSnapshot.data();

  return {
    uid: userSnapshot.id,
    email: data.email ?? '',
    displayName: data.displayName ?? '',
    role: data.role,
    isActive: data.isActive === true,
  } as UserProfile;
}