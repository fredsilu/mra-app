//app/access-denied.tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { AppButton } from '../src/components/ui/AppButton';
import { COLORS } from '../src/constants/theme';
import { useAuth } from '../src/contexts/AuthContext';

export default function AccessDeniedScreen() {
  const { profile, logout } = useAuth();
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

  const message = profile
    ? 'Votre compte MRA est actuellement désactivé.'
    : 'Votre compte Firebase existe, mais aucun profil MRA ne lui est associé.';

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
        Accès non autorisé
      </Text>

      <Text
        style={{
          marginTop: 16,
          color: COLORS.muted,
          textAlign: 'center',
          maxWidth: 480,
        }}
      >
        {message}
      </Text>

      <Text
        style={{
          marginTop: 8,
          color: COLORS.muted,
          textAlign: 'center',
        }}
      >
        Veuillez contacter le Responsable ou le Responsable adjoint du MRA.
      </Text>

      <View
        style={{
          width: '100%',
          maxWidth: 360,
          marginTop: 32,
        }}
      >
        <AppButton
          title={isLoggingOut ? 'Déconnexion...' : 'Retour à la connexion'}
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}