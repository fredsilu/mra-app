//src/features/journey/journey.hooks.ts
import { useCallback, useEffect, useState } from "react";

import { getPersonJourneyState, type PersonJourney } from "./journey.service";

interface UsePersonJourneyResult {
  journey: PersonJourney | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function usePersonJourney(
  personId: string | null | undefined,
): UsePersonJourneyResult {
  const [journey, setJourney] = useState<PersonJourney | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!personId) {
      setJourney(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getPersonJourneyState(personId);

      setJourney(result);
    } catch (caughtError) {
      console.error(
        "Erreur lors du chargement du Journey State :",
        caughtError,
      );

      setJourney(null);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Impossible de charger l’état du parcours.",
      );
    } finally {
      setLoading(false);
    }
  }, [personId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    journey,
    loading,
    error,
    refresh,
  };
}
