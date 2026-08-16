//src/features/counselor-dashboard/components/CounselorActivities.tsx

import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ACTIVITY_TYPE_LABELS, type Activity } from "@/features/activities";

type Props = {
  activities: Activity[];
};

function formatDate(activity: Activity): string {
  if (!activity.scheduledAt) {
    return "Date non renseignée";
  }

  return activity.scheduledAt.toDate().toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function CounselorActivities({ activities }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes rendez-vous</Text>

        <Text style={styles.count}>{activities.length}</Text>
      </View>

      {activities.length === 0 ? (
        <Text style={styles.empty}>Aucune activité planifiée.</Text>
      ) : (
        activities.map((activity) => (
          <Pressable
            key={activity.id}
            onPress={() =>
              router.push({
                pathname: "/activities/[id]",
                params: {
                  id: activity.id,
                },
              })
            }
            style={({ pressed }) => [
              styles.item,
              pressed ? styles.pressed : null,
            ]}
          >
            <View style={styles.itemContent}>
              <Text style={styles.person}>{activity.personName}</Text>

              <Text style={styles.type}>
                {ACTIVITY_TYPE_LABELS[activity.type]}
              </Text>

              <Text style={styles.date}>{formatDate(activity)}</Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))
      )}

      <Pressable
        onPress={() => router.push("/activities")}
        style={({ pressed }) => [
          styles.linkButton,
          pressed ? styles.pressed : null,
        ]}
      >
        <Text style={styles.linkText}>Voir toutes les activités</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
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
    color: "#0F172A",
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
    color: "#64748B",
    lineHeight: 21,
    paddingVertical: 12,
  },

  item: {
    alignItems: "center",
    borderTopColor: "#E2E8F0",
    borderTopWidth: 1,
    flexDirection: "row",
    paddingVertical: 14,
  },

  itemContent: {
    flex: 1,
  },

  person: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "800",
  },

  type: {
    color: "#7C3AED",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  date: {
    color: "#64748B",
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
