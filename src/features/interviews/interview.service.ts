// src/features/interviews/interview.service.ts
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import { getNextCounterValue } from '@/features/counters/counter.service';

import {
  CreateInterviewData,
  Interview,
  UpdateInterviewData,
} from './interview.types';

const COLLECTION_NAME = 'interviews';
const APPOINTMENTS_COLLECTION_NAME = 'appointments';

function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim()
    ? value
    : undefined;
}

function date(value: unknown): Timestamp | undefined {
  return value instanceof Timestamp
    ? value
    : undefined;
}

function required(
  value: string,
  code: string
): string {
  const result = value.trim();

  if (!result) {
    throw new Error(code);
  }

  return result;
}

function mapInterview(
  id: string,
  data: Record<string, unknown>
): Interview {
  return {
    id,

    interviewNumber:
      typeof data.interviewNumber === 'string'
        ? data.interviewNumber
        : '',

    appointmentId:
      typeof data.appointmentId === 'string'
        ? data.appointmentId
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

    status:
      data.status === 'completed'
        ? 'completed'
        : 'draft',

    startedAt:
      date(data.startedAt) ??
      Timestamp.now(),

    endedAt:
      date(data.endedAt),

    summary:
      text(data.summary),

    observations:
      text(data.observations),

    recommendations:
      text(data.recommendations),

    decisionId:
      text(data.decisionId),

    createdAt:
      date(data.createdAt) ??
      Timestamp.now(),

    createdBy:
      typeof data.createdBy === 'string'
        ? data.createdBy
        : '',

    createdByName:
      text(data.createdByName),

    updatedAt:
      date(data.updatedAt),

    completedAt:
      date(data.completedAt),

    completedBy:
      text(data.completedBy),

    completedByName:
      text(data.completedByName),
  };
}

export async function getInterviews(): Promise<
  Interview[]
> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      orderBy('startedAt', 'desc')
    )
  );

  return snapshot.docs.map((item) =>
    mapInterview(
      item.id,
      item.data()
    )
  );
}

export async function getInterview(
  id: string
): Promise<Interview | null> {
  const interviewId = id.trim();

  if (!interviewId) {
    return null;
  }

  const snapshot = await getDoc(
    doc(
      db,
      COLLECTION_NAME,
      interviewId
    )
  );

  return snapshot.exists()
    ? mapInterview(
        snapshot.id,
        snapshot.data()
      )
    : null;
}

export async function getInterviewByAppointmentId(
  appointmentId: string
): Promise<Interview | null> {
  const normalizedAppointmentId =
    appointmentId.trim();

  if (!normalizedAppointmentId) {
    return null;
  }

  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      where(
        'appointmentId',
        '==',
        normalizedAppointmentId
      ),
      limit(1)
    )
  );

  if (snapshot.empty) {
    return null;
  }

  const item = snapshot.docs[0];

  return mapInterview(
    item.id,
    item.data()
  );
}

