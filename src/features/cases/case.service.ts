// src/features/cases/case.service.ts

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
} from "firebase/firestore";

import { db } from "@/config/firebase";
import { getNextCounterValue } from "@/features/counters/counter.service";
import { getActivityById } from "@/features/activities/activity.service";
import type {
  Case,
  CaseStatus,
  ChangeCaseCounselorData,
  CloseCaseData,
  CreateCaseData,
  CreateCaseFromFirstInterviewData,
} from "./case.types";

const COLLECTION_NAME = "cases";
const CONTRACTS_COLLECTION_NAME = "contracts";
const INTERVIEWS_COLLECTION_NAME = "interviews";
const REQUESTS_COLLECTION_NAME = "requests";

const CASE_STATUSES: CaseStatus[] = ["active", "closed"];

/**
 * Valide et nettoie une chaîne obligatoire.
 */
function required(value: string, errorCode: string): string {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    throw new Error(errorCode);
  }

  return normalizedValue;
}

/**
 * Retourne une chaîne nettoyée ou undefined.
 */
function optionalText(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return undefined;
}

/**
 * Retourne un Timestamp Firestore valide.
 */
function timestamp(value: unknown): Timestamp | undefined {
  return value instanceof Timestamp ? value : undefined;
}

/**
 * Retourne un statut valide.
 */
function caseStatus(value: unknown): CaseStatus {
  return CASE_STATUSES.includes(value as CaseStatus)
    ? (value as CaseStatus)
    : "active";
}

/**
 * Convertit un document Firestore en Case.
 */
function mapCase(id: string, data: Record<string, unknown>): Case {
  return {
    id,

    caseNumber: typeof data.caseNumber === "string" ? data.caseNumber : "",

    contractId: typeof data.contractId === "string" ? data.contractId : "",

    interviewId: typeof data.interviewId === "string" ? data.interviewId : "",

    appointmentId:
      typeof data.appointmentId === "string" ? data.appointmentId : "",

    requestId: typeof data.requestId === "string" ? data.requestId : "",

    personId: typeof data.personId === "string" ? data.personId : "",

    personName: typeof data.personName === "string" ? data.personName : "",

    counselorId: typeof data.counselorId === "string" ? data.counselorId : "",

    counselorName:
      typeof data.counselorName === "string" ? data.counselorName : "",

    status: caseStatus(data.status),

    openedAt: timestamp(data.openedAt) ?? Timestamp.now(),

    closedAt: timestamp(data.closedAt),

    closureReason: optionalText(data.closureReason),

    closureSummary: optionalText(data.closureSummary),

    createdAt: timestamp(data.createdAt) ?? Timestamp.now(),

    createdBy: typeof data.createdBy === "string" ? data.createdBy : "",

    createdByName: optionalText(data.createdByName),

    updatedAt: timestamp(data.updatedAt),

    updatedBy: optionalText(data.updatedBy),

    updatedByName: optionalText(data.updatedByName),
  };
}

/**
 * Retourne tous les dossiers,
 * du plus récent au plus ancien.
 */
export async function getCases(): Promise<Case[]> {
  const snapshot = await getDocs(
    query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc")),
  );

  return snapshot.docs.map((item) => mapCase(item.id, item.data()));
}

/**
 * Retourne uniquement les dossiers attribués
 * à un conseiller.
 */
export async function getCasesByCounselor(
  counselorId: string,
): Promise<Case[]> {
  const normalizedCounselorId = counselorId.trim();

  if (!normalizedCounselorId) {
    return [];
  }

  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      where("counselorId", "==", normalizedCounselorId),
    ),
  );

  return snapshot.docs
    .map((item) => mapCase(item.id, item.data()))
    .sort(
      (firstCase, secondCase) =>
        secondCase.createdAt.toMillis() - firstCase.createdAt.toMillis(),
    );
}
/**
 * Retourne un dossier par son identifiant.
 */
