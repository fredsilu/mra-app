// app/(app)/activities/index.tsx
import { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import { isActivityOverdue, useAllActivities } from "@/features/activities";

import { ActivitiesContent } from "@/features/activities/components/ActivitiesContent";
import { ActivitiesHeader } from "@/features/activities/components/ActivitiesHeader";
import { ActivitiesStatistics } from "@/features/activities/components/ActivitiesStatistics";
import {
  ActivitiesToolbar,
  type StatusFilter,
} from "@/features/activities/components/ActivitiesToolbar";

function isSameDay(firstDate: Date, secondDate: Date): boolean {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

export default function ActivitiesScreen() {
  const { activities, loading, error, refresh } = useAllActivities();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const statistics = useMemo(() => {
    const now = new Date();

    const today = activities.filter((activity) => {
      if (!activity.scheduledAt) {
        return false;
      }

      return isSameDay(activity.scheduledAt.toDate(), now);
    }).length;

    const overdue = activities.filter((activity) =>
      isActivityOverdue(activity, now),
    ).length;

    const upcoming = activities.filter((activity) => {
      if (activity.status !== "planned" || !activity.scheduledAt) {
        return false;
      }

      return activity.scheduledAt.toDate().getTime() > now.getTime();
    }).length;

    return {
      today,
      overdue,
      upcoming,
    };
  }, [activities]);

  const filteredActivities = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return activities.filter((activity) => {
      const matchesStatus =
        statusFilter === "all" || activity.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        activity.title.toLowerCase().includes(normalizedSearch) ||
        activity.personName.toLowerCase().includes(normalizedSearch) ||
        activity.counselorName.toLowerCase().includes(normalizedSearch) ||
        activity.description.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [activities, search, statusFilter]);

  return (
    <SafeAreaView style={styles.screen}>
      <ActivitiesHeader count={filteredActivities.length} />

      <ActivitiesStatistics
        today={statistics.today}
        overdue={statistics.overdue}
        upcoming={statistics.upcoming}
      />

      <ActivitiesToolbar
        search={search}
        onSearchChange={setSearch}
        filter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <ActivitiesContent
        activities={filteredActivities}
        loading={loading}
        error={error}
        onRefresh={() => void refresh()}
        emptyMessage={
          search.trim()
            ? "Aucune activité ne correspond à cette recherche."
            : "Aucune activité dans cette catégorie."
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
});
