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
      <View style={styles.card}>
        <Text style={styles.title}>Compte rendu</Text>

        <AppInput
          value={result}
          onChangeText={onResultChange}
          placeholder="Résultat de l’entretien, de l’appel ou de l’activité..."
          multiline
          editable={!isCompleting && !isCancelling}
        />

        <View style={[styles.actions, isDesktop && styles.actionsDesktop]}>
          <AppButton
            title={
              isCompleting ? "Enregistrement..." : "Marquer comme réalisée"
            }
            disabled={isCompleting || isCancelling}
            onPress={onComplete}
            compact
          />

          <AppButton
            title={isCancelling ? "Annulation..." : "Annuler l’activité"}
            disabled={isCompleting || isCancelling}
            onPress={onCancel}
            secondary
            compact
          />
        </View>
      </View>
    );
  }

  if (isCompleted) {
    return (
      <View style={styles.card}>
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
  },

  actions: {
    gap: 10,
  },

  actionsDesktop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
  },

  resultText: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 23,
  },
});
