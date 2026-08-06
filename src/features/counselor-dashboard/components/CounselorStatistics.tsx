import { StyleSheet, Text, View } from "react-native";

type Props = {
  peopleCount: number;
  activeCasesCount: number;
  plannedActivitiesCount: number;
  overdueActivitiesCount: number;
};

export function CounselorStatistics({
  peopleCount,
  activeCasesCount,
  plannedActivitiesCount,
  overdueActivitiesCount,
}: Props) {
  return (
    <View style={styles.grid}>
      <StatCard
        label="Personnes"
        value={peopleCount}
        backgroundColor="#EFF6FF"
        valueColor="#2563EB"
      />

      <StatCard
        label="Dossiers actifs"
        value={activeCasesCount}
        backgroundColor="#F0FDF4"
        valueColor="#15803D"
      />

      <StatCard
        label="Rendez-vous"
        value={plannedActivitiesCount}
        backgroundColor="#F5F3FF"
        valueColor="#7C3AED"
      />

      <StatCard
        label="En retard"
        value={overdueActivitiesCount}
        backgroundColor="#FEF2F2"
        valueColor="#B91C1C"
      />
    </View>
  );
}

function StatCard({
  label,
  value,
  backgroundColor,
  valueColor,
}: {
  label: string;
  value: number;
  backgroundColor: string;
  valueColor: string;
}) {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>

      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  card: {
    borderRadius: 16,
    flexBasis: 150,
    flexGrow: 1,
    padding: 18,
  },

  value: {
    fontSize: 30,
    fontWeight: "900",
  },

  label: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 7,
  },
});