export async function createInterview(
  data: CreateInterviewData
): Promise<string> {
  const appointmentId = required(
    data.appointmentId,
    'APPOINTMENT_ID_REQUIRED'
  );

  const existingInterview =
    await getInterviewByAppointmentId(
      appointmentId
    );

  if (existingInterview) {
    throw new Error(
      'INTERVIEW_ALREADY_EXISTS'
    );
  }

  const appointmentRef = doc(
    db,
    APPOINTMENTS_COLLECTION_NAME,
    appointmentId
  );

  const appointmentSnapshot =
    await getDoc(appointmentRef);

  if (!appointmentSnapshot.exists()) {
    throw new Error(
      'APPOINTMENT_NOT_FOUND'
    );
  }

  const appointment =
    appointmentSnapshot.data();

  /*
   * L’entretien démarre pendant le rendez-vous.
   * Le rendez-vous doit donc être confirmé,
   * et non déjà réalisé.
   */
  if (appointment.status !== 'confirmed') {
    throw new Error(
      'APPOINTMENT_NOT_CONFIRMED'
    );
  }

  const requestId = required(
    data.requestId,
    'REQUEST_ID_REQUIRED'
  );

  const personId = required(
    data.personId,
    'PERSON_ID_REQUIRED'
  );

  if (appointment.requestId !== requestId) {
    throw new Error(
      'APPOINTMENT_REQUEST_MISMATCH'
    );
  }

  if (appointment.personId !== personId) {
    throw new Error(
      'APPOINTMENT_PERSON_MISMATCH'
    );
  }

  const nextNumber =
    await getNextCounterValue(
      'interviews'
    );

  const interviewNumber =
    `MRA-I-${String(nextNumber).padStart(
      6,
      '0'
    )}`;

  const interviewRef = doc(
    collection(db, COLLECTION_NAME)
  );

  const batch = writeBatch(db);

  batch.set(interviewRef, {
    interviewNumber,
    appointmentId,

    requestId,

    personId,

    personName: required(
      data.personName,
      'PERSON_NAME_REQUIRED'
    ),

    counselorId: required(
      data.counselorId,
      'COUNSELOR_ID_REQUIRED'
    ),

    counselorName: required(
      data.counselorName,
      'COUNSELOR_NAME_REQUIRED'
    ),

    status: 'draft',

    startedAt: Timestamp.fromDate(
      data.startedAt
    ),

    endedAt: null,

    summary: null,
    observations: null,
    recommendations: null,
    decisionId: null,

    createdAt: serverTimestamp(),

    createdBy: required(
      data.createdBy,
      'USER_ID_REQUIRED'
    ),

    createdByName:
      data.createdByName?.trim() ||
      null,

    updatedAt: serverTimestamp(),

    completedAt: null,
    completedBy: null,
    completedByName: null,
  });

  batch.update(appointmentRef, {
    interviewId: interviewRef.id,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();

  return interviewRef.id;
}

export async function updateInterview(
  id: string,
  data: UpdateInterviewData
): Promise<void> {
  const interviewId = required(
    id,
    'INTERVIEW_ID_REQUIRED'
  );

  const interview =
    await getInterview(interviewId);

  if (!interview) {
    throw new Error(
      'INTERVIEW_NOT_FOUND'
    );
  }

  if (
    interview.status === 'completed'
  ) {
    throw new Error(
      'INTERVIEW_UPDATE_NOT_ALLOWED'
    );
  }

  await updateDoc(
    doc(
      db,
      COLLECTION_NAME,
      interviewId
    ),
    {
      ...(data.summary !== undefined
        ? {
            summary:
              data.summary?.trim() ||
              null,
          }
        : {}),

      ...(data.observations !== undefined
        ? {
            observations:
              data.observations?.trim() ||
              null,
          }
        : {}),

      ...(data.recommendations !== undefined
        ? {
            recommendations:
              data.recommendations?.trim() ||
              null,
          }
        : {}),

      updatedAt: serverTimestamp(),
    }
  );
}

export async function completeInterview(
  id: string,
  userId: string,
  userName: string
): Promise<void> {
  const interviewId = required(
    id,
    'INTERVIEW_ID_REQUIRED'
  );

  const completedBy = required(
    userId,
    'USER_ID_REQUIRED'
  );

  const interview =
    await getInterview(interviewId);

  if (!interview) {
    throw new Error(
      'INTERVIEW_NOT_FOUND'
    );
  }

  if (interview.status !== 'draft') {
    throw new Error(
      'INTERVIEW_ALREADY_COMPLETED'
    );
  }

  if (!interview.summary?.trim()) {
    throw new Error(
      'INTERVIEW_SUMMARY_REQUIRED'
    );
  }

  if (!interview.appointmentId.trim()) {
    throw new Error(
      'APPOINTMENT_ID_REQUIRED'
    );
  }

  const interviewRef = doc(
    db,
    COLLECTION_NAME,
    interviewId
  );

  const appointmentRef = doc(
    db,
    APPOINTMENTS_COLLECTION_NAME,
    interview.appointmentId
  );

  const appointmentSnapshot =
    await getDoc(appointmentRef);

  if (!appointmentSnapshot.exists()) {
    throw new Error(
      'APPOINTMENT_NOT_FOUND'
    );
  }

  const appointment =
    appointmentSnapshot.data();

  if (appointment.status !== 'confirmed') {
    throw new Error(
      'APPOINTMENT_NOT_CONFIRMED'
    );
  }

  const completedByName =
    userName.trim() || null;

  const batch = writeBatch(db);

  batch.update(interviewRef, {
    status: 'completed',

    endedAt: serverTimestamp(),
    completedAt: serverTimestamp(),

    completedBy,
    completedByName,

    updatedAt: serverTimestamp(),
  });

  batch.update(appointmentRef, {
    status: 'completed',

    completedAt: serverTimestamp(),
    completedBy,
    completedByName,

    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}