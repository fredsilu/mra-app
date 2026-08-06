import {
  getActivitiesByCounselor,
  isActivityOverdue,
} from "@/features/activities";
import { getCases } from "@/features/cases/case.service";

import type { CounselorDashboardData } from "./counselor-dashboard.types";

export async function getCounselorDashboardData(
  counselorId: string,
): Promise<CounselorDashboardData> {
  const normalizedCounselorId = counselorId.trim();

  if (!normalizedCounselorId) {
    throw new Error("COUNSELOR_ID_REQUIRED");
  }

  const [activities, allCases] = await Promise.all([
    getActivitiesByCounselor(normalizedCounselorId),
    getCases(),
  ]);

  const counselorCases = allCases.filter(
    (item) => item.counselorId === normalizedCounselorId,
  );

  const activeCases = counselorCases.filter((item) => item.status === "active");

  const now = new Date();

  const plannedActivities = activities
    .filter(
      (activity) =>
        activity.status === "planned" && Boolean(activity.scheduledAt),
    )
    .sort((first, second) => {
      const firstTime = first.scheduledAt?.toMillis() ?? 0;

      const secondTime = second.scheduledAt?.toMillis() ?? 0;

      return firstTime - secondTime;
    });

  const overdueActivitiesCount = plannedActivities.filter((activity) =>
    isActivityOverdue(activity, now),
  ).length;

  const recentCompletedActivities = activities
    .filter((activity) => activity.status === "completed")
    .sort((first, second) => {
      const firstTime =
        first.completedAt?.toMillis() ?? first.scheduledAt?.toMillis() ?? 0;

      const secondTime =
        second.completedAt?.toMillis() ?? second.scheduledAt?.toMillis() ?? 0;

      return secondTime - firstTime;
    })
    .slice(0, 5);

  const personIds = new Set<string>();

  activities.forEach((activity) => {
    if (activity.personId) {
      personIds.add(activity.personId);
    }
  });

  counselorCases.forEach((helpCase) => {
    if (helpCase.personId) {
      personIds.add(helpCase.personId);
    }
  });

  return {
    peopleCount: personIds.size,
    activeCasesCount: activeCases.length,
    plannedActivitiesCount: plannedActivities.length,
    overdueActivitiesCount,
    plannedActivities: plannedActivities.slice(0, 5),
    recentCompletedActivities,
    activeCases: activeCases.slice(0, 5),
  };
}
