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

    summary: text(data.summary),

    observations: text(data.observations),

    recommendations: text(
      data.recommendations
    ),

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
  };
}

export async function getInterviews(): Promise<
  Interview[]
> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc')
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

  /*
   * Un rendez-vous ne peut donner lieu
   * qu'à un seul entretien.
   */
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
   * Un entretien peut être enregistré
   * lorsque le rendez-vous est confirmé
   * ou déjà marqué comme réalisé.
   */
  if (
    appointment.status !== 'confirmed' &&
    appointment.status !== 'completed'
  ) {
    throw new Error(
      'APPOINTMENT_NOT_READY_FOR_INTERVIEW'
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

  const personName = required(
    data.personName,
    'PERSON_NAME_REQUIRED'
  );

  const counselorId = required(
    data.counselorId,
    'COUNSELOR_ID_REQUIRED'
  );

  const counselorName = required(
    data.counselorName,
    'COUNSELOR_NAME_REQUIRED'
  );

  const createdBy = required(
    data.createdBy,
    'USER_ID_REQUIRED'
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

  if (
    appointment.counselorId !==
    counselorId
  ) {
    throw new Error(
      'APPOINTMENT_COUNSELOR_MISMATCH'
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
    personName,

    counselorId,
    counselorName,

    summary: null,
    observations: null,
    recommendations: null,

    createdAt: serverTimestamp(),
    createdBy,
    createdByName:
      data.createdByName?.trim() ||
      null,

    updatedAt: serverTimestamp(),
  });

  /*
   * Le rendez-vous conserve l'identifiant
   * de son unique entretien.
   */
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