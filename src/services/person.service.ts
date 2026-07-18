// src/services/person.service.ts

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

import { db } from '../config/firebase';
import { Person } from '../types/person.types';

function normalizeName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function normalizePhone(value: string): string {
  let phone = value.replace(/\D/g, '');

  if (phone.startsWith('00')) {
    phone = phone.slice(2);
  }

  if (phone.startsWith('0')) {
    phone = `243${phone.slice(1)}`;
  }

  return phone;
}

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
): Promise<void> {
  const personReference = doc(db, 'people', personId);

  const updateData: Record<string, unknown> = {
    ...person,
    updatedAt: serverTimestamp(),
  };

  if (person.fullName !== undefined) {
    updateData.normalizedFullName = normalizeName(person.fullName);
  }

  if (person.phone !== undefined) {
    updateData.normalizedPhone = person.phone.trim()
      ? normalizePhone(person.phone)
      : '';
  }

  const cleanData = Object.fromEntries(
    Object.entries(updateData).filter(([, value]) => value !== undefined)
  );

  await updateDoc(personReference, cleanData);
}

export async function createPerson(
  person: Omit<Person, 'id' | 'mraNumber' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const peopleCollection = collection(db, 'people');

  const snapshot = await getDocs(peopleCollection);
  const nextNumber = snapshot.size + 1;

  const mraNumber = `MRA-${String(nextNumber).padStart(6, '0')}`;

  const personData = Object.fromEntries(
    Object.entries(person).filter(([, value]) => value !== undefined)
  );

  const docRef = await addDoc(peopleCollection, {
    ...personData,
    normalizedFullName: normalizeName(person.fullName),
    normalizedPhone: person.phone?.trim()
      ? normalizePhone(person.phone)
      : '',
    mraNumber,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getPeople(): Promise<Person[]> {
  const peopleQuery = query(
    collection(db, 'people'),
    where('isArchived', '==', false)
  );

  const snapshot = await getDocs(peopleQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<Person, 'id'>),
  }));
}

export async function findPersonByPhone(
  phone: string
): Promise<Person | null> {
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) {
    return null;
  }

  const snapshot = await getDocs(collection(db, 'people'));

  for (const document of snapshot.docs) {
    const data = document.data() as Omit<Person, 'id'> & {
      normalizedPhone?: string;
    };

    const storedPhone =
      data.normalizedPhone ||
      (data.phone ? normalizePhone(data.phone) : '');

    if (storedPhone === normalizedPhone) {
      return {
        id: document.id,
        ...data,
      };
    }
  }

  return null;
}

export async function findPeopleByExactName(
  fullName: string
): Promise<Person[]> {
  const normalizedFullName = normalizeName(fullName);

  if (!normalizedFullName) {
    return [];
  }

  const snapshot = await getDocs(collection(db, 'people'));

  return snapshot.docs
    .map((document) => {
      const data = document.data() as Omit<Person, 'id'> & {
        normalizedFullName?: string;
      };

      return {
        id: document.id,
        ...data,
      };
    })
    .filter((person) => {
      const storedName =
        person.normalizedFullName ||
        normalizeName(person.fullName);

      return storedName === normalizedFullName;
    });
}