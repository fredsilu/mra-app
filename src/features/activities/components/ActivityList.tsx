import type { ReactElement } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import type { Activity } from "../activity.types";
import { ActivityCard } from "./ActivityCard";

interface ActivityListProps {
  activities: Activity[];
  emptyMessage?: string;
  onActivityPress?: (activity: Activity) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  ListEmptyComponent?: ReactElement;
}

export function ActivityList({
  activities,
  emptyMessage = "Aucune activité trouvée.",
  onActivityPress,
  refreshing = false,
  onRefresh,
  ListEmptyComponent,
}: ActivityListProps) {
  return (
    <FlatList
      contentContainerStyle={[
        styles.content,
        activities.length === 0 ? styles.emptyContent : null,
      ]}
      data={activities}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        ListEmptyComponent ?? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        )
      }
      onRefresh={onRefresh}
      refreshing={refreshing}
      renderItem={({ item }) => (
        <ActivityCard activity={item} onPress={onActivityPress} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },

  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  separator: {
    height: 12,
  },

  empty: {
    alignItems: "center",
    padding: 24,
  },

  emptyText: {
    color: "#6B7280",
    fontSize: 15,
    textAlign: "center",
  },
});
