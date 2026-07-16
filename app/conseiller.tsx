import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { AppButton } from '../src/components/ui/AppButton';
import { COLORS } from '../src/constants/theme';
import { useAuth } from '../src/contexts/AuthContext';

export default function ConseillerScreen() {
  const { profile, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error(
        'Erreur lors de la déconnexion :',
        error
      );

      Alert.alert(
        'Déconnexion impossible',
        'Une erreur est survenue.'
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
        Espace Conseiller
      </Text>

      <Text
        style={{
          marginTop: 12,
          color: COLORS.muted,
          textAlign: 'center',
        }}
      >
        Mes âmes, mes rendez-vous et mes suivis
      </Text>

      <Text
        style={{
          marginTop: 20,
          color: COLORS.text,
          textAlign: 'center',
        }}
      >
        {profile?.displayName}
      </Text>

      <View
        style={{
          width: '100%',
          maxWidth: 360,
          marginTop: 32,
        }}
      >
        <AppButton
          title={
            isLoggingOut
              ? 'Déconnexion...'
              : 'Se déconnecter'
          }
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}