// src/features/case-activities/case-activity.service.ts

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
  where,
  writeBatch,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import { getCase } from '@/features/cases/case.service';
import { getNextCounterValue } from '@/features/counters/counter.service';

import type {
  CaseActivity,
  CaseActivityType,
  CreateCaseActivityData,
  UpdateCaseActivityData,
} from './case-activity.types';

const COLLECTION_NAME = 'case_activities';

const ACTIVITY_TYPES: CaseActivityType[] = [
  'follow_up',
  'individual_session',
  'phone_call',
  'video_call',
  'home_visit',
  'hospital_visit',
  'prayer',
  'biblical_teaching',
  'referral',
  'note',
];

function required(
  value: string,
  errorCode: string
): string {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    throw new Error(errorCode);
  }

  return normalizedValue;
}

function optionalText(
  value: unknown
): string | undefined {
  if (
    typeof value === 'string' &&
    value.trim()
  ) {
    return value.trim();
  }

  return undefined;
}

function timestamp(
  value: unknown
): Timestamp | undefined {
  return value instanceof Timestamp
    ? value
    : undefined;
}

function stringArray(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string =>
      typeof item === 'string' &&
      Boolean(item.trim())
  );
}

function activityType(
  value: unknown
): CaseActivityType {
  return ACTIVITY_TYPES.includes(
    value as CaseActivityType
  )
    ? (value as CaseActivityType)
    : 'note';
}

function validateActivityType(
  value: CaseActivityType
): CaseActivityType {
  if (!ACTIVITY_TYPES.includes(value)) {
    throw new Error(
      'CASE_ACTIVITY_TYPE_INVALID'
    );
  }

  return value;
}

function mapCaseActivity(
  id: string,
  data: Record<string, unknown>
): CaseActivity {
  return {
    id,

    activityNumber:
      typeof data.activityNumber === 'string'
        ? data.activityNumber
        : '',

    caseId:
      typeof data.caseId === 'string'
        ? data.caseId
        : '',

    caseNumber:
      typeof data.caseNumber === 'string'
        ? data.caseNumber
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

    type: activityType(data.type),

    title:
      typeof data.title === 'string'
        ? data.title
        : '',

    description:
      typeof data.description === 'string'
        ? data.description
        : '',

    performedAt:
      timestamp(data.performedAt) ??
      Timestamp.now(),

    nextAction:
      optionalText(data.nextAction),

    nextAppointmentId:
      optionalText(data.nextAppointmentId),

    attachmentIds:
      stringArray(data.attachmentIds),

    createdAt:
      timestamp(data.createdAt) ??
      Timestamp.now(),

    createdBy:
      typeof data.createdBy === 'string'
        ? data.createdBy
        : '',

    createdByName:
      optionalText(data.createdByName),

    updatedAt:
      timestamp(data.updatedAt),

    updatedBy:
      optionalText(data.updatedBy),

    updatedByName:
      optionalText(data.updatedByName),
  };
}

export async function getCaseActivities():
Promise<CaseActivity[]> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      orderBy('performedAt', 'desc')
    )
  );

  return snapshot.docs.map((item) =>
    mapCaseActivity(
      item.id,
      item.data()
    )
  );
}

export async function getCaseActivity(
  id: string
): Promise<CaseActivity | null> {
  const activityId = id.trim();

  if (!activityId) {
    return null;
  }

  const snapshot = await getDoc(
    doc(
      db,
      COLLECTION_NAME,
      activityId
    )
  );

  if (!snapshot.exists()) {
    return null;
  }

  return mapCaseActivity(
    snapshot.id,
    snapshot.data()
  );
}

export async function getCaseActivitiesByCaseId(
  caseId: string
): Promise<CaseActivity[]> {
  const normalizedCaseId = caseId.trim();

  if (!normalizedCaseId) {
    return [];
  }

  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      where(
        'caseId',
        '==',
        normalizedCaseId
      )
    )
  );

  return snapshot.docs
    .map((item) =>
      mapCaseActivity(
        item.id,
        item.data()
      )
    )
    .sort(
      (firstActivity, secondActivity) =>
        secondActivity.performedAt.toMillis() -
        firstActivity.performedAt.toMillis()
    );
}

