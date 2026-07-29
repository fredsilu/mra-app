// src/features/case-activities/case-activity.types.ts

import type { Timestamp } from 'firebase/firestore';

export type CaseActivityType =
  | 'follow_up'
  | 'individual_session'
  | 'phone_call'
  | 'video_call'
  | 'home_visit'
  | 'hospital_visit'
  | 'prayer'
  | 'biblical_teaching'
  | 'referral'
  | 'note';

export const CASE_ACTIVITY_TYPE_LABELS: Record<
  CaseActivityType,
  string
> = {
  follow_up: 'Suivi',
  individual_session: 'Entretien individuel',
  phone_call: 'Appel téléphonique',
  video_call: 'Appel vidéo',
  home_visit: 'Visite à domicile',
  hospital_visit: 'Visite à l’hôpital',
  prayer: 'Prière',
  biblical_teaching: 'Enseignement biblique',
  referral: 'Orientation',
  note: 'Note',
};

export const CASE_ACTIVITY_TYPE_OPTIONS: Array<{
  label: string;
  value: CaseActivityType;
}> = (
  Object.entries(
    CASE_ACTIVITY_TYPE_LABELS
  ) as Array<[CaseActivityType, string]>
).map(([value, label]) => ({
  value,
  label,
}));

export interface CaseActivity {
  id: string;
  activityNumber: string;

  caseId: string;
  caseNumber: string;

  personId: string;
  personName: string;

  counselorId: string;
  counselorName: string;

  type: CaseActivityType;
  title: string;
  description: string;

  performedAt: Timestamp;

  nextAction?: string;
  nextAppointmentId?: string;

  attachmentIds: string[];

  createdAt: Timestamp;
  createdBy: string;
  createdByName?: string;

  updatedAt?: Timestamp;
  updatedBy?: string;
  updatedByName?: string;
}

export interface CreateCaseActivityData {
  caseId: string;

  type: CaseActivityType;
  title: string;
  description: string;

  performedAt: Timestamp;

  nextAction?: string;
  nextAppointmentId?: string;

  attachmentIds?: string[];

  createdBy: string;
  createdByName?: string;
}

export interface UpdateCaseActivityData {
  type: CaseActivityType;
  title: string;
  description: string;

  performedAt: Timestamp;

  nextAction?: string;
  nextAppointmentId?: string;

  attachmentIds?: string[];

  updatedBy: string;
  updatedByName?: string;
}
