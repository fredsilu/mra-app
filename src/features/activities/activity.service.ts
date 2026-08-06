import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/config/firebase";

import type {
  Activity,
  CreateActivityInput,
  UpdateActivityInput,
} from "./activity.types";

const COLLECTION_NAME = "activities";

function mapActivity(id: string, data: Record<string, unknown>): Activity {
  return {
    id,
    ...(data as Omit<Activity, "id">),
  };
}

function dateToTimestamp(value?: Date | null): Timestamp | null {
  return value ? Timestamp.fromDate(value) : null;
}

async function hasPlannedFirstInterview(personId: string): Promise<boolean> {
  const snapshot = await getDocs(
    query(collection(db, COLLECTION_NAME), where("personId", "==", personId)),
  );

  return snapshot.docs.some((item) => {
    const data = item.data();

    return data.type === "first_interview" && data.status === "planned";
  });
}

export async function createActivity(
  input: CreateActivityInput,
): Promise<string> {
  if (
    input.type === "first_interview" &&
    (input.status ?? "planned") === "planned"
  ) {
    const alreadyExists = await hasPlannedFirstInterview(input.personId);

    if (alreadyExists) {
      throw new Error("PLANNED_FIRST_INTERVIEW_ALREADY_EXISTS");
    }
  }
  const reference = await addDoc(collection(db, COLLECTION_NAME), {
    personId: input.personId,
    personName: input.personName,
    caseId: input.caseId ?? null,
    counselorId: input.counselorId,
    counselorName: input.counselorName,
    type: input.type,
    status: input.status ?? "planned",
    scheduledAt: dateToTimestamp(input.scheduledAt),
    completedAt: dateToTimestamp(input.completedAt),
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    result: input.result?.trim() ?? "",
    createdBy: input.createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return reference.id;
}

export async function getActivityById(
  activityId: string,
): Promise<Activity | null> {
  const snapshot = await getDoc(doc(db, COLLECTION_NAME, activityId));

  if (!snapshot.exists()) {
    return null;
  }

  return mapActivity(snapshot.id, snapshot.data());
}

export async function getAllActivities(): Promise<Activity[]> {
  const activitiesQuery = query(
    collection(db, COLLECTION_NAME),
    orderBy("scheduledAt", "desc"),
  );

  const snapshot = await getDocs(activitiesQuery);

  return snapshot.docs.map((item) => mapActivity(item.id, item.data()));
}

export async function getActivitiesByPerson(
  personId: string,
): Promise<Activity[]> {
  const normalizedPersonId = personId.trim();

  if (!normalizedPersonId) {
    return [];
  }

  const activitiesQuery = query(
    collection(db, COLLECTION_NAME),
    where("personId", "==", normalizedPersonId),
    orderBy("scheduledAt", "desc"),
  );

  const snapshot = await getDocs(activitiesQuery);

  return snapshot.docs.map((item) => mapActivity(item.id, item.data()));
}

export async function updateActivity(
  activityId: string,
  input: UpdateActivityInput,
): Promise<void> {
  const payload: Record<string, unknown> = {
    ...input,
    updatedAt: serverTimestamp(),
  };

  if ("scheduledAt" in input) {
    payload.scheduledAt = dateToTimestamp(input.scheduledAt);
  }

  if ("completedAt" in input) {
    payload.completedAt = dateToTimestamp(input.completedAt);
  }

  if (typeof input.title === "string") {
    payload.title = input.title.trim();
  }

  if (typeof input.description === "string") {
    payload.description = input.description.trim();
  }

  if (typeof input.result === "string") {
    payload.result = input.result.trim();
  }

  await updateDoc(doc(db, COLLECTION_NAME, activityId), payload);
}

export async function completeActivity(
  activityId: string,
  result: string,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, activityId), {
    status: "completed",
    result: result.trim(),
    completedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function cancelActivity(activityId: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, activityId), {
    status: "cancelled",
    updatedAt: serverTimestamp(),
  });
}

export async function deleteActivity(activityId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, activityId));
}

export async function getActivitiesByCounselor(
  counselorId: string,
): Promise<Activity[]> {
  const normalizedCounselorId = counselorId.trim();

  if (!normalizedCounselorId) {
    return [];
  }

  const activitiesQuery = query(
    collection(db, COLLECTION_NAME),
    where("counselorId", "==", normalizedCounselorId),
    orderBy("scheduledAt", "asc"),
  );

  const snapshot = await getDocs(activitiesQuery);

  return snapshot.docs.map((item) => mapActivity(item.id, item.data()));
}

export async function getActivitiesByCase(caseId: string): Promise<Activity[]> {
  const normalizedCaseId = caseId.trim();

  if (!normalizedCaseId) {
    return [];
  }

  const activitiesQuery = query(
    collection(db, COLLECTION_NAME),
    where("caseId", "==", normalizedCaseId),
    orderBy("scheduledAt", "desc"),
  );

  const snapshot = await getDocs(activitiesQuery);

  return snapshot.docs.map((item) => mapActivity(item.id, item.data()));
}

export async function getPlannedActivities(): Promise<Activity[]> {
  const activitiesQuery = query(
    collection(db, COLLECTION_NAME),
    where("status", "==", "planned"),
    orderBy("scheduledAt", "asc"),
  );

  const snapshot = await getDocs(activitiesQuery);

  return snapshot.docs.map((item) => mapActivity(item.id, item.data()));
}
