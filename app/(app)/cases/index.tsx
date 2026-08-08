// app/(app)/cases/index.tsx

import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { COLORS } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { getPeople } from "@/features/people/person.service";
import { CasesHeader } from "@/features/cases/components/CasesHeader";
import { CasesList } from "@/features/cases/components/CasesList";
import { CasesStatistics } from "@/features/cases/components/CasesStatistics";
import {
  CasesToolbar,
  type CaseFilter,
} from "@/features/cases/components/CasesToolbar";
import { getCases } from "@/features/cases/case.service";
import type { Case } from "@/features/cases/case.types";

export default function CasesScreen() {
  const { profile } = useAuth();

  const [cases, setCases] = useState<Case[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CaseFilter>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(
    async (refreshOnly = false) => {
      try {
        if (refreshOnly) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const allCases = await getCases();

        if (profile?.role === "conseiller") {
          const people = await getPeople();

          const accessiblePersonIds = new Set(
            people
              .filter((person) => person.counselorIds?.includes(profile.uid))
              .map((person) => person.id),
          );

          setCases(
            allCases.filter((helpCase) =>
              accessiblePersonIds.has(helpCase.personId),
            ),
          );

          return;
        }

        setCases(allCases);
      } catch (error) {
        console.error("Erreur lors du chargement des dossiers :", error);

        Alert.alert("Erreur", "Impossible de charger les dossiers.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [profile],
  );

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData]),
  );

  const statistics = useMemo(
    () => ({
      total: cases.length,
      active: cases.filter((item) => item.status === "active").length,
      closed: cases.filter((item) => item.status === "closed").length,
    }),
    [cases],
  );

  const filteredCases = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return cases.filter((item) => {
      const matchesFilter = filter === "all" || item.status === filter;

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        item.caseNumber.toLowerCase().includes(normalizedSearch) ||
        item.personName.toLowerCase().includes(normalizedSearch) ||
        item.counselorName.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [cases, filter, search]);

  if (loading && cases.length === 0) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Chargement des dossiers...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <CasesHeader />

        <CasesStatistics
          total={statistics.total}
          active={statistics.active}
          closed={statistics.closed}
        />

        <CasesToolbar
          search={search}
          onSearchChange={setSearch}
          filter={filter}
          onFilterChange={setFilter}
          resultCount={filteredCases.length}
        />

        <CasesList
          cases={filteredCases}
          refreshing={refreshing}
          onRefresh={() => void loadData(true)}
          search={search}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.light,
  },

  content: {
    flex: 1,
    padding: 16,
  },

  loading: {
    alignItems: "center",
    backgroundColor: COLORS.light,
    flex: 1,
    gap: 12,
    justifyContent: "center",
  },

  loadingText: {
    color: COLORS.muted,
  },
});
