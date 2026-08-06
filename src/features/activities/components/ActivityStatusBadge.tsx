import { StyleSheet, Text, View } from "react-native";

import {
  ACTIVITY_STATUS_LABELS,
} from "../activity.constants";
import type { ActivityStatus } from "../activity.types";

interface ActivityStatusBadgeProps {
  status: ActivityStatus;
  overdue?: boolean;
}

export function ActivityStatusBadge({
  status,
  overdue = false,
}: ActivityStatusBadgeProps) {
  const label = overdue
    ? "En retard"
    : ACTIVITY_STATUS_LABELS[status];

  return (
    <View
      style={[
        styles.badge,
        overdue
          ? styles.overdue
          : status === "completed"
            ? styles.completed
            : status === "cancelled"
              ? styles.cancelled
              : styles.planned,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  planned: {
    backgroundColor: "#2563EB",
  },
  completed: {
    backgroundColor: "#15803D",
  },
  cancelled: {
    backgroundColor: "#6B7280",
  },
  overdue: {
    backgroundColor: "#B91C1C",
  },
});
