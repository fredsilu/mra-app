import { collection, getDocs, Timestamp } from "firebase/firestore";

import { db } from "@/config/firebase";
import type { UserProfile } from "@/features/users/user.types";

import type { DashboardMetrics } from "./dashboard.types";

type FirestoreData = Record<string, unknown>;

function isAssignedToUser(data: FirestoreData, profile: UserProfile): boolean {
  if (profile.role !== "conseiller") {
    return true;
  }

  return data.counselorId === profile.uid;
}

function isOverdueActivity(data: FirestoreData, now: Date): boolean {
  if (data.status !== "planned") {
    return false;
  }

  if (!(data.scheduledAt instanceof Timestamp)) {
    return false;
  }

  return data.scheduledAt.toDate().getTime() < now.getTime();
}

export async function getDashboardMetrics(
  profile: UserProfile,
): Promise<DashboardMetrics> {
  const [peopleSnapshot, activitiesSnapshot, casesSnapshot] = await Promise.all(
    [
      getDocs(collection(db, "people")),
      getDocs(collection(db, "activities")),
      getDocs(collection(db, "cases")),
    ],
  );

  const activities = activitiesSnapshot.docs
    .map((item) => item.data())
    .filter((item) => isAssignedToUser(item, profile));

  const cases = casesSnapshot.docs
    .map((item) => item.data())
    .filter((item) => isAssignedToUser(item, profile));

  const now = new Date();

  const plannedFirstInterviews = activities.filter(
    (activity) =>
      activity.type === "first_interview" && activity.status === "planned",
  ).length;

  const plannedActivities = activities.filter(
    (activity) => activity.status === "planned",
  ).length;

  const overdueActivities = activities.filter((activity) =>
    isOverdueActivity(activity, now),
  ).length;

  const openCases = cases.filter(
    (helpCase) => helpCase.status === "active",
  ).length;

  const closedCases = cases.filter(
    (helpCase) => helpCase.status === "closed",
  ).length;

  let peopleCount = peopleSnapshot.size;

  if (profile.role === "conseiller") {
    const assignedPersonIds = new Set<string>();

    activities.forEach((activity) => {
      if (typeof activity.personId === "string") {
        assignedPersonIds.add(activity.personId);
      }
    });

    cases.forEach((helpCase) => {
      if (typeof helpCase.personId === "string") {
        assignedPersonIds.add(helpCase.personId);
      }
    });

    peopleCount = assignedPersonIds.size;
  }

  return {
    peopleCount,
    plannedFirstInterviews,
    plannedActivities,
    overdueActivities,
    openCases,
    closedCases,
  };
}
