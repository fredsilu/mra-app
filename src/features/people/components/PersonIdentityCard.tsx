import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";
import type { Person } from "@/features/people/person.types";

type Props = {
  person: Person;
};

export function PersonIdentityCard({ person }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Identité</Text>

      <Info label="Nom complet" value={person.fullName} />
      <Info label="Sexe" value={person.gender} />
      <Info label="Statut à l’église" value={person.churchStatus} />
      <Info label="Origine" value={person.origin} />
      <Info label="Canal de contact" value={person.contactChannel} />
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
    gap: 14,
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
