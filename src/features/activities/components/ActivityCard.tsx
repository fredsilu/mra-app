import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  ACTIVITY_TYPE_LABELS,
} from "../activity.constants";
import type { Activity } from "../activity.types";
import { isActivityOverdue } from "../activity.utils";
import { ActivityStatusBadge } from "./ActivityStatusBadge";

interface ActivityCardProps {
  activity: Activity;
  onPress?: (activity: Activity) => void;
}

function formatActivityDate(activity: Activity): string {
  if (!activity.scheduledAt) {
    return "Date non définie";
  }

  return activity.scheduledAt.toDate().toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function ActivityCard({
  activity,
  onPress,
}: ActivityCardProps) {
  const overdue = isActivityOverdue(activity);

  return (
    <Pressable
      disabled={!onPress}
      onPress={() => onPress?.(activity)}
      style={({ pressed }) => [
        styles.container,
        pressed && onPress ? styles.pressed : null,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.heading}>
          <Text style={styles.type}>
            {ACTIVITY_TYPE_LABELS[activity.type]}
          </Text>

          <Text numberOfLines={1} style={styles.title}>
            {activity.title}
          </Text>
        </View>

        <ActivityStatusBadge
          overdue={overdue}
          status={activity.status}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.person}>
          {activity.personName}
        </Text>

        <Text style={styles.meta}>
          {formatActivityDate(activity)}
        </Text>

        <Text style={styles.meta}>
          Conseiller : {activity.counselorName}
        </Text>

        {activity.description ? (
          <Text numberOfLines={2} style={styles.description}>
            {activity.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  pressed: {
    opacity: 0.75,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  heading: {
    flex: 1,
    gap: 3,
  },
  type: {
    color: "#4F46E5",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "700",
  },
  content: {
    gap: 5,
  },
  person: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "600",
  },
  meta: {
    color: "#6B7280",
    fontSize: 13,
  },
  description: {
    color: "#374151",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
});
