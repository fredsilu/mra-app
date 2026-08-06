import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ACTIVITY_TYPE_LABELS, type Activity } from "@/features/activities";
import { COLORS } from "@/constants/theme";

type Props = {
  activities: Activity[];
};

function formatDate(activity: Activity): string {
  const value = activity.completedAt ?? activity.scheduledAt;

  if (!value) {
    return "Date non renseignée";
  }

  return value.toDate().toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function PersonActivitiesCard({ activities }: Props) {
  const visibleActivities = activities.slice(0, 5);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Activités</Text>

        <Text style={styles.count}>{activities.length}</Text>
      </View>

      {visibleActivities.length === 0 ? (
        <Text style={styles.empty}>Aucune activité enregistrée.</Text>
      ) : (
        visibleActivities.map((activity) => (
          <Pressable
            key={activity.id}
            onPress={() =>
              router.push({
                pathname: "/activities/[id]",
                params: { id: activity.id },
              })
            }
            style={({ pressed }) => [
              styles.item,
              pressed ? styles.pressed : null,
            ]}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{activity.title}</Text>

              <Text style={styles.itemType}>
                {ACTIVITY_TYPE_LABELS[activity.type]}
              </Text>

              <Text style={styles.itemDate}>{formatDate(activity)}</Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))
      )}

      {activities.length > 5 ? (
        <Pressable
          onPress={() => router.push("/activities")}
          style={({ pressed }) => [
            styles.linkButton,
            pressed ? styles.pressed : null,
          ]}
        >
          <Text style={styles.linkText}>Voir toutes les activités</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },

  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
  },

  count: {
    backgroundColor: "#EDE9FE",
    borderRadius: 999,
    color: "#7C3AED",
    fontWeight: "800",
    minWidth: 32,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: "center",
  },

  empty: {
    color: COLORS.muted,
    lineHeight: 21,
    paddingVertical: 12,
  },

  item: {
    alignItems: "center",
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    flexDirection: "row",
    paddingVertical: 14,
  },

  itemContent: {
    flex: 1,
  },

  itemTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
  },

  itemType: {
    color: "#7C3AED",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  itemDate: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 4,
  },

  arrow: {
    color: "#94A3B8",
    fontSize: 28,
    marginLeft: 12,
  },

  linkButton: {
    alignItems: "center",
    backgroundColor: "#F5F3FF",
    borderRadius: 10,
    marginTop: 14,
    paddingVertical: 12,
  },

  linkText: {
    color: "#7C3AED",
    fontSize: 14,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.72,
  },
});
