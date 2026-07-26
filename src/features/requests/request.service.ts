//src/features/requests/request.service.ts

import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import { getNextCounterValue } from '@/features/counters/counter.service';

import {
  CreateHelpRequestData,
  HelpRequest,
  RequestPriority,
  RequestStatus,
  UpdateHelpRequestData,
} from '@/features/requests/request.types';

const COLLECTION_NAME = 'requests';

const REQUEST_STATUSES: RequestStatus[] = [
  'new',
  'assigned',
  'in_progress',
  'closed',
  'cancelled',
];

const REQUEST_PRIORITIES: RequestPriority[] = [
  'low',
  'normal',
  'high',
  'urgent',
];

function toTimestamp(
  value: unknown
): Timestamp | undefined {
  return value instanceof Timestamp
    ? value
    : undefined;
}

function toOptionalString(
  value: unknown
): string | undefined {
  return typeof value === 'string' && value.trim()
    ? value
    : undefined;
}

function isRequestStatus(
  value: unknown
): value is RequestStatus {
  return (
    typeof value === 'string' &&
    REQUEST_STATUSES.includes(
      value as RequestStatus
    )
  );
}

function isRequestPriority(
  value: unknown
): value is RequestPriority {
  return (
    typeof value === 'string' &&
    REQUEST_PRIORITIES.includes(
      value as RequestPriority
    )
  );
}

function mapHelpRequest(
  id: string,
  data: Record<string, unknown>
): HelpRequest {
  return {
    id,

    requestNumber:
      typeof data.requestNumber === 'string'
        ? data.requestNumber
        : '',

    personId:
      typeof data.personId === 'string'
        ? data.personId
        : '',

    personName:
      typeof data.personName === 'string'
        ? data.personName
        : '',

    assignedCounselorId:
      toOptionalString(
        data.assignedCounselorId
      ),

    assignedCounselorName:
      toOptionalString(
        data.assignedCounselorName
      ),

    status: isRequestStatus(data.status)
      ? data.status
      : 'new',

    priority: isRequestPriority(
      data.priority
    )
      ? data.priority
      : 'normal',

    reason:
      typeof data.reason === 'string'
        ? data.reason
        : '',

    notes:
      toOptionalString(data.notes),

    createdAt:
      toTimestamp(data.createdAt) ??
      Timestamp.now(),

    createdBy:
      typeof data.createdBy === 'string'
        ? data.createdBy
        : '',

    createdByName:
      toOptionalString(data.createdByName),

    updatedAt:
      toTimestamp(data.updatedAt),

    assignedAt:
      toTimestamp(data.assignedAt),

    startedAt:
      toTimestamp(data.startedAt),

    startedBy:
      toOptionalString(data.startedBy),

    startedByName:
      toOptionalString(data.startedByName),

    completedAt:
      toTimestamp(data.completedAt),

    completedBy:
      toOptionalString(data.completedBy),

    completedByName:
      toOptionalString(
        data.completedByName
      ),

    closedAt:
      toTimestamp(data.closedAt),

    closedBy:
      toOptionalString(data.closedBy),

    closedByName:
      toOptionalString(data.closedByName),

    cancelledAt:
      toTimestamp(data.cancelledAt),

    cancelledBy:
      toOptionalString(data.cancelledBy),

    cancelledByName:
      toOptionalString(
        data.cancelledByName
      ),
  };
}

export async function createRequest(
  data: CreateHelpRequestData
): Promise<string> {
  const nextNumber =
    await getNextCounterValue('requests');

  const requestNumber =
    `REQ-${String(nextNumber).padStart(6, '0')}`;

  const requestReference = doc(
    collection(db, COLLECTION_NAME)
  );

  await setDoc(requestReference, {
    requestNumber,

    personId: data.personId,
    personName: data.personName,

    assignedCounselorId: null,
    assignedCounselorName: null,

    status: 'new',
    priority: data.priority,

    reason: data.reason.trim(),
    notes: data.notes?.trim() ?? '',

    createdBy: data.createdBy,
    createdByName:
      data.createdByName?.trim() ?? '',

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),

    assignedAt: null,

    startedAt: null,
    startedBy: null,
    startedByName: null,

    completedAt: null,
    completedBy: null,
    completedByName: null,

    closedAt: null,
    closedBy: null,
    closedByName: null,

    cancelledAt: null,
    cancelledBy: null,
    cancelledByName: null,
  });

  return requestReference.id;
}

export async function getRequest(
  id: string
): Promise<HelpRequest | null> {
  const snapshot = await getDoc(
    doc(db, COLLECTION_NAME, id)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return mapHelpRequest(
    snapshot.id,
    snapshot.data()
  );
}

export async function getRequests(): Promise<
  HelpRequest[]
> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc')
    )
  );

  return snapshot.docs.map((snapshot) =>
    mapHelpRequest(
      snapshot.id,
      snapshot.data()
    )
  );
}

export async function updateRequest(
  id: string,
  data: UpdateHelpRequestData
): Promise<void> {
  await updateDoc(
    doc(db, COLLECTION_NAME, id),
    {
      ...data,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function assignCounselor(
  requestId: string,
  counselorId: string,
  counselorName: string
): Promise<void> {
  await updateDoc(
    doc(db, COLLECTION_NAME, requestId),
    {
      assignedCounselorId: counselorId,
      assignedCounselorName:
        counselorName.trim(),

      status: 'assigned',

      assignedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );
}

export async function startRequest(
  requestId: string,
  userId: string,
  userName: string
): Promise<void> {
  await updateDoc(
    doc(db, COLLECTION_NAME, requestId),
    {
      status: 'in_progress',

      startedAt: serverTimestamp(),
      startedBy: userId,
      startedByName: userName.trim(),

      updatedAt: serverTimestamp(),
    }
  );
}

export async function completeRequest(
  requestId: string,
  userId: string,
  userName: string
): Promise<void> {
  await updateDoc(
    doc(db, COLLECTION_NAME, requestId),
    {
      completedAt: serverTimestamp(),
      completedBy: userId,
      completedByName: userName.trim(),

      updatedAt: serverTimestamp(),
    }
  );
}

export async function closeRequest(
  requestId: string,
  userId: string,
  userName: string
): Promise<void> {
  await updateDoc(
    doc(db, COLLECTION_NAME, requestId),
    {
      status: 'closed',

      closedAt: serverTimestamp(),
      closedBy: userId,
      closedByName: userName.trim(),

      updatedAt: serverTimestamp(),
    }
  );
}

export async function cancelRequest(
  requestId: string,
  userId: string,
  userName: string
): Promise<void> {
  await updateDoc(
    doc(db, COLLECTION_NAME, requestId),
    {
      status: 'cancelled',

      cancelledAt: serverTimestamp(),
      cancelledBy: userId,
      cancelledByName:
        userName.trim(),

      updatedAt: serverTimestamp(),
    }
  );
}