//app/_layout.tsx
import { router, Stack, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { SessionLoader } from '../src/components/common/SessionLoader';
import {
  AuthProvider,
  useAuth,
} from '../src/contexts/AuthContext';

function RootNavigator() {
  const segments = useSegments();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const currentRoute = segments[0];
    const isOnLoginScreen = currentRoute === 'login';

    if (!isAuthenticated && !isOnLoginScreen) {
      router.replace('/login');
      return;
    }

    if (isAuthenticated && isOnLoginScreen) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, segments]);

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