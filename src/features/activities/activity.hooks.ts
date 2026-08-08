//src/features/activities/activity.hooks.ts
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";

import {
  getActivitiesByCase,
  getActivitiesByCounselor,
  getAllActivities,
  getPlannedActivities,
} from "./activity.service";
import type { Activity } from "./activity.types";

interface UseActivitiesResult {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

function useActivityLoader(
  loader: () => Promise<Activity[]>,
  dependencies: readonly unknown[],
): UseActivitiesResult {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await loader();

      setActivities(result);
    } catch (caughtError) {
      console.error("Erreur chargement activités :", caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Impossible de charger les activités.",
      );
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    activities,
    loading,
    error,
    refresh,
  };
}

export function useAllActivities(): UseActivitiesResult {
  const { profile } = useAuth();

  return useActivityLoader(async () => {
    if (!profile) {
      return [];
    }

    if (profile.role === "conseiller") {
      return getActivitiesByCounselor(profile.uid);
    }

    return getAllActivities();
  }, [profile]);
}

export function useCounselorActivities(
  counselorId: string | null | undefined,
): UseActivitiesResult {
  return useActivityLoader(
    async () => (counselorId ? getActivitiesByCounselor(counselorId) : []),
    [counselorId],
  );
}

export function useCaseActivities(
  caseId: string | null | undefined,
): UseActivitiesResult {
  return useActivityLoader(
    async () => (caseId ? getActivitiesByCase(caseId) : []),
    [caseId],
  );
}

export function usePlannedActivities(): UseActivitiesResult {
  return useActivityLoader(() => getPlannedActivities(), []);
}
