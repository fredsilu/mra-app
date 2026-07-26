//app/_layout.tsx
// app/_layout.tsx

import {
  router,
  Stack,
  usePathname,
} from 'expo-router';
import { useEffect } from 'react';

import { SessionLoader } from '@/components/common/SessionLoader';
import {
  AuthProvider,
  useAuth,
} from '@/contexts/AuthContext';
import { getHomeRoute } from '@/navigation/roleRoutes';

function RootNavigator() {
  const pathname = usePathname();

  const {
    isAuthenticated,
    hasAccess,
    isLoading,
    profile,
  } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const isOnWelcomeScreen = pathname === '/';
    const isOnLoginScreen = pathname === '/login';
    const isOnAccessDeniedScreen =
      pathname === '/access-denied';

    // Utilisateur non connecté
    if (!isAuthenticated) {
      const isPublicRoute =
        isOnWelcomeScreen || isOnLoginScreen;

      if (!isPublicRoute) {
        router.replace('/login');
      }

      return;
    }

    // Utilisateur connecté, mais sans accès MRA
    if (!hasAccess) {
      if (!isOnAccessDeniedScreen) {
        router.replace('/access-denied');
      }

      return;
    }

    // Utilisateur connecté et autorisé
    if (
      isOnWelcomeScreen ||
      isOnLoginScreen ||
      isOnAccessDeniedScreen
    ) {
      router.replace(getHomeRoute(profile));
    }
  }, [
    isAuthenticated,
    hasAccess,
    isLoading,
    profile,
    pathname,
  ]);

  if (isLoading) {
    return <SessionLoader />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}