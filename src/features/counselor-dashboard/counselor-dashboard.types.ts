import type { Activity } from "@/features/activities";
import type { Case } from "@/features/cases/case.types";

export type CounselorDashboardData = {
  peopleCount: number;
  activeCasesCount: number;
  plannedActivitiesCount: number;
  overdueActivitiesCount: number;

  plannedActivities: Activity[];
  recentCompletedActivities: Activity[];
  activeCases: Case[];
};
