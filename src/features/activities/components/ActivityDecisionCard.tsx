import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { COLORS } from "@/constants/theme";
import type { Activity } from "@/features/activities";

type Props = {
  activity: Activity;
  onCloseWithoutCase: () => void;
};

export function ActivityDecisionCard({ activity, onCloseWithoutCase }: Props) {
  const canDecide =
    activity.status === "completed" &&
    activity.type === "first_interview" &&
    !activity.caseId;

  if (!canDecide) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Décision après entretien</Text>

      <Text style={styles.text}>
        Décidez si cette personne doit entrer dans un parcours d’accompagnement.
      </Text>

      <View style={styles.actions}>
        <AppButton
          title="Ouvrir le dossier"
          onPress={() =>
            router.push({
              pathname: "/cases/form",
              params: {
                firstInterviewActivityId: activity.id,
                personId: activity.personId,
                personName: activity.personName,
                counselorId: activity.counselorId,
                counselorName: activity.counselorName,
              },
            })
          }
        />

        <AppButton title="Clôturer sans dossier" onPress={onCloseWithoutCase} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FED7AA",
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    marginTop: 24,
    padding: 18,
  },

  title: {
    color: "#9A3412",
    fontSize: 20,
    fontWeight: "800",
  },

  text: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
  },

  actions: {
    gap: 12,
  },
});