export async function createCaseActivity(
  data: CreateCaseActivityData
): Promise<string> {
  const caseId = required(
    data.caseId,
    'CASE_ID_REQUIRED'
  );

  const type = validateActivityType(
    data.type
  );

  const title = required(
    data.title,
    'CASE_ACTIVITY_TITLE_REQUIRED'
  );

  const description = required(
    data.description,
    'CASE_ACTIVITY_DESCRIPTION_REQUIRED'
  );

  const createdBy = required(
    data.createdBy,
    'USER_ID_REQUIRED'
  );

  if (!(data.performedAt instanceof Timestamp)) {
    throw new Error(
      'CASE_ACTIVITY_DATE_REQUIRED'
    );
  }

  const currentCase = await getCase(caseId);

  if (!currentCase) {
    throw new Error('CASE_NOT_FOUND');
  }

  if (currentCase.status === 'closed') {
    throw new Error('CASE_ALREADY_CLOSED');
  }

  const nextNumber =
    await getNextCounterValue(
      'case_activities'
    );

  const activityNumber =
    `MRA-ACT-${String(nextNumber).padStart(
      6,
      '0'
    )}`;

  const activityRef = doc(
    collection(db, COLLECTION_NAME)
  );

  const caseRef = doc(
    db,
    'cases',
    currentCase.id
  );

  const batch = writeBatch(db);

  batch.set(activityRef, {
    activityNumber,

    caseId: currentCase.id,
    caseNumber: currentCase.caseNumber,

    personId: currentCase.personId,
    personName: currentCase.personName,

    counselorId: currentCase.counselorId,
    counselorName: currentCase.counselorName,

    type,
    title,
    description,

    performedAt: data.performedAt,

    nextAction:
      data.nextAction?.trim() || null,

    nextAppointmentId:
      data.nextAppointmentId?.trim() ||
      null,

    attachmentIds:
      data.attachmentIds ?? [],

    createdAt: serverTimestamp(),
    createdBy,

    createdByName:
      data.createdByName?.trim() ||
      null,

    updatedAt: serverTimestamp(),
    updatedBy: createdBy,

    updatedByName:
      data.createdByName?.trim() ||
      null,
  });

  batch.update(caseRef, {
    updatedAt: serverTimestamp(),
    updatedBy: createdBy,

    updatedByName:
      data.createdByName?.trim() ||
      null,

    lastActivityAt: data.performedAt,
    lastActivityId: activityRef.id,
  });

  await batch.commit();

  return activityRef.id;
}

export async function updateCaseActivity(
  id: string,
  data: UpdateCaseActivityData
): Promise<void> {
  const activityId = required(
    id,
    'CASE_ACTIVITY_ID_REQUIRED'
  );

  const currentActivity =
    await getCaseActivity(activityId);

  if (!currentActivity) {
    throw new Error(
      'CASE_ACTIVITY_NOT_FOUND'
    );
  }

  const currentCase = await getCase(
    currentActivity.caseId
  );

  if (!currentCase) {
    throw new Error('CASE_NOT_FOUND');
  }

  if (currentCase.status === 'closed') {
    throw new Error('CASE_ALREADY_CLOSED');
  }

  const type = validateActivityType(
    data.type
  );

  const title = required(
    data.title,
    'CASE_ACTIVITY_TITLE_REQUIRED'
  );

  const description = required(
    data.description,
    'CASE_ACTIVITY_DESCRIPTION_REQUIRED'
  );

  const updatedBy = required(
    data.updatedBy,
    'USER_ID_REQUIRED'
  );

  if (!(data.performedAt instanceof Timestamp)) {
    throw new Error(
      'CASE_ACTIVITY_DATE_REQUIRED'
    );
  }

  await updateDoc(
    doc(
      db,
      COLLECTION_NAME,
      activityId
    ),
    {
      type,
      title,
      description,

      performedAt: data.performedAt,

      nextAction:
        data.nextAction?.trim() || null,

      nextAppointmentId:
        data.nextAppointmentId?.trim() ||
        null,

      attachmentIds:
        data.attachmentIds ?? [],

      updatedAt: serverTimestamp(),
      updatedBy,

      updatedByName:
        data.updatedByName?.trim() ||
        null,
    }
  );
}
