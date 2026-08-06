import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";
import {
  ACTIVITY_TYPE_LABELS,
  ActivityStatusBadge,
  type Activity,
} from "@/features/activities";

type Props = {
  activity: Activity;
};

function formatDate(activity: Activity) {
  if (!activity.scheduledAt) {
    return "Date non renseignée";
  }

  return activity.scheduledAt.toDate().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function ActivityHeader({ activity }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Text style={styles.backText}>← Retour</Text>
      </Pressable>

      <Text style={styles.title}>{activity.title}</Text>

      <Text style={styles.subtitle}>{ACTIVITY_TYPE_LABELS[activity.type]}</Text>

      <Text style={styles.date}>{formatDate(activity)}</Text>

      <View style={styles.status}>
        <ActivityStatusBadge status={activity.status} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },

  backText: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "700",
  },

  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "900",
  },

  subtitle: {
    color: "#7C3AED",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
  },

  date: {
    color: COLORS.muted,
    marginTop: 6,
  },

  status: {
    marginTop: 18,
    alignSelf: "flex-start",
  },

  pressed: {
    opacity: 0.7,
  },
});
