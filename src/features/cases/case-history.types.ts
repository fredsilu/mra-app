// src/features/cases/case-history.types.ts

import type { Timestamp } from 'firebase/firestore';

export type CaseHistoryAction =
  | 'CASE_CREATED'
  | 'COUNSELOR_CHANGED'
  | 'CASE_SUSPENDED'
  | 'CASE_REACTIVATED'
  | 'CASE_CLOSED';

export interface CaseHistoryEntry {
  id: string;
  caseId: string;
  action: CaseHistoryAction;
  description: string;
  performedBy: string;
  performedByName?: string;
  performedAt: Timestamp;
}

export const CASE_HISTORY_ACTION_LABELS: Record<
  CaseHistoryAction,
  string
> = {
  CASE_CREATED: 'Dossier créé',
  COUNSELOR_CHANGED: 'Conseiller remplacé',
  CASE_SUSPENDED: 'Dossier suspendu',
  CASE_REACTIVATED: 'Dossier réactivé',
  CASE_CLOSED: 'Dossier clôturé',
};
