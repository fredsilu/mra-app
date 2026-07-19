// src/services/case.service.ts

import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../config/firebase';

import {
  AssignCaseCounselorData,
  CasePriority,
  CaseStatus,
  ChangeCaseStatusData,
  CreateHelpCaseData,
  HelpCase,
  UpdateHelpCaseData,
} from '../types/case.types';

const COLLECTION_NAME = 'cases';

function readTimestamp(
  value: unknown
): Timestamp | undefined {
  return value instanceof Timestamp
    ? value
    : undefined;
}

function readString(
  value: unknown
): string | undefined {
  return typeof value === 'string'
    ? value
    : undefined;
}

function mapHelpCase(
  id: string,
  data: Record<string, unknown>
): HelpCase {
  const createdAt =
    readTimestamp(data.createdAt) ??
    Timestamp.now();

  return {
    id,

    caseNumber:
      readString(data.caseNumber) ?? '',

    personId:
      readString(data.personId) ?? '',

    assignedCounselorId: readString(
      data.assignedCounselorId
    ),

    status:
      (data.status as CaseStatus) ??
      'new',

    priority:
      (data.priority as CasePriority) ??
      'normal',

    requestTitle:
      readString(data.requestTitle) ?? '',

    requestDescription:
      readString(data.requestDescription) ??
      '',

    notes: readString(data.notes),

    openedAt:
      readTimestamp(data.openedAt) ??
      createdAt,

    openedBy:
      readString(data.openedBy) ?? '',

    createdAt,

    createdBy:
      readString(data.createdBy) ?? '',

    updatedAt: readTimestamp(
      data.updatedAt
    ),

    updatedBy: readString(
      data.updatedBy
    ),

    assignedAt: readTimestamp(
      data.assignedAt
    ),

    closedAt: readTimestamp(
      data.closedAt
    ),

    closedBy: readString(
      data.closedBy
    ),

    closingReason: readString(
      data.closingReason
    ),

    cancelledAt: readTimestamp(
      data.cancelledAt
    ),

    cancelledBy: readString(
      data.cancelledBy
    ),

    cancellationReason: readString(
      data.cancellationReason
    ),
  };
}

function buildCaseNumber(
  documentId: string
): string {
  const year = new Date().getFullYear();

  const shortId = documentId
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 6)
    .toUpperCase();

  return `MRA-${year}-${shortId}`;
}

export async function createCase(
  data: CreateHelpCaseData
): Promise<string> {
  const normalizedTitle =
    data.requestTitle.trim();

  const normalizedDescription =
    data.requestDescription.trim();

  if (!data.personId.trim()) {
    throw new Error('PERSON_REQUIRED');
  }

  if (!normalizedTitle) {
    throw new Error(
      'REQUEST_TITLE_REQUIRED'
    );
  }

  if (!normalizedDescription) {
    throw new Error(
      'REQUEST_DESCRIPTION_REQUIRED'
    );
  }

  if (!data.createdBy.trim()) {
    throw new Error('CREATED_BY_REQUIRED');
  }

  const documentReference =
    await addDoc(
      collection(db, COLLECTION_NAME),
      {
        caseNumber: '',

        personId: data.personId,

        status: 'new',
        priority: data.priority,

        requestTitle: normalizedTitle,
        requestDescription:
          normalizedDescription,

        notes: data.notes?.trim() ?? '',

        openedAt: serverTimestamp(),
        openedBy: data.createdBy,

        createdAt: serverTimestamp(),
        createdBy: data.createdBy,

        updatedAt: serverTimestamp(),
        updatedBy: data.createdBy,
      }
    );

  const caseNumber = buildCaseNumber(
    documentReference.id
  );

  await updateDoc(documentReference, {
    caseNumber,
    updatedAt: serverTimestamp(),
    updatedBy: data.createdBy,
  });

  return documentReference.id;
}

export async function getCase(
  id: string
): Promise<HelpCase | null> {
  const snapshot = await getDoc(
    doc(db, COLLECTION_NAME, id)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return mapHelpCase(
    snapshot.id,
    snapshot.data()
  );
}

export async function getCases(): Promise<
  HelpCase[]
> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc')
    )
  );

  return snapshot.docs.map(
    (documentSnapshot) =>
      mapHelpCase(
        documentSnapshot.id,
        documentSnapshot.data()
      )
  );
}

export async function updateCase(
  id: string,
  data: UpdateHelpCaseData
): Promise<void> {
  const updateData: Record<
    string,
    unknown
  > = {
    updatedAt: serverTimestamp(),
    updatedBy: data.updatedBy,
  };

  if (data.priority !== undefined) {
    updateData.priority = data.priority;
  }

  if (data.requestTitle !== undefined) {
    const normalizedTitle =
      data.requestTitle.trim();

    if (!normalizedTitle) {
      throw new Error(
        'REQUEST_TITLE_REQUIRED'
      );
    }

    updateData.requestTitle =
      normalizedTitle;
  }

  if (
    data.requestDescription !==
    undefined
  ) {
    const normalizedDescription =
      data.requestDescription.trim();

    if (!normalizedDescription) {
      throw new Error(
        'REQUEST_DESCRIPTION_REQUIRED'
      );
    }

    updateData.requestDescription =
      normalizedDescription;
  }

  if (data.notes !== undefined) {
    updateData.notes = data.notes.trim();
  }

  await updateDoc(
    doc(db, COLLECTION_NAME, id),
    updateData
  );
}

export async function assignCaseCounselor(
  caseId: string,
  data: AssignCaseCounselorData
): Promise<void> {
  if (!data.assignedCounselorId.trim()) {
    throw new Error(
      'COUNSELOR_REQUIRED'
    );
  }

  await updateDoc(
    doc(db, COLLECTION_NAME, caseId),
    {
      assignedCounselorId:
        data.assignedCounselorId,

      status: 'assigned',

      assignedAt: serverTimestamp(),

      updatedAt: serverTimestamp(),
      updatedBy: data.updatedBy,
    }
  );
}

export async function changeCaseStatus(
  caseId: string,
  data: ChangeCaseStatusData
): Promise<void> {
  const updateData: Record<
    string,
    unknown
  > = {
    status: data.status,
    updatedAt: serverTimestamp(),
    updatedBy: data.updatedBy,
  };

  if (data.status === 'closed') {
    const closingReason =
      data.closingReason?.trim() ?? '';

    if (!closingReason) {
      throw new Error(
        'CLOSING_REASON_REQUIRED'
      );
    }

    updateData.closedAt =
      serverTimestamp();

    updateData.closedBy =
      data.updatedBy;

    updateData.closingReason =
      closingReason;
  }

  if (data.status === 'cancelled') {
    const cancellationReason =
      data.cancellationReason?.trim() ??
      '';

    if (!cancellationReason) {
      throw new Error(
        'CANCELLATION_REASON_REQUIRED'
      );
    }

    updateData.cancelledAt =
      serverTimestamp();

    updateData.cancelledBy =
      data.updatedBy;

    updateData.cancellationReason =
      cancellationReason;
  }

  await updateDoc(
    doc(db, COLLECTION_NAME, caseId),
    updateData
  );
}