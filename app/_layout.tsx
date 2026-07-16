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
    isLoading,
    profile,
  } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const currentRoute = segments[0];
    const isOnLoginScreen = currentRoute === 'login';

    if (!isAuthenticated) {
      if (!isOnLoginScreen) {
        router.replace('/login');
      }

      return;
    }

    if (isAuthenticated && isOnLoginScreen) {
      router.replace(getHomeRoute(profile));
    }
  }, [
    isAuthenticated,
    isLoading,
    profile,
    segments,
  ]);

  if (isLoading) {
    return <SessionLoader />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}