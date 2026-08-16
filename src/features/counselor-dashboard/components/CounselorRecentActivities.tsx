//src/features/counselor-dashboard/components/CounselorActivities.tsx

import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ACTIVITY_TYPE_LABELS, type Activity } from "@/features/activities";

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

export function CounselorRecentActivities({ activities }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Dernières activités réalisées</Text>

        <Text style={styles.count}>{activities.length}</Text>
      </View>

      {activities.length === 0 ? (
        <Text style={styles.empty}>Aucune activité réalisée récemment.</Text>
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
            <View style={styles.statusIcon}>
              <Text style={styles.statusIconText}>✓</Text>
            </View>

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
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    color: "#475569",
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

  statusIcon: {
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    marginRight: 12,
    width: 36,
  },

  statusIconText: {
    color: "#15803D",
    fontSize: 17,
    fontWeight: "900",
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
    color: "#475569",
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

  pressed: {
    opacity: 0.72,
  },
});
