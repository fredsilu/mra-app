// src/features/interviews/interview.types.ts
import { Timestamp } from 'firebase/firestore';

export type InterviewStatus = 'draft' | 'completed';

export interface Interview {
  id: string;
  interviewNumber: string;
  appointmentId: string;
  requestId: string;
  personId: string;
  personName: string;
  counselorId: string;
  counselorName: string;
  status: InterviewStatus;
  startedAt: Timestamp;
  endedAt?: Timestamp;
  summary?: string;
  observations?: string;
  recommendations?: string;
  createdAt: Timestamp;
  createdBy: string;
  createdByName?: string;
  updatedAt?: Timestamp;
  completedAt?: Timestamp;
  completedBy?: string;
  completedByName?: string;
}

export type CreateInterviewData = {
  appointmentId: string;
  requestId: string;
  personId: string;
  personName: string;
  counselorId: string;
  counselorName: string;
  startedAt: Date;
  createdBy: string;
  createdByName?: string;
};

export type UpdateInterviewData = {
  summary?: string | null;
  observations?: string | null;
  recommendations?: string | null;
};

export const INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  draft: 'En cours',
  completed: 'Terminé',
};
