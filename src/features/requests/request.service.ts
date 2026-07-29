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
  'cancelled',
  'accepted',
  'refused',
  'referred',
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
  return typeof value === 'string' &&
    value.trim()
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

    initialAppointmentId:
      toOptionalString(
        data.initialAppointmentId
      ),

    decisionId:
      toOptionalString(data.decisionId),

    decision:
      data.decision === 'accepted' ||
      data.decision === 'refused' ||
      data.decision === 'referred'
        ? data.decision
        : undefined,

    decisionDate:
      toTimestamp(data.decisionDate),

    careType:
      toOptionalString(data.careType),

    caseId:
      toOptionalString(data.caseId),

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
      toOptionalString(
        data.createdByName
      ),

    updatedAt:
      toTimestamp(data.updatedAt),

    assignedAt:
      toTimestamp(data.assignedAt),

    cancelledAt:
      toTimestamp(data.cancelledAt),

    cancelledBy:
      toOptionalString(
        data.cancelledBy
      ),

    cancelledByName:
      toOptionalString(
        data.cancelledByName
      ),
  };
}

export async function createRequest(
  data: CreateHelpRequestData
): Promise<string> {
  const normalizedPersonId =
    data.personId.trim();

  const normalizedPersonName =
    data.personName.trim();

  const normalizedReason =
    data.reason.trim();

  const normalizedCreatedBy =
    data.createdBy.trim();

  const normalizedCreatedByName =
    data.createdByName?.trim() ?? '';

  const normalizedNotes =
    data.notes?.trim() ?? '';

  if (!normalizedPersonId) {
    throw new Error(
      'PERSON_ID_REQUIRED'
    );
  }

  if (!normalizedPersonName) {
    throw new Error(
      'PERSON_NAME_REQUIRED'
    );
  }

  if (!normalizedReason) {
    throw new Error(
      'REQUEST_REASON_REQUIRED'
    );
  }

  if (!normalizedCreatedBy) {
    throw new Error(
      'USER_ID_REQUIRED'
    );
  }

  const nextNumber =
    await getNextCounterValue(
      'requests'
    );

  const requestNumber =
    `MRA-R-${String(nextNumber).padStart(
      6,
      '0'
    )}`;

  const requestReference = doc(
    collection(
      db,
      COLLECTION_NAME
    )
  );

  await setDoc(requestReference, {
    requestNumber,

    personId:
      normalizedPersonId,

    personName:
      normalizedPersonName,

    assignedCounselorId: null,
    assignedCounselorName: null,

    initialAppointmentId: null,

    decisionId: null,
    decision: null,
    decisionDate: null,
    careType: null,
    caseId: null,

    status: 'new',
    priority: data.priority,

    reason:
      normalizedReason,

    notes:
      normalizedNotes,

    createdBy:
      normalizedCreatedBy,

    createdByName:
      normalizedCreatedByName,

    createdAt:
      serverTimestamp(),

    updatedAt:
      serverTimestamp(),

    assignedAt: null,

    cancelledAt: null,
    cancelledBy: null,
    cancelledByName: null,
  });

  return requestReference.id;
}

export async function getRequest(
  id: string
): Promise<HelpRequest | null> {
  const normalizedId = id.trim();

  if (!normalizedId) {
    return null;
  }

  const snapshot = await getDoc(
    doc(
      db,
      COLLECTION_NAME,
      normalizedId
    )
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
      collection(
        db,
        COLLECTION_NAME
      ),
      orderBy(
        'createdAt',
        'desc'
      )
    )
  );

  return snapshot.docs.map(
    (requestDocument) =>
      mapHelpRequest(
        requestDocument.id,
        requestDocument.data()
      )
  );
}

export async function updateRequest(
  id: string,
  data: UpdateHelpRequestData
): Promise<void> {
  const normalizedId = id.trim();

  if (!normalizedId) {
    throw new Error(
      'REQUEST_ID_REQUIRED'
    );
  }

  await updateDoc(
    doc(
      db,
      COLLECTION_NAME,
      normalizedId
    ),
    {
      ...data,
      updatedAt:
        serverTimestamp(),
    }
  );
}

export async function assignCounselor(
  requestId: string,
  counselorId: string,
  counselorName: string
): Promise<void> {
  const normalizedRequestId =
    requestId.trim();

  const normalizedCounselorId =
    counselorId.trim();

  const normalizedCounselorName =
    counselorName.trim();

  if (!normalizedRequestId) {
    throw new Error(
      'REQUEST_ID_REQUIRED'
    );
  }

  if (
    !normalizedCounselorId ||
    !normalizedCounselorName
  ) {
    throw new Error(
      'COUNSELOR_REQUIRED'
    );
  }

  const requestReference = doc(
    db,
    COLLECTION_NAME,
    normalizedRequestId
  );

  const requestSnapshot =
    await getDoc(
      requestReference
    );

  if (!requestSnapshot.exists()) {
    throw new Error(
      'REQUEST_NOT_FOUND'
    );
  }

  const currentRequest =
    mapHelpRequest(
      requestSnapshot.id,
      requestSnapshot.data()
    );

  if (
    currentRequest.status !==
      'new' &&
    currentRequest.status !==
      'assigned'
  ) {
    throw new Error(
      'REQUEST_ASSIGNMENT_NOT_ALLOWED'
    );
  }

  if (
    currentRequest
      .assignedCounselorId ===
    normalizedCounselorId
  ) {
    throw new Error(
      'COUNSELOR_ALREADY_ASSIGNED'
    );
  }

  await updateDoc(
    requestReference,
    {
      assignedCounselorId:
        normalizedCounselorId,

      assignedCounselorName:
        normalizedCounselorName,

      status: 'assigned',

      assignedAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    }
  );
}

export async function cancelRequest(
  requestId: string,
  userId: string,
  userName: string
): Promise<void> {
  const normalizedRequestId =
    requestId.trim();

  const normalizedUserId =
    userId.trim();

  const normalizedUserName =
    userName.trim();

  if (!normalizedRequestId) {
    throw new Error(
      'REQUEST_ID_REQUIRED'
    );
  }

  if (!normalizedUserId) {
    throw new Error(
      'USER_ID_REQUIRED'
    );
  }

  const requestReference = doc(
    db,
    COLLECTION_NAME,
    normalizedRequestId
  );

  const requestSnapshot =
    await getDoc(
      requestReference
    );

  if (!requestSnapshot.exists()) {
    throw new Error(
      'REQUEST_NOT_FOUND'
    );
  }

  const currentRequest =
    mapHelpRequest(
      requestSnapshot.id,
      requestSnapshot.data()
    );

  if (
    currentRequest.status ===
    'cancelled'
  ) {
    throw new Error(
      'REQUEST_ALREADY_CANCELLED'
    );
  }

  await updateDoc(
    requestReference,
    {
      status: 'cancelled',

      cancelledAt:
        serverTimestamp(),

      cancelledBy:
        normalizedUserId,

      cancelledByName:
        normalizedUserName,

      updatedAt:
        serverTimestamp(),
    }
  );
}