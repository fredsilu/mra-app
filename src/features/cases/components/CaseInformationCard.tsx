import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";
import { CASE_STATUS_LABELS, type Case } from "@/features/cases/case.types";

type Props = {
  helpCase: Case;
};

function formatDate(value?: { toDate: () => Date }): string {
  if (!value) {
    return "Non renseignée";
  }

  try {
    return value.toDate().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Non renseignée";
  }
}

export function CaseInformationCard({ helpCase }: Props) {
  const isClosed = helpCase.status === "closed";

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Informations du dossier</Text>

      <Info label="Personne" value={helpCase.personName} />

      <Info label="Conseiller" value={helpCase.counselorName} />

      <Info label="Statut" value={CASE_STATUS_LABELS[helpCase.status]} />

      <Info label="Ouvert le" value={formatDate(helpCase.openedAt)} />

      {isClosed ? (
        <>
          <Info label="Clôturé le" value={formatDate(helpCase.closedAt)} />

          <Info label="Motif de clôture" value={helpCase.closureReason} />

          <Info
            label="Bilan de l’accompagnement"
            value={helpCase.closureSummary}
          />
        </>
      ) : null}
    </View>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      <Text style={styles.value}>{value || "Non renseigné"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: 15,
    padding: 18,
  },

  title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
  },

  row: {
    gap: 4,
  },

  label: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
  },

  value: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 22,
  },
});
