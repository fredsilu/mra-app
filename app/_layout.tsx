//app/_layout.tsx
// app/_layout.tsx

import { router, Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { SessionLoader } from "@/components/common/SessionLoader";
import { AppNavigationMenu } from "@/components/layout/AppNavigationMenu";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { getHomeRoute } from "@/navigation/roleRoutes";

function RootNavigator() {
  const pathname = usePathname();

  const { isAuthenticated, hasAccess, isLoading, profile } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const isOnWelcomeScreen = pathname === "/";
    const isOnLoginScreen = pathname === "/login";
    const isOnAccessDeniedScreen = pathname === "/access-denied";

    // Utilisateur non connecté
    if (!isAuthenticated) {
      const isPublicRoute = isOnWelcomeScreen || isOnLoginScreen;

      if (!isPublicRoute) {
        router.replace("/login");
      }

      return;
    }

    // Utilisateur connecté, mais sans accès MRA
    if (!hasAccess) {
      if (!isOnAccessDeniedScreen) {
        router.replace("/access-denied");
      }

      return;
    }

    // Utilisateur connecté et autorisé
    if (isOnWelcomeScreen || isOnLoginScreen || isOnAccessDeniedScreen) {
      router.replace(getHomeRoute(profile));
    }
  }, [isAuthenticated, hasAccess, isLoading, profile, pathname]);

  if (isLoading) {
    return <SessionLoader />;
  }

  return (
    <View style={styles.app}>
      {isAuthenticated && hasAccess ? (
        <View style={styles.globalHeader}>
          <View style={styles.brand}>
            <Text style={styles.brandTitle}>MRA</Text>

            <Text style={styles.brandSubtitle}>Relation d’aide</Text>
          </View>

          <AppNavigationMenu />
        </View>
      ) : null}

      <View style={styles.navigator}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  app: {
    backgroundColor: "#F5F7FB",
    flex: 1,
  },

  globalHeader: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E2E8F0",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 100,
  },

  brand: {
    flex: 1,
  },

  brandTitle: {
    color: "#17213B",
    fontSize: 18,
    fontWeight: "900",
  },

  brandSubtitle: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 1,
  },

  navigator: {
    flex: 1,
  },
});
