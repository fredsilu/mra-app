// src/features/cases/case-history.service.ts

import {
  Timestamp,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import type {
  CaseHistoryAction,
  CaseHistoryEntry,
} from './case-history.types';

const COLLECTION_NAME = 'case_history';

const CASE_HISTORY_ACTIONS: CaseHistoryAction[] = [
  'CASE_CREATED',
  'COUNSELOR_CHANGED',
  'CASE_SUSPENDED',
  'CASE_REACTIVATED',
  'CASE_CLOSED',
];

function optionalText(
  value: unknown
): string | undefined {
  return typeof value === 'string' && value.trim()
    ? value.trim()
    : undefined;
}

function historyAction(
  value: unknown
): CaseHistoryAction {
  return CASE_HISTORY_ACTIONS.includes(
    value as CaseHistoryAction
  )
    ? (value as CaseHistoryAction)
    : 'CASE_CREATED';
}

function mapCaseHistoryEntry(
  id: string,
  data: Record<string, unknown>
): CaseHistoryEntry {
  return {
    id,
    caseId:
      typeof data.caseId === 'string'
        ? data.caseId
        : '',
    action: historyAction(data.action),
    description:
      typeof data.description === 'string'
        ? data.description
        : '',
    performedBy:
      typeof data.performedBy === 'string'
        ? data.performedBy
        : '',
    performedByName: optionalText(
      data.performedByName
    ),
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

  const historySnapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      where('caseId', '==', normalizedCaseId),
      orderBy('performedAt', 'desc')
    )
  );

  return historySnapshot.docs.map((item) =>
    mapCaseHistoryEntry(
      item.id,
      item.data()
    )
  );
}
