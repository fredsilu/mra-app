// src/services/case.service.ts

import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

import { db } from '@/config/firebase';

import {
  AssignCaseCounselorData,
  CasePriority,
  CaseStatus,
  ChangeCaseStatusData,
  CreateHelpCaseData,
  HelpCase,
  UpdateHelpCaseData,
  CASE_STATUS_LABELS,
} from '@/features/cases/case.types';

import {
  CaseHistoryAction,
} from '@/features/cases/case-history.types';

const CASES_COLLECTION_NAME = 'cases';

const HISTORY_COLLECTION_NAME =
  'case_history';

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

    assignedCounselorId:
      readString(
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
      readString(
        data.requestDescription
      ) ?? '',

    notes:
      readString(data.notes),

    openedAt:
      readTimestamp(data.openedAt) ??
      createdAt,

    openedBy:
      readString(data.openedBy) ?? '',

    createdAt,

    createdBy:
      readString(data.createdBy) ?? '',

    updatedAt:
      readTimestamp(data.updatedAt),

    updatedBy:
      readString(data.updatedBy),

    assignedAt:
      readTimestamp(data.assignedAt),

    closedAt:
      readTimestamp(data.closedAt),

    closedBy:
      readString(data.closedBy),

    closingReason:
      readString(data.closingReason),

    cancelledAt:
      readTimestamp(data.cancelledAt),

    cancelledBy:
      readString(data.cancelledBy),

    cancellationReason:
      readString(
        data.cancellationReason
      ),
  };
}

function buildCaseNumber(
  documentId: string
): string {
  const year =
    new Date().getFullYear();

  const shortId = documentId
    .replace(
      /[^a-zA-Z0-9]/g,
      ''
    )
    .slice(0, 6)
    .toUpperCase();

  return `MRA-${year}-${shortId}`;
}

function createHistoryReference() {
  return doc(
    collection(
      db,
      HISTORY_COLLECTION_NAME
    )
  );
}

function buildHistoryData(
  caseId: string,
  action: CaseHistoryAction,
  description: string,
  performedBy: string
) {
  return {
    caseId,
    action,
    description,
    performedBy,
    performedAt: serverTimestamp(),
  };
}

