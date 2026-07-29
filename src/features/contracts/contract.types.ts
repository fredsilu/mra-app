// src/features/contracts/contract.types.ts

import type { Timestamp } from 'firebase/firestore';

export interface Contract {
  id: string;
  contractNumber: string;

  interviewId: string;
  appointmentId: string;
  requestId: string;

  personId: string;
  personName: string;

  counselorId: string;
  counselorName: string;

  signedAt: Timestamp;

  createdAt: Timestamp;
  createdBy: string;
  createdByName?: string;
}

export interface CreateContractData {
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