// src/types/case-history.types.ts

import { Timestamp } from 'firebase/firestore';

export type CaseHistoryAction =
  | 'CASE_CREATED'
  | 'COUNSELOR_ASSIGNED'
  | 'COUNSELOR_CHANGED'
  | 'STATUS_CHANGED'
  | 'CASE_CLOSED'
  | 'CASE_CANCELLED';

export interface CaseHistoryEntry {
  id: string;

  caseId: string;

  action: CaseHistoryAction;
  description: string;

  performedBy: string;
  performedAt: Timestamp;
}

export const CASE_HISTORY_ACTION_LABELS: Record<
  CaseHistoryAction,
  string
> = {
  CASE_CREATED: 'Dossier créé',
  COUNSELOR_ASSIGNED: 'Conseiller affecté',
  COUNSELOR_CHANGED: 'Conseiller remplacé',
  STATUS_CHANGED: 'Statut modifié',
  CASE_CLOSED: 'Dossier clôturé',
  CASE_CANCELLED: 'Dossier annulé',
};