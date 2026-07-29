// src/features/cases/case.types.ts

import type { Timestamp } from 'firebase/firestore';

export type CaseStatus =
  | 'active'
  | 'suspended'
  | 'closed';

export const CASE_STATUS_LABELS: Record<
  CaseStatus,
  string
> = {
  active: 'Actif',
  suspended: 'Suspendu',
  closed: 'Clôturé',
};

export interface Case {
  id: string;
  caseNumber: string;

  contractId: string;
  interviewId: string;
  appointmentId: string;
  requestId: string;

  personId: string;
  personName: string;

  counselorId: string;
  counselorName: string;

  status: CaseStatus;
  openedAt: Timestamp;

  suspendedAt?: Timestamp;
  suspensionReason?: string;

  closedAt?: Timestamp;
  closureReason?: string;

  createdAt: Timestamp;
  createdBy: string;
  createdByName?: string;

  updatedAt?: Timestamp;
  updatedBy?: string;
  updatedByName?: string;
}

export interface CreateCaseData {
  contractId: string;
  interviewId: string;
  appointmentId: string;
  requestId: string;

  personId: string;
  personName: string;

  counselorId: string;
  counselorName: string;

  createdBy: string;
  createdByName?: string;
}

export interface ChangeCaseCounselorData {
  counselorId: string;
  counselorName: string;

  updatedBy: string;
  updatedByName?: string;
}

export interface SuspendCaseData {
  suspensionReason: string;

  updatedBy: string;
  updatedByName?: string;
}

export interface ReactivateCaseData {
  updatedBy: string;
  updatedByName?: string;
}

export interface CloseCaseData {
  closureReason: string;

  updatedBy: string;
  updatedByName?: string;
}
