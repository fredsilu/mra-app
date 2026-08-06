import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";
import type { Activity } from "@/features/activities";

type Props = {
  activity: Activity;
};

function formatDate(activity: Activity): string {
  if (!activity.scheduledAt) {
    return "Date non renseignée";
  }

  return activity.scheduledAt.toDate().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(activity: Activity): string {
  if (!activity.scheduledAt) {
    return "Heure non renseignée";
  }

  return activity.scheduledAt.toDate().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ActivityInformationCard({ activity }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Informations</Text>

      <Info label="Personne" value={activity.personName} />
      <Info label="Conseiller" value={activity.counselorName} />
      <Info label="Date" value={formatDate(activity)} />
      <Info label="Heure" value={formatTime(activity)} />
      <Info label="Description" value={activity.description} />
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
    fontWeight: "600",
    lineHeight: 22,
  },
});
