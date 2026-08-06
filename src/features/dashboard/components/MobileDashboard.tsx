//src/features/dashboard/components/MobileDashboard.tsx

import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";
import { AppButton } from "@/components/ui/AppButton";
import type { DashboardMetrics } from "@/features/dashboard/dashboard.types";
import type { UserProfile } from "@/features/users/user.types";

type Props = {
  profile: UserProfile;
  metrics: DashboardMetrics;
  isLoggingOut: boolean;
  onLogout: () => void;
};

export function MobileDashboard({
  profile,
  metrics,
  isLoggingOut,
  onLogout,
}: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.hello}>👋 Bonjour</Text>

        <Text style={styles.name}>{profile.displayName}</Text>

        <View style={styles.roleBadge}>
          <Text style={styles.role}>{profile.role.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.section}>Aujourd'hui</Text>

      <View style={styles.grid}>
        <StatCard
          color="#2563EB"
          icon="👥"
          value={metrics.peopleCount}
          title="Personnes"
        />

        <StatCard
          color="#7C3AED"
          icon="📅"
          value={metrics.plannedActivities}
          title="Activités"
        />

        <StatCard
          color="#16A34A"
          icon="📂"
          value={metrics.openCases}
          title="Dossiers"
        />

        <StatCard
          color="#DC2626"
          icon="⚠️"
          value={metrics.overdueActivities}
          title="Retards"
        />
      </View>

      <Text style={styles.section}>Accès rapide</Text>

      <QuickButton
        icon="👥"
        title="Personnes"
        color="#2563EB"
        onPress={() => router.push("/people")}
      />

      <QuickButton
        icon="📅"
        title="Activités"
        color="#7C3AED"
        onPress={() => router.push("/activities")}
      />

      <QuickButton
        icon="📂"
        title="Dossiers"
        color="#16A34A"
        onPress={() => router.push("/cases")}
      />

      <View style={{ height: 25 }} />

      <AppButton
        title={isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
        onPress={onLogout}
      />
    </ScrollView>
  );
}

function StatCard({
  icon,
  value,
  title,
  color,
}: {
  icon: string;
  value: number;
  title: string;
  color: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={[styles.icon, { color }]}>{icon}</Text>

      <Text style={styles.value}>{value}</Text>

      <Text style={styles.label}>{title}</Text>
    </View>
  );
}

function QuickButton({
  icon,
  title,
  color,
  onPress,
}: {
  icon: string;
  title: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.quick}>
      <Text style={[styles.quickIcon, { color }]}>{icon}</Text>

      <Text style={styles.quickTitle}>{title}</Text>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  content: {
    padding: 18,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 28,
  },

  hello: {
    fontSize: 18,
    color: COLORS.muted,
  },

  name: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 4,
  },

  roleBadge: {
    alignSelf: "flex-start",
    marginTop: 12,
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  role: {
    color: "#2563EB",
    fontWeight: "700",
  },

  section: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 14,
    marginTop: 8,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 26,
  },

  card: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
  },

  icon: {
    fontSize: 28,
  },

  value: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 12,
    color: COLORS.text,
  },

  label: {
    marginTop: 6,
    color: COLORS.muted,
    fontWeight: "600",
  },

  quick: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  quickIcon: {
    fontSize: 24,
    width: 36,
  },

  quickTitle: {
    flex: 1,
    marginLeft: 12,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },

  arrow: {
    fontSize: 30,
    color: "#94A3B8",
  },
});
