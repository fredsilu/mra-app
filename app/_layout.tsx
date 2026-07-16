//app/_layout.tsx
import { router, Stack, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { SessionLoader } from '../src/components/common/SessionLoader';
import {
  AuthProvider,
  useAuth,
} from '../src/contexts/AuthContext';
import { getHomeRoute } from '../src/navigation/roleRoutes';

function RootNavigator() {
  const segments = useSegments();

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

    const currentRoute = segments[0];
    const isOnLoginScreen = currentRoute === 'login';
    const isOnAccessDeniedScreen = currentRoute === 'access-denied';

    if (!isAuthenticated) {
      if (!isOnLoginScreen) {
        router.replace('/login');
      }

      return;
    }

    if (!hasAccess) {
      if (!isOnAccessDeniedScreen) {
        router.replace('/access-denied');
      }

      return;
    }

    if (isOnLoginScreen || isOnAccessDeniedScreen) {
      router.replace(getHomeRoute(profile));
    }
  }, [
    isAuthenticated,
    hasAccess,
    isLoading,
    profile,
    segments,
  ]);

  if (isLoading) {
    return <SessionLoader />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}