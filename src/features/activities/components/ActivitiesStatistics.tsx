import { StyleSheet, Text, View } from "react-native";

type Props = {
  today: number;
  overdue: number;
  upcoming: number;
};

export function ActivitiesStatistics({ today, overdue, upcoming }: Props) {
  return (
    <View style={styles.container}>
      <SummaryCard label="Aujourd’hui" value={today} />

      <SummaryCard label="En retard" value={overdue} danger />

      <SummaryCard label="À venir" value={upcoming} />
    </View>
  );
}

function SummaryCard({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  const isDanger = danger && value > 0;

  return (
    <View style={[styles.card, isDanger ? styles.cardDanger : null]}>
      <Text style={[styles.value, isDanger ? styles.valueDanger : null]}>
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },

  cardDanger: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },

  value: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "800",
  },

  valueDanger: {
    color: "#B91C1C",
  },

  label: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
  },
});
