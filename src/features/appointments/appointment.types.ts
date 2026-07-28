// src/features/appointments/appointment.types.ts
import { Timestamp } from 'firebase/firestore';

export type AppointmentType =
  | 'initial_interview'
  | 'follow_up'
  | 'family'
  | 'couple'
  | 'home_visit'
  | 'prayer'
  | 'coaching'
  | 'meeting'
  | 'other';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface Appointment {
  id: string;
  appointmentNumber: string;

  requestId: string;

  personId: string;
  personName: string;

  counselorId: string;
  counselorName: string;

  type: AppointmentType;
  status: AppointmentStatus;

  startAt: Timestamp;
  endAt?: Timestamp;

  location?: string;
  notes?: string;

  createdAt: Timestamp;
  createdBy: string;
  createdByName?: string;

  updatedAt?: Timestamp;

  confirmedAt?: Timestamp;
  confirmedBy?: string;
  confirmedByName?: string;

  cancelledAt?: Timestamp;
  cancelledBy?: string;
  cancelledByName?: string;

  completedAt?: Timestamp;
  completedBy?: string;
  completedByName?: string;

  noShowAt?: Timestamp;
  noShowBy?: string;
  noShowByName?: string;
}

export type CreateAppointmentData = {
  requestId: string;

  personId: string;
  personName: string;

  counselorId: string;
  counselorName: string;

  type: AppointmentType;

  startAt: Date;
  endAt?: Date;

  location?: string;
  notes?: string;

  createdBy: string;
  createdByName?: string;
};

export type UpdateAppointmentData = {
  counselorId?: string;
  counselorName?: string;

  type?: AppointmentType;

  startAt?: Timestamp;
  endAt?: Timestamp | null;

  location?: string | null;
  notes?: string | null;
};

export const APPOINTMENT_TYPE_LABELS: Record<
  AppointmentType,
  string
> = {
  initial_interview: 'Premier entretien',
  follow_up: 'Suivi',
  family: 'Entretien familial',
  couple: 'Entretien de couple',
  home_visit: 'Visite à domicile',
  prayer: 'Prière',
  coaching: 'Coaching',
  meeting: 'Réunion',
  other: 'Autre',
};

export const APPOINTMENT_STATUS_LABELS: Record<
  AppointmentStatus,
  string
> = {
  scheduled: 'Planifié',
  confirmed: 'Confirmé',
  completed: 'Réalisé',
  cancelled: 'Annulé',
  no_show: 'Absent',
};

export const APPOINTMENT_TYPE_OPTIONS: Array<{
  label: string;
  value: AppointmentType;
}> = Object.entries(APPOINTMENT_TYPE_LABELS).map(
  ([value, label]) => ({
    label,
    value: value as AppointmentType,
  })
);
