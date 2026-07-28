// src/features/appointments/appointment.service.ts
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import { getNextCounterValue } from '@/features/counters/counter.service';

import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
  CreateAppointmentData,
  UpdateAppointmentData,
} from './appointment.types';

const COLLECTION_NAME = 'appointments';
const REQUESTS_COLLECTION_NAME = 'requests';

const APPOINTMENT_TYPES: AppointmentType[] = [
  'initial_interview',
  'follow_up',
  'family',
  'couple',
  'home_visit',
  'prayer',
  'coaching',
  'meeting',
  'other',
];

const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  'scheduled',
  'confirmed',
  'completed',
  'cancelled',
  'no_show',
];

function toTimestamp(value: unknown): Timestamp | undefined {
  return value instanceof Timestamp ? value : undefined;
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim()
    ? value
    : undefined;
}

function isAppointmentType(
  value: unknown
): value is AppointmentType {
  return (
    typeof value === 'string' &&
    APPOINTMENT_TYPES.includes(value as AppointmentType)
  );
}

function isAppointmentStatus(
  value: unknown
): value is AppointmentStatus {
  return (
    typeof value === 'string' &&
    APPOINTMENT_STATUSES.includes(
      value as AppointmentStatus
    )
  );
}

function mapAppointment(
  id: string,
  data: Record<string, unknown>
): Appointment {
  return {
    id,
    appointmentNumber:
      typeof data.appointmentNumber === 'string'
        ? data.appointmentNumber
        : '',

    requestId:
      typeof data.requestId === 'string'
        ? data.requestId
        : '',

    personId:
      typeof data.personId === 'string'
        ? data.personId
        : '',
    personName:
      typeof data.personName === 'string'
        ? data.personName
        : '',

    counselorId:
      typeof data.counselorId === 'string'
        ? data.counselorId
        : '',
    counselorName:
      typeof data.counselorName === 'string'
        ? data.counselorName
        : '',

    type: isAppointmentType(data.type)
      ? data.type
      : 'initial_interview',
    status: isAppointmentStatus(data.status)
      ? data.status
      : 'scheduled',

    startAt:
      toTimestamp(data.startAt) ?? Timestamp.now(),
    endAt: toTimestamp(data.endAt),

    location: toOptionalString(data.location),
    notes: toOptionalString(data.notes),

    createdAt:
      toTimestamp(data.createdAt) ?? Timestamp.now(),
    createdBy:
      typeof data.createdBy === 'string'
        ? data.createdBy
        : '',
    createdByName:
      toOptionalString(data.createdByName),

    updatedAt: toTimestamp(data.updatedAt),

    confirmedAt: toTimestamp(data.confirmedAt),
    confirmedBy: toOptionalString(data.confirmedBy),
    confirmedByName:
      toOptionalString(data.confirmedByName),

    cancelledAt: toTimestamp(data.cancelledAt),
    cancelledBy: toOptionalString(data.cancelledBy),
    cancelledByName:
      toOptionalString(data.cancelledByName),

    completedAt: toTimestamp(data.completedAt),
    completedBy: toOptionalString(data.completedBy),
    completedByName:
      toOptionalString(data.completedByName),

    noShowAt: toTimestamp(data.noShowAt),
    noShowBy: toOptionalString(data.noShowBy),
    noShowByName:
      toOptionalString(data.noShowByName),
  };
}

function normalizeRequired(
  value: string,
  errorCode: string
): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(errorCode);
  }

  return normalized;
}

async function getExistingAppointment(
  appointmentId: string
): Promise<{
  reference: ReturnType<typeof doc>;
  appointment: Appointment;
}> {
  const normalizedId = normalizeRequired(
    appointmentId,
    'APPOINTMENT_ID_REQUIRED'
  );

  const reference = doc(
    db,
    COLLECTION_NAME,
    normalizedId
  );

  const snapshot = await getDoc(reference);

  if (!snapshot.exists()) {
    throw new Error('APPOINTMENT_NOT_FOUND');
  }

  return {
    reference,
    appointment: mapAppointment(
      snapshot.id,
      snapshot.data()
    ),
  };
}

export async function getAppointments(): Promise<
  Appointment[]
> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      orderBy('startAt', 'asc')
    )
  );

  return snapshot.docs.map((item) =>
    mapAppointment(item.id, item.data())
  );
}

