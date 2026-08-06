// app/(app)/dashboard.tsx

import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { WebDashboard } from "@/features/dashboard";
import { COLORS } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import {
  getDashboardMetrics,
  type DashboardMetrics,
} from "@/features/dashboard";
import type { UserRole } from "@/features/users/user.types";
import {
  canManageAgenda,
  canManageUsers,
  hasGlobalAccess,
} from "@/permissions";
import { MobileDashboard } from "@/features/dashboard/components/MobileDashboard";

const roleLabels: Record<UserRole, string> = {
  responsable: "Responsable",
  adjoint: "Responsable adjoint",
  secretaire: "Secrétaire",
  conseiller: "Conseiller",
};

const emptyMetrics: DashboardMetrics = {
  peopleCount: 0,
  plannedFirstInterviews: 0,
  plannedActivities: 0,
  overdueActivities: 0,
  openCases: 0,
  closedCases: 0,
};

export default function DashboardScreen() {
  const { user, profile, logout } = useAuth();

  const [metrics, setMetrics] = useState<DashboardMetrics>(emptyMetrics);

  const [isLoading, setIsLoading] = useState(true);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { width } = useWindowDimensions();

  const isDesktop = Platform.OS === "web" && width >= 1024;

  const loadDashboard = useCallback(async () => {
    if (!profile) {
      setMetrics(emptyMetrics);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const result = await getDashboardMetrics(profile);

      setMetrics(result);
    } catch (error) {
      console.error("Erreur lors du chargement du tableau de bord :", error);

      Alert.alert("Erreur", "Impossible de charger le tableau de bord.");
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  useFocusEffect(
    useCallback(() => {
      void loadDashboard();
    }, [loadDashboard]),
  );

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);

      await logout();

      router.replace("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);

      Alert.alert(
        "Déconnexion impossible",
        "Une erreur est survenue pendant la déconnexion.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  const roleTitle = profile ? roleLabels[profile.role] : "Profil non configuré";

  const globalAccess = hasGlobalAccess(profile);

  const agendaAccess = canManageAgenda(profile);

  if (isDesktop && profile && !isLoading) {
    return (
      <WebDashboard
        profile={profile}
        metrics={metrics}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
      />
    );
  }

  if (!isDesktop && profile && !isLoading) {
    return (
      <MobileDashboard
        profile={profile}
        metrics={metrics}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Tableau de bord</Text>

          <Text style={styles.welcome}>
            Bonjour, {profile?.displayName || user?.email}
          </Text>

          <Text style={styles.role}>{roleTitle}</Text>
        </View>

        <AppButton
          title={isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
          disabled={isLoggingOut}
          onPress={handleLogout}
        />
      </View>

      {!profile ? (
        <View style={styles.warning}>
          <Text style={styles.warningText}>
            Aucun profil MRA n’a été trouvé dans Firestore.
          </Text>
        </View>
      ) : null}

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />

          <Text style={styles.loadingText}>Chargement des indicateurs...</Text>
        </View>
      ) : (
        <>
          <View style={styles.metricsGrid}>
            <MetricCard
              label={
                profile?.role === "conseiller"
                  ? "Personnes suivies"
                  : "Personnes"
              }
              value={metrics.peopleCount}
              onPress={() => router.push("/people")}
            />

            <MetricCard
              label="Premiers entretiens"
              value={metrics.plannedFirstInterviews}
              detail="À réaliser"
              onPress={() => router.push("/activities")}
            />

            <MetricCard
              label="Dossiers ouverts"
              value={metrics.openCases}
              onPress={() => router.push("/cases")}
            />

            <MetricCard
              label="Activités planifiées"
              value={metrics.plannedActivities}
              onPress={() => router.push("/activities")}
            />

            <MetricCard
              label="Activités en retard"
              value={metrics.overdueActivities}
              detail={
                metrics.overdueActivities > 0
                  ? "Attention requise"
                  : "Aucun retard"
              }
              alert={metrics.overdueActivities > 0}
              onPress={() => router.push("/activities")}
            />

            <MetricCard
              label="Dossiers clôturés"
              value={metrics.closedCases}
              onPress={() => router.push("/cases")}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Accès rapide</Text>

            <View style={styles.quickGrid}>
              <QuickAction
                title="Personnes"
                description="Consulter les personnes enregistrées"
                onPress={() => router.push("/people")}
              />

              <QuickAction
                title="Activités"
                description="Entretiens, appels, visites et autres activités"
                onPress={() => router.push("/activities")}
              />

              <QuickAction
                title="Dossiers"
                description="Consulter les accompagnements"
                onPress={() => router.push("/cases")}
              />

              {agendaAccess ? (
                <QuickAction
                  title="Agenda"
                  description="Voir les activités planifiées"
                  onPress={() => router.push("/activities")}
                />
              ) : null}

              {globalAccess ? (
                <QuickAction
                  title="Vue globale"
                  description="Consulter l’activité de toute l’équipe"
                  onPress={() => router.push("/counselors")}
                />
              ) : null}

              {canManageUsers(profile) ? (
                <QuickAction
                  title="Utilisateurs"
                  description="Gérer les accès et les rôles"
                  onPress={() => router.push("/users")}
                />
              ) : null}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function MetricCard({
  label,
  value,
  detail,
  alert = false,
  onPress,
}: {
  label: string;
  value: number;
  detail?: string;
  alert?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.metricCard,
        alert ? styles.metricCardAlert : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text
        style={[styles.metricValue, alert ? styles.metricValueAlert : null]}
      >
        {value}
      </Text>

      <Text style={styles.metricLabel}>{label}</Text>

      {detail ? (
        <Text
          style={[styles.metricDetail, alert ? styles.metricDetailAlert : null]}
        >
          {detail}
        </Text>
      ) : null}
    </Pressable>
  );
}

function QuickAction({
  title,
  description,
  onPress,
}: {
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickCard,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={styles.quickTitle}>{title}</Text>

      <Text style={styles.quickDescription}>{description}</Text>

      <Text style={styles.quickLink}>Ouvrir</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.light,
  },

  content: {
    alignSelf: "center",
    maxWidth: 1200,
    padding: 20,
    paddingBottom: 50,
    width: "100%",
  },

  header: {
    alignItems: Platform.OS === "web" ? "center" : "flex-start",
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: 18,
    justifyContent: "space-between",
    marginBottom: 24,
  },

  headerText: {
    flex: 1,
  },

  title: {
    color: COLORS.text,
    fontSize: Platform.OS === "web" ? 32 : 27,
    fontWeight: "800",
  },

  welcome: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },

  role: {
    color: COLORS.muted,
    marginTop: 4,
  },

  warning: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FDBA74",
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 18,
    padding: 14,
  },

  warningText: {
    color: "#9A3412",
  },

  loading: {
    alignItems: "center",
    gap: 12,
    justifyContent: "center",
    minHeight: 300,
  },

  loadingText: {
    color: COLORS.muted,
  },

  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  metricCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 14,
    borderWidth: 1,
    minWidth: Platform.OS === "web" ? 220 : "47%",
    padding: 18,
    flexGrow: 1,
    flexBasis: Platform.OS === "web" ? 220 : 150,
  },

  metricCardAlert: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },

  metricValue: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "800",
  },

  metricValueAlert: {
    color: "#B91C1C",
  },

  metricLabel: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
  },

  metricDetail: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 5,
  },

  metricDetailAlert: {
    color: "#B91C1C",
  },

  section: {
    marginTop: 32,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 14,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  quickCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 14,
    borderWidth: 1,
    flexGrow: 1,
    flexBasis: Platform.OS === "web" ? 300 : "100%",
    padding: 18,
  },

  quickTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
  },

  quickDescription: {
    color: COLORS.muted,
    lineHeight: 20,
    marginTop: 7,
  },

  quickLink: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 14,
  },

  pressed: {
    opacity: 0.72,
  },
});
