import { StyleSheet, Text, View } from "react-native";

import type { UserProfile } from "@/features/users/user.types";

type Props = {
  profile: UserProfile;
};

export function CounselorHeader({ profile }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>ESPACE CONSEILLER</Text>

      <Text style={styles.title}>Bonjour, {profile.displayName}</Text>

      <Text style={styles.subtitle}>
        Consultez vos rendez-vous, vos dossiers et vos dernières activités.
      </Text>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>Conseiller</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  eyebrow: {
    color: "#7C3AED",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.1,
  },

  title: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 10,
  },

  subtitle: {
    color: "#64748B",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 7,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#EDE9FE",
    borderRadius: 999,
    marginTop: 14,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },

  badgeText: {
    color: "#7C3AED",
    fontSize: 13,
    fontWeight: "800",
  },
});
