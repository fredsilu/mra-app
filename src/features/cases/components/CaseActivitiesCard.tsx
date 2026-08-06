import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { COLORS } from "@/constants/theme";
import { ActivityCard, type Activity } from "@/features/activities";
import type { Case } from "@/features/cases/case.types";

type Props = {
  helpCase: Case;
  activities: Activity[];
};

export function CaseActivitiesCard({ helpCase, activities }: Props) {
  const isClosed = helpCase.status === "closed";

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Activités</Text>

          <Text style={styles.subtitle}>{activities.length} activité(s)</Text>
        </View>

        {!isClosed ? (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/activities/new",
                params: {
                  caseId: helpCase.id,
                  personId: helpCase.personId,
                  personName: helpCase.personName,
                },
              })
            }
            style={({ pressed }) => [
              styles.newButton,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.newButtonText}>Nouvelle activité</Text>
          </Pressable>
        ) : null}
      </View>

      {activities.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Aucune activité</Text>

          <Text style={styles.emptyText}>
            Aucune activité n’est encore enregistrée dans ce dossier.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onPress={() =>
                router.push({
                  pathname: "/activities/[id]",
                  params: {
                    id: activity.id,
                  },
                })
              }
            />
          ))}
        </View>
      )}

      <View style={styles.personAction}>
        <AppButton
          title="Voir la personne"
          onPress={() =>
            router.push({
              pathname: "/people/[id]",
              params: {
                id: helpCase.personId,
              },
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },

  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginBottom: 14,
  },

  title: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: "800",
  },

  subtitle: {
    color: COLORS.muted,
    marginTop: 4,
  },

  newButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  newButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  list: {
    gap: 12,
  },

  empty: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 28,
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
  },

  emptyText: {
    color: COLORS.muted,
    lineHeight: 20,
    marginTop: 6,
    textAlign: "center",
  },

  personAction: {
    marginTop: 16,
  },

  pressed: {
    opacity: 0.72,
  },
});
