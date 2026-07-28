//src/features/users/user.service.ts

import {
  createUserWithEmailAndPassword,
  deleteUser,
  signOut,
} from 'firebase/auth';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import {
  db,
  userCreationAuth,
} from '@/config/firebase';

import {
  UserProfile,
  UserRole,
} from '@/features/users/user.types';

type UpdateUserProfileData = {
  displayName?: string;
  role?: UserRole;
  isActive?: boolean;
};

export type CreateUserProfileData = {
  displayName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
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
  const normalizedUid = uid.trim();

  if (!normalizedUid) {
    return null;
  }

  const userReference = doc(
    db,
    'users',
    normalizedUid
  );

  const userSnapshot =
    await getDoc(userReference);

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

export async function getUsers(): Promise<
  UserProfile[]
> {
  const usersQuery = query(
    collection(db, 'users'),
    orderBy('displayName', 'asc')
  );

  const usersSnapshot =
    await getDocs(usersQuery);

  return usersSnapshot.docs.map(
    (userDocument) =>
      mapUserProfile(
        userDocument.id,
        userDocument.data()
      )
  );
}

export async function createUserProfile(
  data: CreateUserProfileData
): Promise<string> {
  const displayName =
    data.displayName.trim();

  const email =
    data.email.trim().toLowerCase();

  const password = data.password;

  if (!displayName) {
    throw new Error(
      'DISPLAY_NAME_REQUIRED'
    );
  }

  if (!email) {
    throw new Error('EMAIL_REQUIRED');
  }

  if (password.length < 6) {
    throw new Error(
      'PASSWORD_TOO_SHORT'
    );
  }

  let createdUser:
    | Awaited<
        ReturnType<
          typeof createUserWithEmailAndPassword
        >
      >
    | undefined;

  try {
    createdUser =
      await createUserWithEmailAndPassword(
        userCreationAuth,
        email,
        password
      );

    const uid = createdUser.user.uid;

    await setDoc(
      doc(db, 'users', uid),
      {
        uid,
        displayName,
        email,
        role: data.role,
        isActive: data.isActive,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );

    return uid;
  } catch (error) {
    if (createdUser?.user) {
      try {
        await deleteUser(
          createdUser.user
        );
      } catch (rollbackError) {
        console.error(
          'Impossible de supprimer le compte après échec de création du profil :',
          rollbackError
        );
      }
    }

    throw error;
  } finally {
    try {
      await signOut(
        userCreationAuth
      );
    } catch (signOutError) {
      console.error(
        'Impossible de fermer la session secondaire :',
        signOutError
      );
    }
  }
}

async function getActiveResponsables(): Promise<
  UserProfile[]
> {
  const responsablesQuery = query(
    collection(db, 'users'),
    where(
      'role',
      '==',
      'responsable'
    ),
    where(
      'isActive',
      '==',
      true
    )
  );

  const responsablesSnapshot =
    await getDocs(responsablesQuery);

  return responsablesSnapshot.docs.map(
    (userDocument) =>
      mapUserProfile(
        userDocument.id,
        userDocument.data()
      )
  );
}

async function ensureLastActiveResponsableIsProtected(
  currentUser: UserProfile,
  data: UpdateUserProfileData
): Promise<void> {
  const isCurrentlyActiveResponsable =
    currentUser.role ===
      'responsable' &&
    currentUser.isActive;

  if (!isCurrentlyActiveResponsable) {
    return;
  }

  const willLoseResponsableRole =
    data.role !== undefined &&
    data.role !== 'responsable';

  const willBeDeactivated =
    data.isActive === false;

  if (
    !willLoseResponsableRole &&
    !willBeDeactivated
  ) {
    return;
  }

  const activeResponsables =
    await getActiveResponsables();

  const otherActiveResponsables =
    activeResponsables.filter(
      (responsable) =>
        responsable.uid !==
        currentUser.uid
    );

  if (
    otherActiveResponsables.length === 0
  ) {
    throw new Error(
      'LAST_ACTIVE_RESPONSABLE'
    );
  }
}

export async function updateUserProfile(
  uid: string,
  data: UpdateUserProfileData
): Promise<void> {
  const normalizedUid = uid.trim();

  if (!normalizedUid) {
    throw new Error(
      'USER_ID_REQUIRED'
    );
  }

  const userReference = doc(
    db,
    'users',
    normalizedUid
  );

  const userSnapshot =
    await getDoc(userReference);

  if (!userSnapshot.exists()) {
    throw new Error(
      'USER_NOT_FOUND'
    );
  }

  const currentUser = mapUserProfile(
    userSnapshot.id,
    userSnapshot.data()
  );

  const updateData: UpdateUserProfileData =
    {};

  if (
    data.displayName !== undefined
  ) {
    const normalizedDisplayName =
      data.displayName.trim();

    if (!normalizedDisplayName) {
      throw new Error(
        'DISPLAY_NAME_REQUIRED'
      );
    }

    if (
      normalizedDisplayName !==
      currentUser.displayName
    ) {
      updateData.displayName =
        normalizedDisplayName;
    }
  }

  if (
    data.role !== undefined &&
    data.role !== currentUser.role
  ) {
    updateData.role = data.role;
  }

  if (
    data.isActive !== undefined &&
    data.isActive !==
      currentUser.isActive
  ) {
    updateData.isActive =
      data.isActive;
  }

  if (
    Object.keys(updateData).length ===
    0
  ) {
    return;
  }

  await ensureLastActiveResponsableIsProtected(
    currentUser,
    updateData
  );

  await updateDoc(
    userReference,
    {
      ...updateData,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function getActiveCounselors(): Promise<
  UserProfile[]
> {
  const counselorsQuery = query(
    collection(db, 'users'),
    where(
      'role',
      '==',
      'conseiller'
    ),
    where(
      'isActive',
      '==',
      true
    )
  );

  const counselorsSnapshot =
    await getDocs(counselorsQuery);

  const counselors =
    counselorsSnapshot.docs.map(
      (userDocument) =>
        mapUserProfile(
          userDocument.id,
          userDocument.data()
        )
    );

  return counselors.sort(
    (firstCounselor, secondCounselor) =>
      firstCounselor.displayName.localeCompare(
        secondCounselor.displayName,
        'fr',
        {
          sensitivity: 'base',
        }
      )
  );
}