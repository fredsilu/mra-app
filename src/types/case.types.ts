// src/types/case.types.ts

import { Timestamp } from 'firebase/firestore';

export type CaseStatus =
  | 'new'
  | 'assigned'
  | 'in_progress'
  | 'waiting'
  | 'closed'
  | 'cancelled';

export type CasePriority =
  | 'low'
  | 'normal'
  | 'high'
  | 'urgent';

export interface HelpCase {
  id: string;

  caseNumber: string;
  personId: string;

  assignedCounselorId?: string;

  status: CaseStatus;
  priority: CasePriority;

  requestTitle: string;
  requestDescription: string;
  notes?: string;

  openedAt: Timestamp;
  openedBy: string;

  createdAt: Timestamp;
  createdBy: string;

  updatedAt?: Timestamp;
  updatedBy?: string;

  assignedAt?: Timestamp;

  closedAt?: Timestamp;
  closedBy?: string;
  closingReason?: string;

  cancelledAt?: Timestamp;
  cancelledBy?: string;
  cancellationReason?: string;
}

export type CreateHelpCaseData = {
  personId: string;

  priority: CasePriority;

  requestTitle: string;
  requestDescription: string;
  notes?: string;

  createdBy: string;
};

export type UpdateHelpCaseData = {
  priority?: CasePriority;

  requestTitle?: string;
  requestDescription?: string;
  notes?: string;

  updatedBy: string;
};

export type AssignCaseCounselorData = {
  assignedCounselorId: string;
  updatedBy: string;
};

export type ChangeCaseStatusData = {
  status: CaseStatus;
  updatedBy: string;

  closingReason?: string;
  cancellationReason?: string;
};

export const CASE_STATUS_LABELS: Record<
  CaseStatus,
  string
> = {
  new: 'Nouveau',
  assigned: 'Affecté',
  in_progress: 'En cours',
  waiting: 'En attente',
  closed: 'Clôturé',
  cancelled: 'Annulé',
};

export const CASE_PRIORITY_LABELS: Record<
  CasePriority,
  string
> = {
  low: 'Faible',
  normal: 'Normale',
  high: 'Élevée',
  urgent: 'Urgente',
};

export const CASE_STATUS_OPTIONS: Array<{
  label: string;
  value: CaseStatus;
}> = [
  {
    label: 'Nouveau',
    value: 'new',
  },
  {
    label: 'Affecté',
    value: 'assigned',
  },
  {
    label: 'En cours',
    value: 'in_progress',
  },
  {
    label: 'En attente',
    value: 'waiting',
  },
  {
    label: 'Clôturé',
    value: 'closed',
  },
  {
    label: 'Annulé',
    value: 'cancelled',
  },
];

export const CASE_PRIORITY_OPTIONS: Array<{
  label: string;
  value: CasePriority;
}> = [
  {
    label: 'Faible',
    value: 'low',
  },
  {
    label: 'Normale',
    value: 'normal',
  },
  {
    label: 'Élevée',
    value: 'high',
  },
  {
    label: 'Urgente',
    value: 'urgent',
  },
];