//src/features/people/components/PersonHeader.tsx
import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

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
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

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

      <View style={[styles.identity, isDesktop && styles.identityDesktop]}>
        <View style={[styles.avatar, isDesktop && styles.avatarDesktop]}>
          <Text
            style={[styles.avatarText, isDesktop && styles.avatarTextDesktop]}
          >
            {getInitials(person.fullName)}
          </Text>
        </View>

        <View
          style={[styles.identityText, isDesktop && styles.identityTextDesktop]}
        >
          <Text style={[styles.name, isDesktop && styles.nameDesktop]}>
            {person.fullName}
          </Text>

          <Text style={[styles.number, isDesktop && styles.numberDesktop]}>
            {person.mraNumber}
          </Text>
        </View>
      </View>

      <View style={[styles.badges, isDesktop && styles.badgesDesktop]}>
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
    marginBottom: 20,
  },

  containerDesktop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 18,
    marginBottom: 16,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 18,
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
    alignItems: "center",
  },

  identityDesktop: {
    flex: 1,
    flexDirection: "row",
    gap: 14,
  },

  avatar: {
    alignItems: "center",
    backgroundColor: "#DBEAFE",
    borderRadius: 42,
    height: 84,
    justifyContent: "center",
    width: 84,
  },

  avatarDesktop: {
    borderRadius: 28,
    height: 56,
    width: 56,
  },

  avatarText: {
    color: "#2563EB",
    fontSize: 30,
    fontWeight: "900",
  },

  avatarTextDesktop: {
    fontSize: 20,
  },

  identityText: {
    alignItems: "center",
  },

  identityTextDesktop: {
    alignItems: "flex-start",
  },

  name: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "900",
    marginTop: 16,
    textAlign: "center",
  },

  nameDesktop: {
    fontSize: 24,
    marginTop: 0,
    textAlign: "left",
  },

  number: {
    color: COLORS.muted,
    fontSize: 15,
    marginTop: 6,
  },

  numberDesktop: {
    fontSize: 13,
    marginTop: 3,
  },

  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginTop: 16,
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

  activeBadge: {
    backgroundColor: "#DCFCE7",
  },

  archivedBadge: {
    backgroundColor: "#F1F5F9",
  },

  badgeText: {
    fontSize: 12,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  churchText: {
    color: "#7C3AED",
    fontSize: 12,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.7,
  },
});