export async function createCase(
  data: CreateHelpCaseData
): Promise<string> {
  const normalizedPersonId =
    data.personId.trim();

  const normalizedTitle =
    data.requestTitle.trim();

  const normalizedDescription =
    data.requestDescription.trim();

  const normalizedCreatedBy =
    data.createdBy.trim();

  if (!normalizedPersonId) {
    throw new Error(
      'PERSON_REQUIRED'
    );
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

  if (!normalizedCreatedBy) {
    throw new Error(
      'CREATED_BY_REQUIRED'
    );
  }

  const caseReference = doc(
    collection(
      db,
      CASES_COLLECTION_NAME
    )
  );

  const historyReference =
    createHistoryReference();

  const caseNumber =
    buildCaseNumber(
      caseReference.id
    );

  const batch = writeBatch(db);

  batch.set(
    caseReference,
    {
      caseNumber,

      personId:
        normalizedPersonId,

      status: 'new',
      priority: data.priority,

      requestTitle:
        normalizedTitle,

      requestDescription:
        normalizedDescription,

      notes:
        data.notes?.trim() ?? '',

      openedAt:
        serverTimestamp(),

      openedBy:
        normalizedCreatedBy,

      createdAt:
        serverTimestamp(),

      createdBy:
        normalizedCreatedBy,

      updatedAt:
        serverTimestamp(),

      updatedBy:
        normalizedCreatedBy,
    }
  );

  batch.set(
    historyReference,
    buildHistoryData(
      caseReference.id,
      'CASE_CREATED',
      `Création du dossier ${caseNumber}.`,
      normalizedCreatedBy
    )
  );

  await batch.commit();

  return caseReference.id;
}

export async function getCase(
  id: string
): Promise<HelpCase | null> {
  const normalizedId = id.trim();

  if (!normalizedId) {
    return null;
  }

  const snapshot = await getDoc(
    doc(
      db,
      CASES_COLLECTION_NAME,
      normalizedId
    )
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
      collection(
        db,
        CASES_COLLECTION_NAME
      ),
      orderBy(
        'createdAt',
        'desc'
      )
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
  const normalizedId = id.trim();

  const normalizedUpdatedBy =
    data.updatedBy.trim();

  if (!normalizedId) {
    throw new Error(
      'CASE_ID_REQUIRED'
    );
  }

  if (!normalizedUpdatedBy) {
    throw new Error(
      'UPDATED_BY_REQUIRED'
    );
  }

  const updateData: Record<
    string,
    unknown
  > = {
    updatedAt:
      serverTimestamp(),

    updatedBy:
      normalizedUpdatedBy,
  };

  if (data.priority !== undefined) {
    updateData.priority =
      data.priority;
  }

  if (
    data.requestTitle !== undefined
  ) {
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
    updateData.notes =
      data.notes.trim();
  }

  const caseReference = doc(
    db,
    CASES_COLLECTION_NAME,
    normalizedId
  );

  const batch = writeBatch(db);

  batch.update(
    caseReference,
    updateData
  );

  await batch.commit();
}

export async function assignCaseCounselor(
  caseId: string,
  data: AssignCaseCounselorData
): Promise<void> {
  const normalizedCaseId =
    caseId.trim();

  const normalizedCounselorId =
    data.assignedCounselorId.trim();

  const normalizedUpdatedBy =
    data.updatedBy.trim();

  if (!normalizedCaseId) {
    throw new Error(
      'CASE_ID_REQUIRED'
    );
  }

  if (!normalizedCounselorId) {
    throw new Error(
      'COUNSELOR_REQUIRED'
    );
  }

  if (!normalizedUpdatedBy) {
    throw new Error(
      'UPDATED_BY_REQUIRED'
    );
  }

  const caseReference = doc(
    db,
    CASES_COLLECTION_NAME,
    normalizedCaseId
  );

  const caseSnapshot =
    await getDoc(caseReference);

  if (!caseSnapshot.exists()) {
    throw new Error(
      'CASE_NOT_FOUND'
    );
  }

  const currentCase =
    mapHelpCase(
      caseSnapshot.id,
      caseSnapshot.data()
    );

  const isCounselorChange =
    Boolean(
      currentCase.assignedCounselorId
    );

  const historyAction:
    CaseHistoryAction =
      isCounselorChange
        ? 'COUNSELOR_CHANGED'
        : 'COUNSELOR_ASSIGNED';

  const historyDescription =
    isCounselorChange
      ? 'Le conseiller affecté au dossier a été remplacé.'
      : 'Un conseiller a été affecté au dossier.';

  const historyReference =
    createHistoryReference();

  const batch = writeBatch(db);

  batch.update(
    caseReference,
    {
      assignedCounselorId:
        normalizedCounselorId,

      status: 'assigned',

      assignedAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),

      updatedBy:
        normalizedUpdatedBy,
    }
  );

  batch.set(
    historyReference,
    buildHistoryData(
      normalizedCaseId,
      historyAction,
      historyDescription,
      normalizedUpdatedBy
    )
  );

  await batch.commit();
}

export async function changeCaseStatus(
  caseId: string,
  data: ChangeCaseStatusData
): Promise<void> {
  const normalizedCaseId =
    caseId.trim();

  const normalizedUpdatedBy =
    data.updatedBy.trim();

  if (!normalizedCaseId) {
    throw new Error(
      'CASE_ID_REQUIRED'
    );
  }

  if (!normalizedUpdatedBy) {
    throw new Error(
      'UPDATED_BY_REQUIRED'
    );
  }

  const caseReference = doc(
    db,
    CASES_COLLECTION_NAME,
    normalizedCaseId
  );

  const caseSnapshot =
    await getDoc(caseReference);

  if (!caseSnapshot.exists()) {
    throw new Error(
      'CASE_NOT_FOUND'
    );
  }

  const currentCase =
    mapHelpCase(
      caseSnapshot.id,
      caseSnapshot.data()
    );

  if (
    currentCase.status === data.status
  ) {
    return;
  }

  const updateData: Record<
    string,
    unknown
  > = {
    status: data.status,

    updatedAt:
      serverTimestamp(),

    updatedBy:
      normalizedUpdatedBy,
  };

  let historyAction:
    CaseHistoryAction =
      'STATUS_CHANGED';

  let historyDescription =
    `Statut modifié de « ${
      CASE_STATUS_LABELS[
        currentCase.status
      ]
    } » à « ${
      CASE_STATUS_LABELS[
        data.status
      ]
    } ».`;

  if (data.status === 'closed') {
    const closingReason =
      data.closingReason?.trim() ??
      '';

    if (!closingReason) {
      throw new Error(
        'CLOSING_REASON_REQUIRED'
      );
    }

    updateData.closedAt =
      serverTimestamp();

    updateData.closedBy =
      normalizedUpdatedBy;

    updateData.closingReason =
      closingReason;

    historyAction =
      'CASE_CLOSED';

    historyDescription =
      `Dossier clôturé. Motif : ${closingReason}`;
  }

  if (
    data.status === 'cancelled'
  ) {
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
      normalizedUpdatedBy;

    updateData.cancellationReason =
      cancellationReason;

    historyAction =
      'CASE_CANCELLED';

    historyDescription =
      `Dossier annulé. Motif : ${cancellationReason}`;
  }

  const historyReference =
    createHistoryReference();

  const batch = writeBatch(db);

  batch.update(
    caseReference,
    updateData
  );

  batch.set(
    historyReference,
    buildHistoryData(
      normalizedCaseId,
      historyAction,
      historyDescription,
      normalizedUpdatedBy
    )
  );

  await batch.commit();
}