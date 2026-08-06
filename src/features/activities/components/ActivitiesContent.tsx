import { router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ActivityList, type Activity } from "@/features/activities";
import { AppEmptyState } from "@/components/common";

type Props = {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  emptyMessage: string;
};

export function ActivitiesContent({
  activities,
  loading,
  error,
  onRefresh,
  emptyMessage,
}: Props) {
  if (loading && activities.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.message}>Chargement des activités...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>

        <Pressable onPress={onRefresh} style={styles.retryButton}>
          <Text style={styles.retryText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ActivityList
      activities={activities}
      emptyMessage={emptyMessage}
      onActivityPress={(activity) =>
        router.push({
          pathname: "/activities/[id]",
          params: {
            id: activity.id,
          },
        })
      }
      onRefresh={onRefresh}
      refreshing={loading}
      ListEmptyComponent={
        <AppEmptyState
          icon="📅"
          title="Aucune activité"
          message={emptyMessage}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    flex: 1,
    gap: 14,
    justifyContent: "center",
    padding: 24,
  },

  message: {
    color: "#6B7280",
    fontSize: 15,
  },

  error: {
    color: "#B91C1C",
    fontSize: 15,
    textAlign: "center",
  },

  retryButton: {
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
