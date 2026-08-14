//src/features/activities/components/ActivitiesStatistics.tsx
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

type Props = {
  today: number;
  overdue: number;
  upcoming: number;
};

export function ActivitiesStatistics({ today, overdue, upcoming }: Props) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  return (
    <View style={[styles.container, isDesktop && styles.containerDesktop]}>
      <SummaryCard label="Aujourd’hui" value={today} compact={isDesktop} />

      <SummaryCard
        label="En retard"
        value={overdue}
        danger
        compact={isDesktop}
      />

      <SummaryCard label="À venir" value={upcoming} compact={isDesktop} />
    </View>
  );
}

function SummaryCard({
  label,
  value,
  danger = false,
  compact = false,
}: {
  label: string;
  value: number;
  danger?: boolean;
  compact?: boolean;
}) {
  const isDanger = danger && value > 0;

  return (
    <View
      style={[
        styles.card,
        compact && styles.cardDesktop,
        isDanger && styles.cardDanger,
      ]}
    >
      <Text
        style={[
          styles.value,
          compact && styles.valueDesktop,
          isDanger && styles.valueDanger,
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  containerDesktop: {
    gap: 8,
    paddingTop: 10,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
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

  cardDanger: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },

  value: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "800",
  },

  valueDesktop: {
    fontSize: 20,
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

  labelDesktop: {
    fontSize: 13,
    marginTop: 0,
  },
});
