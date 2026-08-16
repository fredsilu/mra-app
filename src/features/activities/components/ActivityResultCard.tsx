//src/features/activities/components/ActivityResultCard.tsx

import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { COLORS } from "@/constants/theme";

type Props = {
  result: string;
  completedResult?: string;
  isPlanned: boolean;
  isCompleted: boolean;
  isCompleting: boolean;
  isCancelling: boolean;
  onResultChange: (value: string) => void;
  onComplete: () => void;
  onCancel: () => void;
};

export function ActivityResultCard({
  result,
  completedResult,
  isPlanned,
  isCompleted,
  isCompleting,
  isCancelling,
  onResultChange,
  onComplete,
  onCancel,
}: Props) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  if (isPlanned) {
    return (
      <View style={[styles.card, !isDesktop && styles.cardMobile]}>
        <Text style={styles.title}>Compte rendu</Text>

        <View style={styles.inputContainer}>
          <AppInput
            value={result}
            onChangeText={onResultChange}
            placeholder="Résultat de l’entretien, de l’appel ou de l’activité..."
            multiline
            editable={!isCompleting && !isCancelling}
          />
        </View>

        <View style={[styles.actions, isDesktop && styles.actionsDesktop]}>
          <View
            style={[styles.actionItem, isDesktop && styles.actionItemDesktop]}
          >
            <AppButton
              title={
                isCompleting ? "Enregistrement..." : "Marquer comme réalisée"
              }
              disabled={isCompleting || isCancelling}
              onPress={onComplete}
              compact
            />
          </View>

          <View
            style={[styles.actionItem, isDesktop && styles.actionItemDesktop]}
          >
            <AppButton
              title={isCancelling ? "Annulation..." : "Annuler l’activité"}
              disabled={isCompleting || isCancelling}
              onPress={onCancel}
              secondary
              compact
            />
          </View>
        </View>
      </View>
    );
  }

  if (isCompleted) {
    return (
      <View style={[styles.card, !isDesktop && styles.cardMobile]}>
        <Text style={styles.title}>Compte rendu</Text>

        <Text style={styles.resultText}>
          {completedResult || "Aucun compte rendu renseigné."}
        </Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
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
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
  },

  inputContainer: {
    width: "100%",
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

  resultText: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 23,
  },
});
