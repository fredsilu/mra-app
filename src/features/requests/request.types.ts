//src/features/requests/request.types.ts

import { Timestamp } from 'firebase/firestore';

export type RequestStatus =
    | 'new'
    | 'assigned'
    | 'in_progress'
    | 'closed'
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

    status: RequestStatus;
    priority: RequestPriority;

    reason: string;
    notes?: string;

    createdAt: Timestamp;
    createdBy: string;
    createdByName?: string;

    updatedAt?: Timestamp;

    assignedAt?: Timestamp;
    closedAt?: Timestamp;
    cancelledAt?: Timestamp;

    // NOUVEAUX CHAMPS
    startedAt?: Timestamp;
    startedBy?: string;
    startedByName?: string;

    completedAt?: Timestamp;
    completedBy?: string;
    completedByName?: string;

    closedBy?: string;
    closedByName?: string;

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

    startedAt?: Timestamp | null;
    startedBy?: string | null;
    startedByName?: string | null;

    completedAt?: Timestamp | null;
    completedBy?: string | null;
    completedByName?: string | null;

    closedBy?: string | null;
    closedByName?: string | null;

    cancelledBy?: string | null;
    cancelledByName?: string | null;

    status?: RequestStatus;
    priority?: RequestPriority;

    reason?: string;
    notes?: string;

    assignedAt?: Timestamp | null;
    closedAt?: Timestamp | null;
    cancelledAt?: Timestamp | null;
};

export const REQUEST_STATUS_LABELS: Record<
    RequestStatus,
    string
> = {
    new: 'Nouvelle',
    assigned: 'Assignée',
    in_progress: 'En cours',
    closed: 'Clôturée',
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
            label: 'En cours',
            value: 'in_progress',
        },
        {
            label: 'Clôturée',
            value: 'closed',
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