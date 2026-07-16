//app/dashboard.tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { AppButton } from '../src/components/ui/AppButton';
import { COLORS } from '../src/constants/theme';
import { useAuth } from '../src/contexts/AuthContext';

export default function DashboardScreen() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);

      await logout();

      router.replace('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);

      Alert.alert(
        'Déconnexion impossible',
        'Une erreur est survenue pendant la déconnexion.'
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.light,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: '800',
          color: COLORS.text,
          textAlign: 'center',
        }}
      >
        Tableau de bord MRA
      </Text>

      <Text
        style={{
          marginTop: 8,
          color: COLORS.muted,
          textAlign: 'center',
        }}
      >
        Infrastructure V1.0.0 en cours
      </Text>

      <Text
        style={{
          marginTop: 24,
          color: COLORS.text,
          textAlign: 'center',
        }}
      >
        Session : {isAuthenticated ? 'active' : 'inactive'}
      </Text>

      <Text
        style={{
          marginTop: 6,
          color: COLORS.muted,
          textAlign: 'center',
        }}
      >
        {user?.email ?? 'Aucun utilisateur connecté'}
      </Text>

      <View
        style={{
          width: '100%',
          maxWidth: 360,
          marginTop: 32,
        }}
      >
        <AppButton
          title={isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}