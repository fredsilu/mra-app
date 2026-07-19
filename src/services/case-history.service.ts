// src/services/case-history.service.ts

import {
  Timestamp,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

import { db } from '../config/firebase';

import {
  CaseHistoryAction,
  CaseHistoryEntry,
} from '../types/case-history.types';

const COLLECTION_NAME = 'case_history';

function readString(
  value: unknown
): string | undefined {
  return typeof value === 'string'
    ? value
    : undefined;
}

function mapCaseHistoryEntry(
  id: string,
  data: Record<string, unknown>
): CaseHistoryEntry {
  return {
    id,

    caseId:
      readString(data.caseId) ?? '',

    action:
      (data.action as CaseHistoryAction) ??
      'STATUS_CHANGED',

    description:
      readString(data.description) ?? '',

    performedBy:
      readString(data.performedBy) ?? '',

    performedAt:
      data.performedAt instanceof Timestamp
        ? data.performedAt
        : Timestamp.now(),
  };
}

export async function getCaseHistory(
  caseId: string
): Promise<CaseHistoryEntry[]> {
  const normalizedCaseId = caseId.trim();

  if (!normalizedCaseId) {
    return [];
  }

  const historyQuery = query(
    collection(db, COLLECTION_NAME),
    where(
      'caseId',
      '==',
      normalizedCaseId
    ),
    orderBy(
      'performedAt',
      'desc'
    )
  );

  const historySnapshot =
    await getDocs(historyQuery);

  return historySnapshot.docs.map(
    (historyDocument) =>
      mapCaseHistoryEntry(
        historyDocument.id,
        historyDocument.data()
      )
  );
}