export async function getAppointment(
  id: string
): Promise<Appointment | null> {
  const normalizedId = id.trim();

  if (!normalizedId) {
    return null;
  }

  const snapshot = await getDoc(
    doc(db, COLLECTION_NAME, normalizedId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return mapAppointment(
    snapshot.id,
    snapshot.data()
  );
}

export async function createAppointment(
  data: CreateAppointmentData
): Promise<string> {
  const requestId = normalizeRequired(
    data.requestId,
    'REQUEST_ID_REQUIRED'
  );
  const personId = normalizeRequired(
    data.personId,
    'PERSON_ID_REQUIRED'
  );
  const personName = normalizeRequired(
    data.personName,
    'PERSON_NAME_REQUIRED'
  );
  const counselorId = normalizeRequired(
    data.counselorId,
    'COUNSELOR_ID_REQUIRED'
  );
  const counselorName = normalizeRequired(
    data.counselorName,
    'COUNSELOR_NAME_REQUIRED'
  );
  const createdBy = normalizeRequired(
    data.createdBy,
    'USER_ID_REQUIRED'
  );

  if (
    !(data.startAt instanceof Date) ||
    Number.isNaN(data.startAt.getTime())
  ) {
    throw new Error('START_DATE_INVALID');
  }

  if (
    data.endAt &&
    (
      Number.isNaN(data.endAt.getTime()) ||
      data.endAt <= data.startAt
    )
  ) {
    throw new Error('END_DATE_INVALID');
  }

  const requestReference = doc(
    db,
    REQUESTS_COLLECTION_NAME,
    requestId
  );
  const requestSnapshot = await getDoc(requestReference);

  if (!requestSnapshot.exists()) {
    throw new Error('REQUEST_NOT_FOUND');
  }

  const requestData = requestSnapshot.data();

  if (requestData.status !== 'assigned') {
    throw new Error('REQUEST_NOT_ASSIGNED');
  }

  if (requestData.personId !== personId) {
    throw new Error('REQUEST_PERSON_MISMATCH');
  }

  if (
    data.type === 'initial_interview' &&
    typeof requestData.initialAppointmentId === 'string' &&
    requestData.initialAppointmentId.trim()
  ) {
    throw new Error(
      'INITIAL_APPOINTMENT_ALREADY_EXISTS'
    );
  }

  const nextNumber = await getNextCounterValue(
    'appointments'
  );
  const appointmentNumber =
    `MRA-A-${String(nextNumber).padStart(6, '0')}`;

  const appointmentReference = doc(
    collection(db, COLLECTION_NAME)
  );
  const batch = writeBatch(db);

  batch.set(appointmentReference, {
    appointmentNumber,
    requestId,

    personId,
    personName,

    counselorId,
    counselorName,

    type: data.type,
    status: 'scheduled',

    startAt: Timestamp.fromDate(data.startAt),
    endAt: data.endAt
      ? Timestamp.fromDate(data.endAt)
      : null,

    location: data.location?.trim() || null,
    notes: data.notes?.trim() || null,

    createdBy,
    createdByName:
      data.createdByName?.trim() || null,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),

    confirmedAt: null,
    confirmedBy: null,
    confirmedByName: null,

    cancelledAt: null,
    cancelledBy: null,
    cancelledByName: null,

    completedAt: null,
    completedBy: null,
    completedByName: null,

    noShowAt: null,
    noShowBy: null,
    noShowByName: null,
  });

  if (data.type === 'initial_interview') {
    batch.update(requestReference, {
      initialAppointmentId:
        appointmentReference.id,
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();

  return appointmentReference.id;
}

export async function updateAppointment(
  id: string,
  data: UpdateAppointmentData
): Promise<void> {
  const { reference, appointment } =
    await getExistingAppointment(id);

  if (
    appointment.status === 'completed' ||
    appointment.status === 'cancelled' ||
    appointment.status === 'no_show'
  ) {
    throw new Error(
      'APPOINTMENT_UPDATE_NOT_ALLOWED'
    );
  }

  const updates: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (data.counselorId !== undefined) {
    updates.counselorId = normalizeRequired(
      data.counselorId,
      'COUNSELOR_ID_REQUIRED'
    );
  }

  if (data.counselorName !== undefined) {
    updates.counselorName = normalizeRequired(
      data.counselorName,
      'COUNSELOR_NAME_REQUIRED'
    );
  }

  if (data.type !== undefined) {
    updates.type = data.type;
  }

  if (data.startAt !== undefined) {
    updates.startAt = data.startAt;
  }

  if (data.endAt !== undefined) {
    updates.endAt = data.endAt;
  }

  if (data.location !== undefined) {
    updates.location =
      data.location?.trim() || null;
  }

  if (data.notes !== undefined) {
    updates.notes = data.notes?.trim() || null;
  }

  await updateDoc(reference, updates);
}

async function changeStatus(
  appointmentId: string,
  expectedStatuses: AppointmentStatus[],
  nextStatus: AppointmentStatus,
  userId: string,
  userName: string,
  auditPrefix:
    | 'confirmed'
    | 'cancelled'
    | 'completed'
    | 'noShow'
): Promise<void> {
  const normalizedUserId = normalizeRequired(
    userId,
    'USER_ID_REQUIRED'
  );
  const normalizedUserName = userName.trim();

  const { reference, appointment } =
    await getExistingAppointment(appointmentId);

  if (!expectedStatuses.includes(appointment.status)) {
    throw new Error(
      'APPOINTMENT_STATUS_CHANGE_NOT_ALLOWED'
    );
  }

  await updateDoc(reference, {
    status: nextStatus,

    [`${auditPrefix}At`]: serverTimestamp(),
    [`${auditPrefix}By`]: normalizedUserId,
    [`${auditPrefix}ByName`]:
      normalizedUserName || null,

    updatedAt: serverTimestamp(),
  });
}

export function confirmAppointment(
  appointmentId: string,
  userId: string,
  userName: string
): Promise<void> {
  return changeStatus(
    appointmentId,
    ['scheduled'],
    'confirmed',
    userId,
    userName,
    'confirmed'
  );
}

export function completeAppointment(
  appointmentId: string,
  userId: string,
  userName: string
): Promise<void> {
  return changeStatus(
    appointmentId,
    ['scheduled', 'confirmed'],
    'completed',
    userId,
    userName,
    'completed'
  );
}

export function markAppointmentNoShow(
  appointmentId: string,
  userId: string,
  userName: string
): Promise<void> {
  return changeStatus(
    appointmentId,
    ['scheduled', 'confirmed'],
    'no_show',
    userId,
    userName,
    'noShow'
  );
}

export function cancelAppointment(
  appointmentId: string,
  userId: string,
  userName: string
): Promise<void> {
  return changeStatus(
    appointmentId,
    ['scheduled', 'confirmed'],
    'cancelled',
    userId,
    userName,
    'cancelled'
  );
}
