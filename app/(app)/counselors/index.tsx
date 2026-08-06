//app/(app)/counselors/index.tsx

// app/(app)/counselors/index.tsx

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
        contentContainerStyle={styles.content}
      >
        <CounselorHeader profile={profile} />

        <CounselorStatistics
          peopleCount={data.peopleCount}
          activeCasesCount={data.activeCasesCount}
          plannedActivitiesCount={data.plannedActivitiesCount}
          overdueActivitiesCount={data.overdueActivitiesCount}
        />

        <View
          style={[
            styles.primaryGrid,
            !isDesktop ? styles.primaryGridMobile : null,
          ]}
        >
          <View style={styles.column}>
            <CounselorActivities activities={data.plannedActivities} />
          </View>

          <View style={styles.column}>
            <CounselorCases cases={data.activeCases} />
          </View>
        </View>

        <View style={styles.recentSection}>
          <CounselorRecentActivities
            activities={data.recentCompletedActivities}
          />
        </View>

        <CounselorLogout isLoggingOut={isLoggingOut} onLogout={handleLogout} />
      </ScrollView>
    </SafeAreaView>
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

  primaryGrid: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 16,
    marginTop: 22,
  },

  primaryGridMobile: {
    flexDirection: "column",
  },

  column: {
    flex: 1,
    width: "100%",
  },

  recentSection: {
    marginTop: 16,
  },
});
