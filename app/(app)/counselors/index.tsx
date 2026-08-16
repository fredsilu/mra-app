//app/(app)/counselors/index.tsx

import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { COLORS } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import {
  CounselorActivities,
  CounselorCases,
  CounselorHeader,
  CounselorLogout,
  CounselorRecentActivities,
  CounselorStatistics,
  getCounselorDashboardData,
  type CounselorDashboardData,
} from "@/features/counselor-dashboard";

const emptyData: CounselorDashboardData = {
  peopleCount: 0,
  activeCasesCount: 0,
  plannedActivitiesCount: 0,
  overdueActivitiesCount: 0,
  plannedActivities: [],
  recentCompletedActivities: [],
  activeCases: [],
};

export default function CounselorHomeScreen() {
  const { profile, logout } = useAuth();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;

  const [data, setData] = useState<CounselorDashboardData>(emptyData);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const loadData = useCallback(
    async (refreshOnly = false) => {
      const counselorId = profile?.uid?.trim();

      if (!counselorId) {
        setData(emptyData);
        setIsLoading(false);
        return;
      }

      try {
        if (refreshOnly) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const result = await getCounselorDashboardData(counselorId);

        setData(result);
      } catch (error) {
        console.error(
          "Erreur lors du chargement de l’espace conseiller :",
          error,
        );

        Alert.alert(
          "Chargement impossible",
          "Impossible de charger vos activités et vos dossiers.",
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [profile?.uid],
  );

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData]),
  );

  async function handleLogout(): Promise<void> {
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

  if (!profile) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorTitle}>Profil introuvable</Text>

        <Text style={styles.errorText}>
          Votre profil utilisateur MRA n’est pas configuré.
        </Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Chargement de votre espace...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void loadData(true)}
          />
        }
        contentContainerStyle={[
          styles.content,
          !isDesktop && styles.contentMobile,
        ]}
      >
        <View style={[styles.hero, !isDesktop && styles.heroMobile]}>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>MON ESPACE CONSEILLER</Text>

            <Text style={styles.title}>Bonjour, {profile.displayName}</Text>

            <Text style={styles.subtitle}>
              Retrouvez vos personnes suivies, vos rendez-vous, vos dossiers
              actifs et vos dernières activités.
            </Text>
          </View>

          {data.overdueActivitiesCount > 0 ? (
            <View
              style={[styles.alertBadge, !isDesktop && styles.alertBadgeMobile]}
            >
              <Text style={styles.alertBadgeValue}>
                {data.overdueActivitiesCount}
              </Text>

              <Text style={styles.alertBadgeText}>activité(s) en retard</Text>
            </View>
          ) : null}
        </View>

        <CounselorStatistics
          peopleCount={data.peopleCount}
          activeCasesCount={data.activeCasesCount}
          plannedActivitiesCount={data.plannedActivitiesCount}
          overdueActivitiesCount={data.overdueActivitiesCount}
        />

        <View
          style={[styles.primaryGrid, !isDesktop && styles.primaryGridMobile]}
        >
          <View style={[styles.mainColumn, !isDesktop && styles.mobileColumn]}>
            <CounselorActivities activities={data.plannedActivities} />
          </View>

          <View style={[styles.sideColumn, !isDesktop && styles.mobileColumn]}>
            <CounselorCases cases={data.activeCases} />
          </View>
        </View>

        <View
          style={[
            styles.recentSection,
            !isDesktop && styles.recentSectionMobile,
          ]}
        >
          <CounselorRecentActivities
            activities={data.recentCompletedActivities}
          />
        </View>

        <View style={styles.logoutSection}>
          <CounselorLogout
            isLoggingOut={isLoggingOut}
            onLogout={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  content: {
    alignSelf: "center",
    maxWidth: 1180,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 50,
    width: "100%",
  },

  hero: {
    alignItems: "flex-start",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 22,
  },

  heroCopy: {
    flex: 1,
  },

  eyebrow: {
    color: "#9A6B13",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 6,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 720,
  },

  alertBadge: {
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderRadius: 14,
    borderWidth: 1,
    minWidth: 120,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  alertBadgeValue: {
    color: "#B91C1C",
    fontSize: 24,
    fontWeight: "900",
  },

  alertBadgeText: {
    color: "#991B1B",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
    textAlign: "center",
  },

  primaryGrid: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 18,
    marginTop: 22,
  },

  primaryGridMobile: {
    flexDirection: "column",
    gap: 10,
    marginTop: 14,
  },

  mainColumn: {
    flex: 1.45,
    width: "100%",
  },

  sideColumn: {
    flex: 1,
    width: "100%",
  },

  recentSection: {
    marginTop: 18,
  },
  recentSectionMobile: {
    marginTop: 10,
  },

  logoutSection: {
    marginTop: 24,
  },

  center: {
    alignItems: "center",
    backgroundColor: COLORS.light,
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  loadingText: {
    color: COLORS.muted,
    marginTop: 12,
  },

  errorTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
  },

  errorText: {
    color: COLORS.muted,
    lineHeight: 21,
    marginTop: 8,
    textAlign: "center",
  },
  mobileColumn: {
    flexBasis: "auto",
    flexGrow: 0,
    flexShrink: 0,
    width: "100%",
  },
  heroMobile: {
    flexDirection: "column",
    gap: 12,
    padding: 16,
  },
  alertBadgeMobile: {
    alignSelf: "flex-start",
    minWidth: 0,
  },
  contentMobile: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 36,
  },
});
