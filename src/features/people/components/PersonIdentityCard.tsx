//src/features/people/components/PersonIdentityCard.tsx
import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";
import type { Person } from "@/features/people/person.types";

import {
  churchStatusOptions,
  contactChannelOptions,
  genderOptions,
  maritalStatusOptions,
  originOptions,
} from "../constants/person.options";

type Props = {
  person: Person;
};

function getOptionLabel<T extends string>(
  value: T | undefined,
  options: Array<{
    label: string;
    value: T;
  }>,
): string | undefined {
  if (!value) {
    return undefined;
  }

  return options.find((option) => option.value === value)?.label;
}

export function PersonIdentityCard({ person }: Props) {
  const genderLabel = getOptionLabel(person.gender, genderOptions);

  const maritalStatusLabel = getOptionLabel(
    person.maritalStatus,
    maritalStatusOptions,
  );

  const churchStatusLabel = getOptionLabel(
    person.churchStatus,
    churchStatusOptions,
  );

  const originLabel = getOptionLabel(person.origin, originOptions);

  const contactChannelLabel = getOptionLabel(
    person.contactChannel,
    contactChannelOptions,
  );

  return (
    <View style={styles.stack}>
      <View style={styles.card}>
        <Text style={styles.title}>Identité</Text>

        <Info label="Nom complet" value={person.fullName} />

        <Info label="Sexe" value={genderLabel} />

        <Info label="État civil" value={maritalStatusLabel} />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Vie dans l’Église</Text>

        <Info label="Statut à l’église" value={churchStatusLabel} />

        <Info label="Ministère / Département" value={person.ministry} />

        <Info label="Fonction dans le ministère" value={person.ministryRole} />

        <Info label="Famille / Groupe" value={person.family} />

        <Info label="À l’église depuis" value={person.churchSince} />

        <Info label="Origine" value={originLabel} />

        <Info label="Canal de contact" value={contactChannelLabel} />
      </View>
    </View>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      <Text style={styles.value}>{value?.trim() || "Non renseigné"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 16,
  },

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
