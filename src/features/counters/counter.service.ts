//src/features/counters/counter.service.ts

import {
  doc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '@/config/firebase';

export async function getNextCounterValue(
  counterId: string
): Promise<number> {
  const counterRef = doc(db, 'counters', counterId);

  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(counterRef);

    const currentValue = snapshot.exists()
      ? Number(snapshot.data().value ?? 0)
      : 0;

    const nextValue = currentValue + 1;

    transaction.set(
      counterRef,
      {
        value: nextValue,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return nextValue;
  });
}