// src/features/dashboard/components/WebDashboard.tsx

import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { COLORS } from "@/constants/theme";
import type { DashboardMetrics } from "@/features/dashboard/dashboard.types";
import type { UserProfile, UserRole } from "@/features/users/user.types";
import {
  canManageAgenda,
  canManageUsers,
  hasGlobalAccess,
} from "@/permissions";

type Props = {
  profile: UserProfile;
  metrics: DashboardMetrics;
  isLoggingOut: boolean;
  onLogout: () => void;
};

type MetricCardProps = {
  icon: string;
  label: string;
  value: number;
  detail?: string;
  accentColor: string;
  iconBackgroundColor: string;
  onPress: () => void;
};

const roleLabels: Record<UserRole, string> = {
  responsable: "Responsable",
  adjoint: "Responsable adjoint",
  secretaire: "Secrétaire",
  conseiller: "Conseiller",
};

function getInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "MRA";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function WebDashboard({
  profile,
  metrics,
  isLoggingOut,
  onLogout,
}: Props) {
  const globalAccess = hasGlobalAccess(profile);
  const agendaAccess = canManageAgenda(profile);

  return (
    <View style={styles.screen}>
      <View style={styles.sidebar}>
        <ScrollView
          style={styles.sidebarTop}
          contentContainerStyle={styles.sidebarTopContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brand}>
            <Text style={styles.logo}>MRA</Text>
            <Text style={styles.logoSubtitle}>Relation d’aide</Text>
          </View>

          <View style={styles.navigation}>
            <NavigationButton
              icon="⌂"
              title="Tableau de bord"
              active
              onPress={() => router.push("/dashboard")}
            />

            <NavigationButton
              icon="♙"
              title="Personnes"
              onPress={() => router.push("/people")}
            />

            <NavigationButton
              icon="▣"
              title="Activités"
              onPress={() => router.push("/activities")}
            />

            <NavigationButton
              icon="▱"
              title="Dossiers"
              onPress={() => router.push("/cases")}
            />

            {agendaAccess ? (
              <NavigationButton
                icon="□"
                title="Agenda"
                onPress={() => router.push("/activities")}
              />
            ) : null}

            {globalAccess ? (
              <NavigationButton
                icon="♙"
                title="Conseillers"
                onPress={() => router.push("/counselors")}
              />
            ) : null}

            {canManageUsers(profile) ? (
              <NavigationButton
                icon="◇"
                title="Utilisateurs"
                onPress={() => router.push("/users")}
              />
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.sidebarBottom}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(profile.displayName)}
              </Text>
            </View>

            <View style={styles.profileText}>
              <Text numberOfLines={1} style={styles.sidebarName}>
                {profile.displayName}
              </Text>

              <Text style={styles.sidebarRole}>{roleLabels[profile.role]}</Text>
            </View>
          </View>

          <AppButton
            title={isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
            disabled={isLoggingOut}
            onPress={onLogout}
          />
        </View>
      </View>

      <ScrollView style={styles.main} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Tableau de bord</Text>

            <Text style={styles.welcome}>
              Bonjour,{" "}
              <Text style={styles.welcomeName}>{profile.displayName}</Text>
            </Text>

            <Text style={styles.subtitle}>
              Voici la situation actuelle du ministère de relation d’aide.
            </Text>
          </View>

          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeIcon}>◇</Text>

            <Text style={styles.roleBadgeText}>{roleLabels[profile.role]}</Text>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard
            icon="♙"
            label={
              profile.role === "conseiller"
                ? "Personnes suivies"
                : "Personnes enregistrées"
            }
            value={metrics.peopleCount}
            accentColor="#2563EB"
            iconBackgroundColor="#DBEAFE"
            onPress={() => router.push("/people")}
          />

          <MetricCard
            icon="♙"
            label="Premiers entretiens"
            value={metrics.plannedFirstInterviews}
            detail="À réaliser"
            accentColor="#7C3AED"
            iconBackgroundColor="#EDE9FE"
            onPress={() => router.push("/activities")}
          />

          <MetricCard
            icon="▱"
            label="Dossiers ouverts"
            value={metrics.openCases}
            accentColor="#16A34A"
            iconBackgroundColor="#DCFCE7"
            onPress={() => router.push("/cases")}
          />

          <MetricCard
            icon="□"
            label="Activités planifiées"
            value={metrics.plannedActivities}
            accentColor="#F97316"
            iconBackgroundColor="#FFEDD5"
            onPress={() => router.push("/activities")}
          />

          <MetricCard
            icon="!"
            label="Activités en retard"
            value={metrics.overdueActivities}
            detail={
              metrics.overdueActivities > 0
                ? "Attention requise"
                : "Aucun retard"
            }
            accentColor="#DC2626"
            iconBackgroundColor="#FEE2E2"
            onPress={() => router.push("/activities")}
          />

          <MetricCard
            icon="✓"
            label="Dossiers clôturés"
            value={metrics.closedCases}
            accentColor="#64748B"
            iconBackgroundColor="#E2E8F0"
            onPress={() => router.push("/cases")}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accès rapide</Text>

          <View style={styles.quickGrid}>
            <QuickAction
              icon="♙"
              title="Personnes"
              description="Rechercher, consulter et enregistrer une personne."
              accentColor="#2563EB"
              onPress={() => router.push("/people")}
            />

            <QuickAction
              icon="□"
              title="Activités"
              description="Consulter les entretiens, appels, visites et prières."
              accentColor="#7C3AED"
              onPress={() => router.push("/activities")}
            />

            <QuickAction
              icon="▱"
              title="Dossiers"
              description="Accéder aux accompagnements ouverts ou clôturés."
              accentColor="#16A34A"
              onPress={() => router.push("/cases")}
            />

            {globalAccess ? (
              <QuickAction
                icon="♙"
                title="Conseillers"
                description="Consulter la charge et l’activité de chaque conseiller."
                accentColor="#F97316"
                onPress={() => router.push("/counselors")}
              />
            ) : null}

            {canManageUsers(profile) ? (
              <QuickAction
                icon="◇"
                title="Utilisateurs"
                description="Gérer les comptes, les rôles et les accès."
                accentColor="#64748B"
                onPress={() => router.push("/users")}
              />
            ) : null}
          </View>
        </View>

        {metrics.overdueActivities > 0 ? (
          <View style={styles.alertCard}>
            <View style={styles.alertIcon}>
              <Text style={styles.alertIconText}>!</Text>
            </View>

            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>
                Activités nécessitant votre attention
              </Text>

              <Text style={styles.alertText}>
                {metrics.overdueActivities} activité(s) planifiée(s) sont en
                retard.
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/activities")}
              style={({ pressed }) => [
                styles.alertButton,
                pressed ? styles.pressed : null,
              ]}
            >
              <Text style={styles.alertButtonText}>
                Consulter les activités
              </Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function NavigationButton({
  icon,
  title,
  active = false,
  onPress,
}: {
  icon: string;
  title: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.navigationButton,
        active ? styles.navigationButtonActive : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text
        style={[
          styles.navigationIcon,
          active ? styles.navigationTextActive : null,
        ]}
      >
        {icon}
      </Text>

      <Text
        style={[
          styles.navigationText,
          active ? styles.navigationTextActive : null,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function MetricCard({
  icon,
  label,
  value,
  detail,
  accentColor,
  iconBackgroundColor,
  onPress,
}: MetricCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.metricCard,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.metricHeader}>
        <View
          style={[
            styles.metricIcon,
            {
              backgroundColor: iconBackgroundColor,
            },
          ]}
        >
          <Text
            style={[
              styles.metricIconText,
              {
                color: accentColor,
              },
            ]}
          >
            {icon}
          </Text>
        </View>

        <Text style={styles.metricLabel}>{label}</Text>
      </View>

      <Text
        style={[
          styles.metricValue,
          {
            color: accentColor,
          },
        ]}
      >
        {value}
      </Text>

      {detail ? (
        <Text style={styles.metricDetail}>{detail}</Text>
      ) : (
        <View style={styles.metricDetailPlaceholder} />
      )}

      <Text
        style={[
          styles.metricLink,
          {
            color: accentColor,
          },
        ]}
      >
        Voir les détails →
      </Text>
    </Pressable>
  );
}

function QuickAction({
  icon,
  title,
  description,
  accentColor,
  onPress,
}: {
  icon: string;
  title: string;
  description: string;
  accentColor: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickCard,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View
        style={[
          styles.quickTopBorder,
          {
            backgroundColor: accentColor,
          },
        ]}
      />

      <View style={styles.quickContent}>
        <Text
          style={[
            styles.quickIcon,
            {
              color: accentColor,
            },
          ]}
        >
          {icon}
        </Text>

        <Text style={styles.quickTitle}>{title}</Text>

        <Text style={styles.quickDescription}>{description}</Text>

        <Text
          style={[
            styles.quickLink,
            {
              color: accentColor,
            },
          ]}
        >
          →
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
  },

  sidebar: {
    width: 275,
    minWidth: 275,
    backgroundColor: "#0B1830",
    paddingHorizontal: 18,
    paddingVertical: 28,
  },

  sidebarTop: {
    flex: 1,
    minHeight: 0,
  },
  sidebarTopContent: {
    paddingBottom: 24,
  },

  brand: {
    paddingHorizontal: 8,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 1,
  },

  logoSubtitle: {
    color: "#93B4DF",
    fontSize: 15,
    marginTop: 6,
  },

  navigation: {
    gap: 6,
    marginTop: 32,
  },

  navigationButton: {
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  navigationButtonActive: {
    backgroundColor: "#2F67ED",
  },

  navigationIcon: {
    width: 24,
    color: "#C8D8EE",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  navigationText: {
    color: "#F1F5F9",
    fontSize: 16,
    fontWeight: "700",
  },

  navigationTextActive: {
    color: "#FFFFFF",
  },

  sidebarBottom: {
    flexShrink: 0,
    gap: 14,
    paddingTop: 14,
  },

  profileCard: {
    minHeight: 104,
    borderTopWidth: 1,
    borderTopColor: "#253652",
    borderBottomWidth: 1,
    borderBottomColor: "#253652",
    paddingHorizontal: 10,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#2F67ED",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  profileText: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },

  sidebarName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  sidebarRole: {
    color: "#93B4DF",
    fontSize: 13,
    marginTop: 7,
  },

  main: {
    flex: 1,
  },

  content: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 1450,
    paddingHorizontal: 36,
    paddingVertical: 34,
    paddingBottom: 60,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 30,
  },

  headerText: {
    flex: 1,
  },

  title: {
    color: "#14213D",
    fontSize: 34,
    fontWeight: "900",
  },

  welcome: {
    color: "#14213D",
    fontSize: 19,
    fontWeight: "800",
    marginTop: 18,
  },

  welcomeName: {
    color: "#2563EB",
  },

  subtitle: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 8,
  },

  roleBadge: {
    minHeight: 48,
    backgroundColor: "#E8EEFF",
    borderRadius: 12,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  roleBadgeIcon: {
    color: "#2563EB",
    fontSize: 18,
    fontWeight: "900",
  },

  roleBadgeText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "800",
  },

  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
  },

  metricCard: {
    flexBasis: 310,
    flexGrow: 1,
    minHeight: 235,
    backgroundColor: "#FFFFFF",
    borderColor: "#DCE3EC",
    borderWidth: 1,
    borderRadius: 16,
    padding: 22,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  metricIcon: {
    width: 54,
    height: 54,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  metricIconText: {
    fontSize: 27,
    fontWeight: "900",
  },

  metricLabel: {
    flex: 1,
    color: "#14213D",
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
  },

  metricValue: {
    fontSize: 39,
    fontWeight: "900",
    marginTop: 20,
    textAlign: "center",
  },

  metricDetail: {
    minHeight: 19,
    color: "#64748B",
    fontSize: 13,
    marginTop: 5,
    textAlign: "center",
  },

  metricDetailPlaceholder: {
    minHeight: 24,
  },

  metricLink: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 20,
    textAlign: "center",
  },

  section: {
    marginTop: 38,
  },

  sectionTitle: {
    color: "#14213D",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 18,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
  },

  quickCard: {
    flexBasis: 210,
    flexGrow: 1,
    minHeight: 270,
    backgroundColor: "#FFFFFF",
    borderColor: "#DCE3EC",
    borderWidth: 1,
    borderRadius: 15,
    overflow: "hidden",
  },

  quickTopBorder: {
    height: 5,
    width: "100%",
  },

  quickContent: {
    flex: 1,
    padding: 22,
  },

  quickIcon: {
    fontSize: 39,
    fontWeight: "800",
  },

  quickTitle: {
    color: "#14213D",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 18,
  },

  quickDescription: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
  },

  quickLink: {
    fontSize: 23,
    fontWeight: "900",
    marginTop: "auto",
    paddingTop: 18,
  },

  alertCard: {
    minHeight: 105,
    backgroundColor: "#FFF1F2",
    borderColor: "#FECACA",
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 32,
    paddingHorizontal: 22,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  alertIcon: {
    width: 42,
    height: 42,
    borderWidth: 2,
    borderColor: "#DC2626",
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  alertIconText: {
    color: "#DC2626",
    fontSize: 21,
    fontWeight: "900",
  },

  alertContent: {
    flex: 1,
  },

  alertTitle: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "900",
  },

  alertText: {
    color: "#7F1D1D",
    fontSize: 14,
    marginTop: 6,
  },

  alertButton: {
    minHeight: 48,
    backgroundColor: "#DC2626",
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  alertButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.72,
  },

  cardPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
});
