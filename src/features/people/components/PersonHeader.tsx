import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";
import type { Person } from "@/features/people/person.types";

type Props = {
  person: Person;
};

function getInitials(fullName: string): string {
  return (
    fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((value) => value[0]?.toUpperCase())
      .join("") || "MRA"
  );
}

export function PersonHeader({ person }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.backButton,
          pressed ? styles.pressed : null,
        ]}
      >
        <Text style={styles.backText}>← Retour</Text>
      </Pressable>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(person.fullName)}</Text>
      </View>

      <Text style={styles.name}>{person.fullName}</Text>

      <Text style={styles.number}>{person.mraNumber}</Text>

      <View style={styles.badges}>
        <View
          style={[
            styles.badge,
            person.isArchived ? styles.archivedBadge : styles.activeBadge,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              person.isArchived ? styles.archivedText : styles.activeText,
            ]}
          >
            {person.isArchived ? "Archivée" : "Active"}
          </Text>
        </View>

        <View style={styles.churchBadge}>
          <Text style={styles.churchText}>{person.churchStatus}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 24,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },

  backText: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "700",
  },

  avatar: {
    alignItems: "center",
    backgroundColor: "#DBEAFE",
    borderRadius: 42,
    height: 84,
    justifyContent: "center",
    width: 84,
  },

  avatarText: {
    color: "#2563EB",
    fontSize: 30,
    fontWeight: "900",
  },

  name: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "900",
    marginTop: 16,
    textAlign: "center",
  },

  number: {
    color: COLORS.muted,
    fontSize: 15,
    marginTop: 6,
  },

  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginTop: 16,
  },

  badge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  activeBadge: {
    backgroundColor: "#DCFCE7",
  },

  archivedBadge: {
    backgroundColor: "#F1F5F9",
  },

  badgeText: {
    fontWeight: "800",
  },

  activeText: {
    color: "#15803D",
  },

  archivedText: {
    color: "#64748B",
  },

  churchBadge: {
    backgroundColor: "#EDE9FE",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  churchText: {
    color: "#7C3AED",
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.7,
  },
});
