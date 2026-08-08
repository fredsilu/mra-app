//src/features/cases/components/CasesStatistics.tsx

import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";

type Props = {
  total: number;
  active: number;
  closed: number;
};

export function CasesStatistics({ total, active, closed }: Props) {
  return (
    <View style={styles.container}>
      <SummaryCard label="Total" value={total} />

      <SummaryCard label="Ouverts" value={active} active />

      <SummaryCard label="Clôturés" value={closed} />
    </View>
  );
}

function SummaryCard({
  label,
  value,
  active = false,
}: {
  label: string;
  value: number;
  active?: boolean;
}) {
  return (
    <View style={[styles.card, active ? styles.cardActive : null]}>
      <Text style={[styles.value, active ? styles.valueActive : null]}>
        {value}
      </Text>

      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },

  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    padding: 14,
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

  valueActive: {
    color: "#15803D",
  },

  label: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
  },
});
