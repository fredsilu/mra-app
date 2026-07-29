import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import { getNextCounterValue } from '@/features/counters/counter.service';
import { Person, PersonFormValues } from './person.types';

function normalizeName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function normalizePhone(value: string): string {
  let phone = value.replace(/\D/g, '');
  if (phone.startsWith('00')) phone = phone.slice(2);
  if (phone.startsWith('0')) phone = `243${phone.slice(1)}`;
  return phone;
}

function cleanValues(values: Partial<PersonFormValues>) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined)
  );
}

export async function getPersonById(personId: string): Promise<Person | null> {
  const snapshot = await getDoc(doc(db, 'people', personId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...(snapshot.data() as Omit<Person, 'id'>) };
}

export async function getPeople(): Promise<Person[]> {
  const snapshot = await getDocs(
    query(collection(db, 'people'), where('isArchived', '==', false))
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Person, 'id'>),
  }));
}

export async function createPerson(values: PersonFormValues): Promise<string> {
  const number = await getNextCounterValue('people');
  const reference = doc(collection(db, 'people'));

  await setDoc(reference, {
    ...cleanValues(values),
    normalizedFullName: normalizeName(values.fullName),
    normalizedPhone: values.phone?.trim() ? normalizePhone(values.phone) : '',
    mraNumber: `MRA-P-${String(number).padStart(6, '0')}`,
    isArchived: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return reference.id;
}

export async function updatePerson(
  personId: string,
  values: Partial<PersonFormValues> & { isArchived?: boolean }
): Promise<void> {
  const data: Record<string, unknown> = {
    ...cleanValues(values),
    updatedAt: serverTimestamp(),
  };

  if (values.fullName !== undefined) {
    data.normalizedFullName = normalizeName(values.fullName);
  }
  if (values.phone !== undefined) {
    data.normalizedPhone = values.phone.trim()
      ? normalizePhone(values.phone)
      : '';
  }

  await updateDoc(doc(db, 'people', personId), data);
}

export async function findPersonByPhone(phone: string): Promise<Person | null> {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) return null;

  const snapshot = await getDocs(
    query(
      collection(db, 'people'),
      where('normalizedPhone', '==', normalizedPhone)
    )
  );
  const match = snapshot.docs[0];
  return match
    ? { id: match.id, ...(match.data() as Omit<Person, 'id'>) }
    : null;
}

export async function findPeopleByExactName(fullName: string): Promise<Person[]> {
  const normalizedFullName = normalizeName(fullName);
  if (!normalizedFullName) return [];

  const snapshot = await getDocs(
    query(
      collection(db, 'people'),
      where('normalizedFullName', '==', normalizedFullName)
    )
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Person, 'id'>),
  }));
}
