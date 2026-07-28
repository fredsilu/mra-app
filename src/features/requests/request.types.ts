//src/features/requests/request.types.ts
import { Timestamp } from 'firebase/firestore';

export type RequestStatus =
  | 'new'
  | 'assigned'
  | 'cancelled';

export type RequestPriority =
  | 'low'
  | 'normal'
  | 'high'
  | 'urgent';

export interface HelpRequest {
  id: string;
  requestNumber: string;

  personId: string;
  personName: string;

  assignedCounselorId?: string;
  assignedCounselorName?: string;

  initialAppointmentId?: string;

  status: RequestStatus;
  priority: RequestPriority;

  reason: string;
  notes?: string;

  createdAt: Timestamp;
  createdBy: string;
  createdByName?: string;

  updatedAt?: Timestamp;
  assignedAt?: Timestamp;

  cancelledAt?: Timestamp;
  cancelledBy?: string;
  cancelledByName?: string;
}

export type CreateHelpRequestData = {
  personId: string;
  personName: string;

  priority: RequestPriority;

  reason: string;
  notes?: string;

  createdBy: string;
  createdByName?: string;
};

export type UpdateHelpRequestData = {
  personId?: string;
  personName?: string;

  assignedCounselorId?: string | null;
  assignedCounselorName?: string | null;

  initialAppointmentId?: string | null;

  status?: RequestStatus;
  priority?: RequestPriority;

  reason?: string;
  notes?: string;

  assignedAt?: Timestamp | null;

  cancelledAt?: Timestamp | null;
  cancelledBy?: string | null;
  cancelledByName?: string | null;
};

export const REQUEST_STATUS_LABELS: Record<
  RequestStatus,
  string
> = {
  new: 'Nouvelle',
  assigned: 'Assignée',
  cancelled: 'Annulée',
};

export const REQUEST_PRIORITY_LABELS: Record<
  RequestPriority,
  string
> = {
  low: 'Faible',
  normal: 'Normale',
  high: 'Élevée',
  urgent: 'Urgente',
};

export const REQUEST_STATUS_OPTIONS: Array<{
  label: string;
  value: RequestStatus;
}> = [
  {
    label: 'Nouvelle',
    value: 'new',
  },
  {
    label: 'Assignée',
    value: 'assigned',
  },
  {
    label: 'Annulée',
    value: 'cancelled',
  },
];

export const REQUEST_PRIORITY_OPTIONS: Array<{
  label: string;
  value: RequestPriority;
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