// src/services/request.service.ts

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
    CreateHelpRequestData,
    HelpRequest,
    RequestStatus,
    UpdateHelpRequestData,
} from '../types/request.types';

const COLLECTION_NAME = 'requests';

function mapHelpRequest(
    id: string,
    data: Record<string, unknown>
): HelpRequest {
    return {
        id,

        personId:
            typeof data.personId === 'string'
                ? data.personId
                : '',

        personName:
            typeof data.personName === 'string'
                ? data.personName
                : '',

        assignedCounselorId:
            typeof data.assignedCounselorId === 'string'
                ? data.assignedCounselorId
                : undefined,

        assignedCounselorName:
            typeof data.assignedCounselorName === 'string'
                ? data.assignedCounselorName
                : undefined,

        status:
            (data.status as RequestStatus) ?? 'new',

        priority:
            (data.priority as any) ?? 'normal',

        reason:
            typeof data.reason === 'string'
                ? data.reason
                : '',

        notes:
            typeof data.notes === 'string'
                ? data.notes
                : undefined,

        createdAt:
            data.createdAt instanceof Timestamp
                ? data.createdAt
                : Timestamp.now(),

        createdBy:
            typeof data.createdBy === 'string'
                ? data.createdBy
                : '',

        createdByName:
            typeof data.createdByName === 'string'
                ? data.createdByName
                : undefined,

        updatedAt:
            data.updatedAt instanceof Timestamp
                ? data.updatedAt
                : undefined,

        assignedAt:
            data.assignedAt instanceof Timestamp
                ? data.assignedAt
                : undefined,

        closedAt:
            data.closedAt instanceof Timestamp
                ? data.closedAt
                : undefined,

        cancelledAt:
            data.cancelledAt instanceof Timestamp
                ? data.cancelledAt
                : undefined,
    };
}

export async function createRequest(
    data: CreateHelpRequestData
): Promise<string> {
    const docRef = await addDoc(
        collection(db, COLLECTION_NAME),
        {
            personId: data.personId,
            personName: data.personName,

            status: 'new',
            priority: data.priority,

            reason: data.reason.trim(),
            notes: data.notes?.trim() ?? '',

            createdBy: data.createdBy,
            createdByName:
                data.createdByName ?? '',

            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }
    );

    return docRef.id;
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

    return snapshot.docs.map((doc) =>
        mapHelpRequest(doc.id, doc.data())
    );
}

export async function updateRequest(
    id: string,
    data: UpdateHelpRequestData
): Promise<void> {
    const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
    };

    await updateDoc(
        doc(db, COLLECTION_NAME, id),
        updateData
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
                counselorName,

            status: 'assigned',

            assignedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }
    );
}

export async function changeRequestStatus(
    requestId: string,
    status: RequestStatus
): Promise<void> {
    const data: Record<
        string,
        unknown
    > = {
        status,
        updatedAt: serverTimestamp(),
    };

    if (status === 'closed') {
        data.closedAt =
            serverTimestamp();
    }

    if (status === 'cancelled') {
        data.cancelledAt =
            serverTimestamp();
    }

    await updateDoc(
        doc(db, COLLECTION_NAME, requestId),
        data
    );
}