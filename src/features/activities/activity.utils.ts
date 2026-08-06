import type { Activity } from "./activity.types";

export function isActivityOverdue(
  activity: Activity,
  now: Date = new Date(),
): boolean {
  if (
    activity.status !== "planned" ||
    !activity.scheduledAt
  ) {
    return false;
  }

  return activity.scheduledAt.toDate().getTime() < now.getTime();
}

export function sortActivitiesByScheduledDate(
  activities: Activity[],
  direction: "asc" | "desc" = "asc",
): Activity[] {
  return [...activities].sort((first, second) => {
    const firstTime =
      first.scheduledAt?.toMillis() ?? Number.MAX_SAFE_INTEGER;
    const secondTime =
      second.scheduledAt?.toMillis() ?? Number.MAX_SAFE_INTEGER;

    return direction === "asc"
      ? firstTime - secondTime
      : secondTime - firstTime;
  });
}
