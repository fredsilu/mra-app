//src/features/people/hooks/usePeople.ts
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { getPeople } from "../person.service";
import type { Person } from "../person.types";

export function usePeople() {
  const { profile } = useAuth();

  const [people, setPeople] = useState<Person[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(
    async (refresh = false) => {
      refresh ? setIsRefreshing(true) : setIsLoading(true);

      try {
        const result = await getPeople();

        const visiblePeople =
          profile?.role === "conseiller"
            ? result.filter((person) =>
                person.counselorIds?.includes(profile.uid),
              )
            : result;

        setPeople(
          visiblePeople.sort((a, b) => a.fullName.localeCompare(b.fullName)),
        );
      } catch (error) {
        console.error("Erreur chargement personnes :", error);

        Alert.alert("Erreur", "Impossible de charger la liste des personnes.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [profile],
  );

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const filteredPeople = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return people;
    }

    return people.filter((person) =>
      [person.fullName, person.phone, person.mraNumber]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(value)),
    );
  }, [people, search]);

  return {
    people: filteredPeople,
    total: filteredPeople.length,
    search,
    setSearch,
    isLoading,
    isRefreshing,
    refresh: () => load(true),
  };
}