export async function getCase(id: string): Promise<Case | null> {
  const caseId = id.trim();

  if (!caseId) {
    return null;
  }

  const snapshot = await getDoc(doc(db, COLLECTION_NAME, caseId));

  if (!snapshot.exists()) {
    return null;
  }

  return mapCase(snapshot.id, snapshot.data());
}

/**
 * Retourne tous les dossiers d’une personne.
 */
export async function getCasesByPersonId(personId: string): Promise<Case[]> {
  const normalizedPersonId = personId.trim();

  if (!normalizedPersonId) {
    return [];
  }

  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      where("personId", "==", normalizedPersonId),
    ),
  );

  return snapshot.docs
    .map((item) => mapCase(item.id, item.data()))
    .sort(
      (firstCase, secondCase) =>
        secondCase.createdAt.toMillis() - firstCase.createdAt.toMillis(),
    );
}

/**
 * Retourne le dossier en cours d’une personne.
 *
 * Les statuts active et suspended sont
 * considérés comme des dossiers en cours.
 */
export async function getOpenCaseByPersonId(
  personId: string,
): Promise<Case | null> {
  const normalizedPersonId = personId.trim();

  if (!normalizedPersonId) {
    return null;
  }

  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      where("personId", "==", normalizedPersonId),
      where("status", "==", "active"),
      limit(1),
    ),
  );

  if (snapshot.empty) {
    return null;
  }

  const item = snapshot.docs[0];

  return mapCase(item.id, item.data());
}

/**
 * Retourne le dossier associé à un contrat.
 */
export async function getCaseByContractId(
  contractId: string,
): Promise<Case | null> {
  const normalizedContractId = contractId.trim();

  if (!normalizedContractId) {
    return null;
  }

  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      where("contractId", "==", normalizedContractId),
      limit(1),
    ),
  );

  if (snapshot.empty) {
    return null;
  }

  const item = snapshot.docs[0];

  return mapCase(item.id, item.data());
}

/**
 * Ouvre un nouveau dossier d’accompagnement.
 */
