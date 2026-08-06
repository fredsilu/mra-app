import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { COLORS } from "@/constants/theme";

type Props = {
  closureReason: string;
  closureSummary: string;
  isClosing: boolean;
  onReasonChange: (value: string) => void;
  onSummaryChange: (value: string) => void;
  onClose: () => void;
};

export function CaseClosureCard({
  closureReason,
  closureSummary,
  isClosing,
  onReasonChange,
  onSummaryChange,
  onClose,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Clôturer le dossier
      </Text>

      <Text style={styles.subtitle}>
        Après clôture, aucune nouvelle activité ne pourra être ajoutée.
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>
          Motif de clôture *
        </Text>

        <AppInput
          value={closureReason}
          onChangeText={onReasonChange}
          placeholder="Motif de clôture"
          multiline
          editable={!isClosing}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
          Bilan de l’accompagnement *
        </Text>

        <AppInput
          value={closureSummary}
          onChangeText={onSummaryChange}
          placeholder="Bilan du dossier"
          multiline
          editable={!isClosing}
        />
      </View>

      <AppButton
        title={
          isClosing
            ? "Clôture..."
            : "Clôturer le dossier"
        }
        disabled={isClosing}
        onPress={onClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FED7AA",
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
    marginTop: 28,
    padding: 18,
  },

  title: {
    color: "#9A3412",
    fontSize: 21,
    fontWeight: "800",
  },

  subtitle: {
    color: "#C2410C",
    lineHeight: 20,
  },

  field: {
    gap: 7,
  },

  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },
});