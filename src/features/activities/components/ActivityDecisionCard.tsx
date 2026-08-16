// src/features/activities/components/ActivityDecisionCard.tsx

import { router } from "expo-router";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { COLORS } from "@/constants/theme";
import type { Activity } from "@/features/activities";

type Props = {
  activity: Activity;
  onCloseWithoutCase: () => void;
};

export function ActivityDecisionCard({ activity, onCloseWithoutCase }: Props) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const canDecide =
    activity.status === "completed" &&
    activity.type === "first_interview" &&
    !activity.caseId;

  if (!canDecide) {
    return null;
  }

  return (
    <View style={[styles.card, !isDesktop && styles.cardMobile]}>
      <Text style={styles.title}>Décision après entretien</Text>

      <Text style={styles.text}>
        Décidez si cette personne doit entrer dans un parcours d’accompagnement.
      </Text>

      <View style={[styles.actions, isDesktop && styles.actionsDesktop]}>
        <View
          style={[styles.actionItem, isDesktop && styles.actionItemDesktop]}
        >
          <AppButton
            title="Ouvrir le dossier"
            compact
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
        </View>

        <View
          style={[styles.actionItem, isDesktop && styles.actionItemDesktop]}
        >
          <AppButton
            title="Clôturer sans dossier"
            secondary
            compact
            onPress={onCloseWithoutCase}
          />
        </View>
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
    marginTop: 0,
    padding: 18,
    width: "100%",
  },

  cardMobile: {
    padding: 14,
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
    gap: 10,
    width: "100%",
  },

  actionsDesktop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  actionItem: {
    width: "100%",
  },

  actionItemDesktop: {
    width: "auto",
  },
});
