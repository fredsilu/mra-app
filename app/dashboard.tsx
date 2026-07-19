//app/dashboard.tsx

import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { AppButton } from '../src/components/ui/AppButton';
import { COLORS } from '../src/constants/theme';
import { useAuth } from '../src/contexts/AuthContext';
import { canManageUsers } from '../src/permissions';

export default function DashboardScreen() {
  const { user, profile, logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

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
        'Une erreur est survenue pendant la déconnexion.'
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: COLORS.light,
      }}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        paddingBottom: 40,
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
          marginTop: 20,
          fontSize: 18,
          fontWeight: '700',
          color: COLORS.text,
          textAlign: 'center',
        }}
      >
        {profile?.displayName || user?.email}
      </Text>

      <Text
        style={{
          marginTop: 6,
          color: COLORS.muted,
          textAlign: 'center',
        }}
      >
        Rôle : {profile?.role ?? 'Profil non configuré'}
      </Text>

      {!profile ? (
        <Text
          style={{
            marginTop: 16,
            color: COLORS.muted,
            textAlign: 'center',
          }}
        >
          Aucun profil MRA n’a été trouvé dans Firestore.
        </Text>
      ) : null}

      <View
        style={{
          width: '100%',
          maxWidth: 360,
          marginTop: 32,
          gap: 12,
        }}
      >
        <AppButton
          title="Personnes"
          onPress={() => router.push('/people')}
        />

        <AppButton
          title="Demandes"
          onPress={() => router.push('/requests')}
        />

        {canManageUsers(profile) ? (
          <AppButton
            title="Utilisateurs"
            onPress={() => router.push('/users')}
          />
        ) : null}

        <View
          style={{
            marginTop: 12,
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
    </ScrollView>
  );
}