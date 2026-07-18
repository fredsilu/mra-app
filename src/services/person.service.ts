//src/services/person.service.ts

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Person } from '../types/person.types';

export async function getPersonById(
  personId: string
): Promise<Person | null> {
  const personReference = doc(db, 'people', personId);
  const snapshot = await getDoc(personReference);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Person, 'id'>),
  };
}

export async function updatePerson(
  personId: string,
  person: Partial<
    Omit<Person, 'id' | 'mraNumber' | 'createdAt' | 'updatedAt'>
  >
) {
  const personReference = doc(db, 'people', personId);

  await updateDoc(personReference, {
    ...person,
    updatedAt: serverTimestamp(),
  });
}

export async function createPerson(
  person: Omit<Person, 'id' | 'mraNumber' | 'createdAt' | 'updatedAt'>
) {
  const peopleCollection = collection(db, 'people');

  // Comptage simple (V1)
  const snapshot = await getDocs(peopleCollection);
  const nextNumber = snapshot.size + 1;

  const mraNumber = `MRA-${String(nextNumber).padStart(6, '0')}`;

  const docRef = await addDoc(peopleCollection, {
    ...person,
    mraNumber,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}





export async function getPeople(): Promise<Person[]> {
  const q = query(
    collection(db, 'people'),
    where('isArchived', '==', false),

  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Person, 'id'>),
  }));
}