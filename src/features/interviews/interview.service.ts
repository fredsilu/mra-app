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

function required(value: string, code: string): string {
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
    endedAt: date(data.endedAt),
    summary: text(data.summary),
    observations: text(data.observations),
    recommendations: text(data.recommendations),
    createdAt:
      date(data.createdAt) ??
      Timestamp.now(),
    createdBy:
      typeof data.createdBy === 'string'
        ? data.createdBy
        : '',
    createdByName:
      text(data.createdByName),
    updatedAt: date(data.updatedAt),
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
  if (!id.trim()) {
    return null;
  }

  const snapshot = await getDoc(
    doc(
      db,
      COLLECTION_NAME,
      id.trim()
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
  if (!appointmentId.trim()) {
    return null;
  }

  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      where(
        'appointmentId',
        '==',
        appointmentId.trim()
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

  if (
    await getInterviewByAppointmentId(
      appointmentId
    )
  ) {
    throw new Error(
      'INTERVIEW_ALREADY_EXISTS'
    );
  }

  const appointmentRef = doc(
    db,
    'appointments',
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

  if (appointment.status !== 'completed') {
    throw new Error(
      'APPOINTMENT_NOT_COMPLETED'
    );
  }

  if (
    appointment.requestId !==
    data.requestId.trim()
  ) {
    throw new Error(
      'APPOINTMENT_REQUEST_MISMATCH'
    );
  }

  if (
    appointment.personId !==
    data.personId.trim()
  ) {
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

    requestId: required(
      data.requestId,
      'REQUEST_ID_REQUIRED'
    ),

    personId: required(
      data.personId,
      'PERSON_ID_REQUIRED'
    ),

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
  const interview =
    await getInterview(id);

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
      id.trim()
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
  const interview =
    await getInterview(id);

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

  await updateDoc(
    doc(
      db,
      COLLECTION_NAME,
      id.trim()
    ),
    {
      status: 'completed',
      endedAt: serverTimestamp(),

      completedAt:
        serverTimestamp(),

      completedBy: required(
        userId,
        'USER_ID_REQUIRED'
      ),

      completedByName:
        userName.trim() || null,

      updatedAt: serverTimestamp(),
    }
  );
}