//src/services/person.service.ts
import {
     addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp ,
  where,
} from 'firebase/firestore';
import { orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Person } from '../types/person.types';

export async function createPerson(
    person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>
) {
    const docRef = await addDoc(collection(db, 'people'), {
        ...person,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return docRef.id;
}





export async function getPeople(): Promise<Person[]> {
  const q = query(
    collection(db, 'people'),
    where('isArchived', '==', false),
    orderBy('fullName')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Person, 'id'>),
  }));
}