export async function createCase(data: CreateCaseData): Promise<string> {
  const contractId = required(data.contractId, "CONTRACT_ID_REQUIRED");

  const interviewId = required(data.interviewId, "INTERVIEW_ID_REQUIRED");

  const appointmentId = required(data.appointmentId, "APPOINTMENT_ID_REQUIRED");

  const requestId = required(data.requestId, "REQUEST_ID_REQUIRED");

  const personId = required(data.personId, "PERSON_ID_REQUIRED");

  const personName = required(data.personName, "PERSON_NAME_REQUIRED");

  const counselorId = required(data.counselorId, "COUNSELOR_ID_REQUIRED");

  const counselorName = required(data.counselorName, "COUNSELOR_NAME_REQUIRED");

  const createdBy = required(data.createdBy, "USER_ID_REQUIRED");

  /*
   * Un contrat ne peut ouvrir
   * qu’un seul dossier.
   */
  const existingByContract = await getCaseByContractId(contractId);

  if (existingByContract) {
    throw new Error("CASE_ALREADY_EXISTS");
  }

  /*
   * Une personne ne peut avoir
   * qu’un seul dossier en cours.
   */
  const existingOpenCase = await getOpenCaseByPersonId(personId);

  if (existingOpenCase) {
    throw new Error("PERSON_ALREADY_HAS_OPEN_CASE");
  }

  /*
   * Vérification du contrat.
   */
  const contractRef = doc(db, CONTRACTS_COLLECTION_NAME, contractId);

  const contractSnapshot = await getDoc(contractRef);

  if (!contractSnapshot.exists()) {
    throw new Error("CONTRACT_NOT_FOUND");
  }

  const contract = contractSnapshot.data();

  /*
   * Vérification de l’entretien.
   */
  const interviewRef = doc(db, INTERVIEWS_COLLECTION_NAME, interviewId);

  const interviewSnapshot = await getDoc(interviewRef);

  if (!interviewSnapshot.exists()) {
    throw new Error("INTERVIEW_NOT_FOUND");
  }

  const interview = interviewSnapshot.data();

  /*
   * Vérification de la demande.
   */
  const requestRef = doc(db, REQUESTS_COLLECTION_NAME, requestId);

  const requestSnapshot = await getDoc(requestRef);

  if (!requestSnapshot.exists()) {
    throw new Error("REQUEST_NOT_FOUND");
  }

  const request = requestSnapshot.data();

  /*
   * Vérification de la cohérence
   * entre le contrat et le dossier.
   */
  if (contract.interviewId !== interviewId) {
    throw new Error("CONTRACT_INTERVIEW_MISMATCH");
  }

  if (contract.appointmentId !== appointmentId) {
    throw new Error("CONTRACT_APPOINTMENT_MISMATCH");
  }

  if (contract.requestId !== requestId) {
    throw new Error("CONTRACT_REQUEST_MISMATCH");
  }

  if (contract.personId !== personId) {
    throw new Error("CONTRACT_PERSON_MISMATCH");
  }

  if (contract.counselorId !== counselorId) {
    throw new Error("CONTRACT_COUNSELOR_MISMATCH");
  }

  /*
   * Vérification de la cohérence
   * entre l’entretien et le dossier.
   */
  if (interview.requestId !== requestId) {
    throw new Error("INTERVIEW_REQUEST_MISMATCH");
  }

  if (interview.appointmentId !== appointmentId) {
    throw new Error("INTERVIEW_APPOINTMENT_MISMATCH");
  }

  if (interview.personId !== personId) {
    throw new Error("INTERVIEW_PERSON_MISMATCH");
  }

  if (interview.counselorId !== counselorId) {
    throw new Error("INTERVIEW_COUNSELOR_MISMATCH");
  }

  /*
   * Vérification complémentaire
   * de la demande.
   */
  if (request.personId && request.personId !== personId) {
    throw new Error("REQUEST_PERSON_MISMATCH");
  }

  /*
   * Génération du numéro de dossier.
   *
   * Exemple :
   * MRA-D-000001
   */
  const nextNumber = await getNextCounterValue("cases");

  const caseNumber = `MRA-D-${String(nextNumber).padStart(6, "0")}`;

  const caseRef = doc(collection(db, COLLECTION_NAME));

  const batch = writeBatch(db);

  batch.set(caseRef, {
    caseNumber,

    contractId,
    interviewId,
    appointmentId,
    requestId,

    personId,
    personName,

    counselorId,
    counselorName,

    status: "active",

    openedAt: serverTimestamp(),

    closedAt: null,
    closureReason: null,

    createdAt: serverTimestamp(),
    createdBy,

    createdByName: data.createdByName?.trim() || null,

    updatedAt: serverTimestamp(),
    updatedBy: createdBy,

    updatedByName: data.createdByName?.trim() || null,
  });

  /*
   * Le contrat conserve l’identifiant
   * du dossier ouvert.
   */
  batch.update(contractRef, {
    caseId: caseRef.id,
    updatedAt: serverTimestamp(),
  });

  /*
   * L’entretien conserve également
   * l’identifiant du dossier.
   */
  batch.update(interviewRef, {
    caseId: caseRef.id,
    updatedAt: serverTimestamp(),
  });

  /*
   * La demande conserve également
   * l’identifiant du dossier.
   */
  batch.update(requestRef, {
    caseId: caseRef.id,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();

  return caseRef.id;
}

export async function createCaseFromFirstInterview(
  data: CreateCaseFromFirstInterviewData,
): Promise<string> {
  const firstInterviewActivityId = required(
    data.firstInterviewActivityId,
    "FIRST_INTERVIEW_ACTIVITY_ID_REQUIRED",
  );

  const createdBy = required(data.createdBy, "USER_ID_REQUIRED");

  const firstInterview = await getActivityById(firstInterviewActivityId);

  if (!firstInterview) {
    throw new Error("FIRST_INTERVIEW_NOT_FOUND");
  }

  if (firstInterview.type !== "first_interview") {
    throw new Error("ACTIVITY_IS_NOT_FIRST_INTERVIEW");
  }

  if (firstInterview.status !== "completed") {
    throw new Error("FIRST_INTERVIEW_NOT_COMPLETED");
  }

  if (firstInterview.caseId) {
    const existingCase = await getCase(firstInterview.caseId);

    if (existingCase) {
      return existingCase.id;
    }

    throw new Error("FIRST_INTERVIEW_ALREADY_LINKED");
  }

  const existingOpenCase = await getOpenCaseByPersonId(firstInterview.personId);

  if (existingOpenCase) {
    return existingOpenCase.id;
  }

  const nextNumber = await getNextCounterValue("cases");

  const caseNumber = `MRA-D-${String(nextNumber).padStart(6, "0")}`;

  const caseRef = doc(collection(db, COLLECTION_NAME));

  const activityRef = doc(db, "activities", firstInterview.id);

  const batch = writeBatch(db);

  batch.set(caseRef, {
    caseNumber,

    /*
     * Ces champs appartiennent à l’ancien
     * workflow basé sur contrat.
     */
    contractId: "",
    interviewId: "",
    appointmentId: "",
    requestId: "",

    firstInterviewActivityId: firstInterview.id,

    personId: firstInterview.personId,
    personName: firstInterview.personName,

    counselorId: firstInterview.counselorId,

    counselorName: firstInterview.counselorName,

    status: "active",

    openedAt: serverTimestamp(),

    closedAt: null,
    closureReason: null,

    createdAt: serverTimestamp(),
    createdBy,

    createdByName: data.createdByName?.trim() || null,

    updatedAt: serverTimestamp(),
    updatedBy: createdBy,

    updatedByName: data.createdByName?.trim() || null,
  });

  batch.update(activityRef, {
    caseId: caseRef.id,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();

  return caseRef.id;
}

/**
 * Change le conseiller responsable.
 */
export async function changeCaseCounselor(
  id: string,
  data: ChangeCaseCounselorData,
): Promise<void> {
  const caseId = required(id, "CASE_ID_REQUIRED");

  const counselorId = required(data.counselorId, "COUNSELOR_ID_REQUIRED");

  const counselorName = required(data.counselorName, "COUNSELOR_NAME_REQUIRED");

  const updatedBy = required(data.updatedBy, "USER_ID_REQUIRED");

  const currentCase = await getCase(caseId);

  if (!currentCase) {
    throw new Error("CASE_NOT_FOUND");
  }

  if (currentCase.status === "closed") {
    throw new Error("CASE_ALREADY_CLOSED");
  }

  if (currentCase.counselorId === counselorId) {
    throw new Error("COUNSELOR_ALREADY_ASSIGNED");
  }

  await updateDoc(doc(db, COLLECTION_NAME, caseId), {
    counselorId,
    counselorName,

    updatedAt: serverTimestamp(),
    updatedBy,

    updatedByName: data.updatedByName?.trim() || null,
  });
}

/**
 * Clôture définitivement un dossier.
 */
export async function closeCase(
  id: string,
  data: CloseCaseData,
): Promise<void> {
  const caseId = required(id, "CASE_ID_REQUIRED");

  const closureReason = required(data.closureReason, "CLOSURE_REASON_REQUIRED");

  const updatedBy = required(data.updatedBy, "USER_ID_REQUIRED");

  const currentCase = await getCase(caseId);

  const closureSummary = required(
    data.closureSummary,
    "CLOSURE_SUMMARY_REQUIRED",
  );

  if (!currentCase) {
    throw new Error("CASE_NOT_FOUND");
  }

  if (currentCase.status === "closed") {
    throw new Error("CASE_ALREADY_CLOSED");
  }

  await updateDoc(doc(db, COLLECTION_NAME, caseId), {
    status: "closed",

    closedAt: serverTimestamp(),
    closureReason,
    closureSummary,

    updatedAt: serverTimestamp(),
    updatedBy,

    updatedByName: data.updatedByName?.trim() || null,
  });
}
