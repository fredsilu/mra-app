// src/features/cases/case.types.ts

import type { Timestamp } from "firebase/firestore";

export type CaseStatus = "active" | "closed";

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  active: "Ouvert",
  closed: "Clôturé",
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

  closedAt?: Timestamp;
  closureReason?: string;

  closureSummary?: string;

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

export interface CloseCaseData {
  closureReason: string;
  closureSummary: string;

  updatedBy: string;
  updatedByName?: string;
}

export interface CreateCaseFromFirstInterviewData {
  firstInterviewActivityId: string;

  createdBy: string;
  createdByName?: string;
}
