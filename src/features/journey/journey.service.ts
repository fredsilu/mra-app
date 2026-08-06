//src/features/journey/journey.service.ts

import { getActivitiesByPerson } from "@/features/activities";
import { getCasesByPersonId } from "@/features/cases/case.service";

import type { JourneyState } from "./journey.types";

export interface PersonJourney {
  state: JourneyState;
  openCaseId?: string;
  firstInterviewId?: string;
}

export async function getPersonJourneyState(
  personId: string,
): Promise<PersonJourney> {
  const normalizedPersonId = personId.trim();

  if (!normalizedPersonId) {
    return {
      state: "READY_FOR_FIRST_INTERVIEW",
    };
  }

  const [activities, cases] = await Promise.all([
    getActivitiesByPerson(normalizedPersonId),
    getCasesByPersonId(normalizedPersonId),
  ]);

  const openCase = cases.find((item) => item.status === "active");

  if (openCase) {
    return {
      state: "CASE_OPEN",
      openCaseId: openCase.id,
    };
  }

  const firstInterviews = activities
    .filter(
      (activity) =>
        activity.type === "first_interview" && activity.status !== "cancelled",
    )
    .sort((first, second) => {
      const firstTime =
        first.scheduledAt?.toMillis() ?? first.createdAt?.toMillis() ?? 0;

      const secondTime =
        second.scheduledAt?.toMillis() ?? second.createdAt?.toMillis() ?? 0;

      return secondTime - firstTime;
    });

  const latestFirstInterview = firstInterviews[0];

  if (!latestFirstInterview) {
    return {
      state: cases.some((item) => item.status === "closed")
        ? "READY_FOR_NEW_CYCLE"
        : "READY_FOR_FIRST_INTERVIEW",
    };
  }

  if (latestFirstInterview.status === "planned") {
    return {
      state: "FIRST_INTERVIEW_PLANNED",
      firstInterviewId: latestFirstInterview.id,
    };
  }

  const latestClosedCase = cases
    .filter((item) => item.status === "closed")
    .sort(
      (first, second) =>
        second.createdAt.toMillis() - first.createdAt.toMillis(),
    )[0];

  const interviewTime =
    latestFirstInterview.completedAt?.toMillis() ??
    latestFirstInterview.scheduledAt?.toMillis() ??
    latestFirstInterview.createdAt?.toMillis() ??
    0;

  const latestClosedCaseTime =
    latestClosedCase?.closedAt?.toMillis() ??
    latestClosedCase?.createdAt.toMillis() ??
    0;

  if (latestClosedCase && latestClosedCaseTime > interviewTime) {
    return {
      state: "READY_FOR_NEW_CYCLE",
    };
  }

  return {
    state: "WAITING_CASE_DECISION",
    firstInterviewId: latestFirstInterview.id,
  };
}
