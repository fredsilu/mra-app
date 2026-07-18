//src/services/user.service.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '../config/firebase';
import {
  UserProfile,
  UserRole,
} from '../types/user.types';

type UpdateUserProfileData = {
  displayName?: string;
  role?: UserRole;
  isActive?: boolean;
};

function mapUserProfile(
  id: string,
  data: Record<string, unknown>
): UserProfile {
  return {
    uid: id,
    email:
      typeof data.email === 'string'
        ? data.email
        : '',
    displayName:
      typeof data.displayName === 'string'
        ? data.displayName
        : '',
    role: data.role as UserRole,
    isActive: data.isActive === true,
  };
}

export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  const userReference = doc(db, 'users', uid);
  const userSnapshot = await getDoc(userReference);

  if (!userSnapshot.exists()) {
    return null;
  }

  return mapUserProfile(
    userSnapshot.id,
    userSnapshot.data()
  );
}

export async function getUserById(
  uid: string
): Promise<UserProfile | null> {
  return getUserProfile(uid);
}

export async function getUsers(): Promise<UserProfile[]> {
  const usersQuery = query(
    collection(db, 'users'),
    orderBy('displayName', 'asc')
  );

  const usersSnapshot = await getDocs(usersQuery);

  return usersSnapshot.docs.map((userDocument) =>
    mapUserProfile(
      userDocument.id,
      userDocument.data()
    )
  );
}

export async function updateUserProfile(
  uid: string,
  data: UpdateUserProfileData
): Promise<void> {
  const userReference = doc(db, 'users', uid);

  const updateData: UpdateUserProfileData = {};

  if (data.displayName !== undefined) {
    updateData.displayName = data.displayName.trim();
  }

  if (data.role !== undefined) {
    updateData.role = data.role;
  }

  if (data.isActive !== undefined) {
    updateData.isActive = data.isActive;
  }

  if (Object.keys(updateData).length === 0) {
    return;
  }

  await updateDoc(userReference, updateData);
}

export async function getActiveCounselors(): Promise<
  UserProfile[]
> {
  const counselorsQuery = query(
    collection(db, 'users'),
    where('role', '==', 'conseiller'),
    where('isActive', '==', true)
  );

  const counselorsSnapshot = await getDocs(
    counselorsQuery
  );

  const counselors = counselorsSnapshot.docs.map(
    (userDocument) =>
      mapUserProfile(
        userDocument.id,
        userDocument.data()
      )
  );

  return counselors.sort((a, b) =>
    a.displayName.localeCompare(
      b.displayName,
      'fr',
      {
        sensitivity: 'base',
      }
    )
  );
}