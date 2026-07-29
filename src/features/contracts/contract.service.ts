// src/features/contracts/contract.service.ts

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
    where,
    writeBatch,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import { getNextCounterValue } from '@/features/counters/counter.service';

import type {
    Contract,
    CreateContractData,
} from './contract.types';

const COLLECTION_NAME = 'contracts';
const INTERVIEWS_COLLECTION_NAME = 'interviews';
const REQUESTS_COLLECTION_NAME = 'requests';
const APPOINTMENTS_COLLECTION_NAME = 'appointments';

/**
 * Nettoie et valide une valeur obligatoire.
 */
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

/**
 * Retourne une chaîne non vide ou undefined.
 */
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

/**
 * Retourne un Timestamp Firestore valide.
 */
function timestamp(
    value: unknown
): Timestamp | undefined {
    return value instanceof Timestamp
        ? value
        : undefined;
}

/**
 * Convertit un document Firestore en objet Contract.
 */
function mapContract(
    id: string,
    data: Record<string, unknown>
): Contract {
    return {
        id,

        contractNumber:
            typeof data.contractNumber === 'string'
                ? data.contractNumber
                : '',

        interviewId:
            typeof data.interviewId === 'string'
                ? data.interviewId
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

        signedAt:
            timestamp(data.signedAt) ??
            Timestamp.now(),

        createdAt:
            timestamp(data.createdAt) ??
            Timestamp.now(),

        createdBy:
            typeof data.createdBy === 'string'
                ? data.createdBy
                : '',

        createdByName:
            optionalText(data.createdByName),
    };
}

/**
 * Récupère tous les contrats,
 * du plus récent au plus ancien.
 */
export async function getContracts(): Promise<
    Contract[]
> {
    const snapshot = await getDocs(
        query(
            collection(db, COLLECTION_NAME),
            orderBy('createdAt', 'desc')
        )
    );

    return snapshot.docs.map((item) =>
        mapContract(
            item.id,
            item.data()
        )
    );
}

/**
 * Récupère un contrat par son identifiant.
 */
export async function getContract(
    id: string
): Promise<Contract | null> {
    const contractId = id.trim();

    if (!contractId) {
        return null;
    }

    const snapshot = await getDoc(
        doc(
            db,
            COLLECTION_NAME,
            contractId
        )
    );

    if (!snapshot.exists()) {
        return null;
    }

    return mapContract(
        snapshot.id,
        snapshot.data()
    );
}

/**
 * Récupère le contrat associé à un entretien.
 *
 * Règle métier :
 * un entretien ne peut avoir qu'un seul contrat.
 */
export async function getContractByInterviewId(
    interviewId: string
): Promise<Contract | null> {
    const normalizedInterviewId =
        interviewId.trim();

    if (!normalizedInterviewId) {
        return null;
    }

    const snapshot = await getDocs(
        query(
            collection(db, COLLECTION_NAME),
            where(
                'interviewId',
                '==',
                normalizedInterviewId
            ),
            limit(1)
        )
    );

    if (snapshot.empty) {
        return null;
    }

    const item = snapshot.docs[0];

    return mapContract(
        item.id,
        item.data()
    );
}

/**
 * Récupère le contrat associé à une demande.
 *
 * Règle métier :
 * une demande ne peut avoir qu'un seul contrat.
 */
export async function getContractByRequestId(
    requestId: string
): Promise<Contract | null> {
    const normalizedRequestId =
        requestId.trim();

    if (!normalizedRequestId) {
        return null;
    }

    const snapshot = await getDocs(
        query(
            collection(db, COLLECTION_NAME),
            where(
                'requestId',
                '==',
                normalizedRequestId
            ),
            limit(1)
        )
    );

    if (snapshot.empty) {
        return null;
    }

    const item = snapshot.docs[0];

    return mapContract(
        item.id,
        item.data()
    );
}

/**
 * Enregistre la confirmation qu'un contrat papier
 * a été signé par les deux parties.
 *
 * Aucun fichier n'est uploadé dans la V1.
 */
