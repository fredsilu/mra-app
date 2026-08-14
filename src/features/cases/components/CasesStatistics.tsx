//src/features/cases/components/CasesStatistics.tsx
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { COLORS } from "@/constants/theme";

type Props = {
  total: number;
  active: number;
  closed: number;
};

export function CasesStatistics({ total, active, closed }: Props) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  return (
    <View style={[styles.container, isDesktop && styles.containerDesktop]}>
      <SummaryCard label="Total" value={total} compact={isDesktop} />

      <SummaryCard label="Ouverts" value={active} active compact={isDesktop} />

      <SummaryCard label="Clôturés" value={closed} compact={isDesktop} />
    </View>
  );
}

function SummaryCard({
  label,
  value,
  active = false,
  compact = false,
}: {
  label: string;
  value: number;
  active?: boolean;
  compact?: boolean;
}) {
  return (
    <View
      style={[
        styles.card,
        compact && styles.cardDesktop,
        active ? styles.cardActive : null,
      ]}
    >
      <Text
        style={[
          styles.value,
          compact && styles.valueDesktop,
          active ? styles.valueActive : null,
        ]}
      >
        {value}
      </Text>

      <Text style={[styles.label, compact && styles.labelDesktop]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  containerDesktop: {
    gap: 8,
    marginBottom: 10,
  },

  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },

  cardDesktop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    minHeight: 54,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  cardActive: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },

  value: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "800",
  },

  valueDesktop: {
    fontSize: 20,
  },

  valueActive: {
    color: "#15803D",
  },

  label: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
  },

  labelDesktop: {
    fontSize: 13,
    marginTop: 0,
  },
});
