// src/features/cases/components/CaseHeader.tsx

import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

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
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const isClosed = helpCase.status === "closed";

  return (
    <View style={[styles.container, isDesktop && styles.containerDesktop]}>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.backButton,
          isDesktop && styles.backButtonDesktop,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.backText}>← Retour</Text>
      </Pressable>

      <View style={styles.identity}>
        <Text style={[styles.number, isDesktop && styles.numberDesktop]}>
          {helpCase.caseNumber}
        </Text>

        <Text style={[styles.person, isDesktop && styles.personDesktop]}>
          {helpCase.personName}
        </Text>

        <Text style={styles.date}>
          Ouvert le {formatDate(helpCase.openedAt)}
        </Text>
      </View>

      <View style={[styles.badges, isDesktop && styles.badgesDesktop]}>
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
    marginBottom: 12,
    width: "100%",
  },

  containerDesktop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 18,
    marginBottom: 14,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },

  backButtonDesktop: {
    alignSelf: "center",
    marginBottom: 0,
  },

  backText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "700",
  },

  identity: {
    flex: 1,
  },

  number: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: "900",
  },

  numberDesktop: {
    fontSize: 27,
  },

  person: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },

  personDesktop: {
    fontSize: 19,
  },

  date: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 4,
  },

  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },

  badgesDesktop: {
    flexShrink: 0,
    justifyContent: "flex-end",
    marginTop: 0,
  },

  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  openBadge: {
    backgroundColor: "#DCFCE7",
  },

  closedBadge: {
    backgroundColor: "#FEE2E2",
  },

  badgeText: {
    fontSize: 12,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  counselorText: {
    color: "#7C3AED",
    fontSize: 12,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.7,
  },
});