export async function createContract(
    data: CreateContractData
): Promise<string> {
    const interviewId = required(
        data.interviewId,
        'INTERVIEW_ID_REQUIRED'
    );

    const appointmentId = required(
        data.appointmentId,
        'APPOINTMENT_ID_REQUIRED'
    );

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

    /*
     * Un entretien ne peut donner lieu
     * qu'à un seul contrat.
     */
    const existingByInterview =
        await getContractByInterviewId(
            interviewId
        );

    if (existingByInterview) {
        throw new Error(
            'CONTRACT_ALREADY_EXISTS'
        );
    }

    /*
     * Une demande ne peut être associée
     * qu'à un seul contrat.
     */
    const existingByRequest =
        await getContractByRequestId(
            requestId
        );

    if (existingByRequest) {
        throw new Error(
            'REQUEST_CONTRACT_ALREADY_EXISTS'
        );
    }

    /*
     * Vérification de l'existence
     * de l'entretien.
     */
    const interviewRef = doc(
        db,
        INTERVIEWS_COLLECTION_NAME,
        interviewId
    );

    const interviewSnapshot =
        await getDoc(interviewRef);

    if (!interviewSnapshot.exists()) {
        throw new Error(
            'INTERVIEW_NOT_FOUND'
        );
    }

    const interview =
        interviewSnapshot.data();
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

    if (
        appointment.status !== 'completed'
    ) {
        throw new Error(
            'APPOINTMENT_NOT_COMPLETED'
        );
    }

    /*
     * Vérification de l'existence
     * de la demande.
     */
    const requestRef = doc(
        db,
        REQUESTS_COLLECTION_NAME,
        requestId
    );

    const requestSnapshot =
        await getDoc(requestRef);

    if (!requestSnapshot.exists()) {
        throw new Error(
            'REQUEST_NOT_FOUND'
        );
    }

    /*
     * Vérification de la cohérence entre
     * le contrat et l'entretien source.
     */
    if (
        interview.requestId !== requestId
    ) {
        throw new Error(
            'INTERVIEW_REQUEST_MISMATCH'
        );
    }

    if (
        interview.appointmentId !==
        appointmentId
    ) {
        throw new Error(
            'INTERVIEW_APPOINTMENT_MISMATCH'
        );
    }

    if (
        interview.personId !== personId
    ) {
        throw new Error(
            'INTERVIEW_PERSON_MISMATCH'
        );
    }

    if (
        interview.counselorId !==
        counselorId
    ) {
        throw new Error(
            'INTERVIEW_COUNSELOR_MISMATCH'
        );
    }

    /*
     * Vérification supplémentaire des liens
     * enregistrés dans la demande.
     */
    const request =
        requestSnapshot.data();

    if (
        request.personId &&
        request.personId !== personId
    ) {
        throw new Error(
            'REQUEST_PERSON_MISMATCH'
        );
    }

    /*
     * Génération du numéro du contrat.
     *
     * Exemple :
     * MRA-C-000001
     */
    const nextNumber =
        await getNextCounterValue(
            'contracts'
        );

    const contractNumber =
        `MRA-C-${String(nextNumber).padStart(
            6,
            '0'
        )}`;

    const contractRef = doc(
        collection(db, COLLECTION_NAME)
    );

    const batch = writeBatch(db);

    /*
     * L'existence du document signifie que
     * le contrat papier a été signé.
     */
    batch.set(contractRef, {
        contractNumber,

        interviewId,
        appointmentId,
        requestId,

        personId,
        personName,

        counselorId,
        counselorName,

        signedAt: serverTimestamp(),

        createdAt: serverTimestamp(),
        createdBy,

        createdByName:
            data.createdByName?.trim() ||
            null,
    });

    /*
     * L'entretien conserve l'identifiant
     * du contrat qui en découle.
     */
    batch.update(interviewRef, {
        contractId: contractRef.id,
        updatedAt: serverTimestamp(),
    });

    /*
     * La demande conserve également
     * l'identifiant de son contrat.
     */
    batch.update(requestRef, {
        contractId: contractRef.id,
        updatedAt: serverTimestamp(),
    });

    await batch.commit();

    return contractRef.id;
}