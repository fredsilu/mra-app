// src/features/interviews/interview.types.ts
import { Timestamp } from 'firebase/firestore';

export interface Interview {
  id: string;
  interviewNumber: string;

  appointmentId: string;
  requestId: string;

  personId: string;
  personName: string;

  counselorId: string;
  counselorName: string;

  summary?: string;
  observations?: string;
  recommendations?: string;

  createdAt: Timestamp;
  createdBy: string;
  createdByName?: string;

  updatedAt?: Timestamp;
}

export type CreateInterviewData = {
  appointmentId: string;
  requestId: string;

  personId: string;
  personName: string;

  counselorId: string;
  counselorName: string;

  createdBy: string;
  createdByName?: string;
};

export type UpdateInterviewData = {
  summary?: string | null;
  observations?: string | null;
  recommendations?: string | null;
};