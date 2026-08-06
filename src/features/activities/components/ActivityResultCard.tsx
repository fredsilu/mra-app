import { StyleSheet, Text, View } from "react-native";

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

        <View style={styles.actions}>
          <AppButton
            title={
              isCompleting ? "Enregistrement..." : "Marquer comme réalisée"
            }
            disabled={isCompleting || isCancelling}
            onPress={onComplete}
          />

          <AppButton
            title={isCancelling ? "Annulation..." : "Annuler l’activité"}
            disabled={isCompleting || isCancelling}
            onPress={onCancel}
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
    marginTop: 24,
    padding: 18,
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

  actions: {
    gap: 12,
  },
});
