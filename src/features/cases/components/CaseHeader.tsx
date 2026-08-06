import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";
import { CASE_STATUS_LABELS, type Case } from "@/features/cases/case.types";

type Props = {
  helpCase: Case;
};

function formatDate(value?: { toDate: () => Date }): string {
  if (!value) {
    return "Non renseignée";
  }

  return value.toDate().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function CaseHeader({ helpCase }: Props) {
  const isClosed = helpCase.status === "closed";

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Text style={styles.backText}>← Retour</Text>
      </Pressable>

      <Text style={styles.number}>{helpCase.caseNumber}</Text>

      <Text style={styles.person}>{helpCase.personName}</Text>

      <Text style={styles.date}>Ouvert le {formatDate(helpCase.openedAt)}</Text>

      <View style={styles.badges}>
        <View
          style={[
            styles.badge,
            isClosed ? styles.closedBadge : styles.openBadge,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              isClosed ? styles.closedText : styles.openText,
            ]}
          >
            {CASE_STATUS_LABELS[helpCase.status]}
          </Text>
        </View>

        <View style={styles.counselorBadge}>
          <Text style={styles.counselorText}>{helpCase.counselorName}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },

  backText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 15,
  },

  number: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "900",
  },

  person: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
  },

  date: {
    color: COLORS.muted,
    marginTop: 6,
  },

  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },

  badge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  openBadge: {
    backgroundColor: "#DCFCE7",
  },

  closedBadge: {
    backgroundColor: "#FEE2E2",
  },

  badgeText: {
    fontWeight: "800",
  },

  openText: {
    color: "#15803D",
  },

  closedText: {
    color: "#B91C1C",
  },

  counselorBadge: {
    backgroundColor: "#EDE9FE",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  counselorText: {
    color: "#7C3AED",
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.7,
  },
});
