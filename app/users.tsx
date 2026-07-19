// app/users.tsx

import {
  router,
  useFocusEffect,
} from 'expo-router';

import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppInput } from '../src/components/ui/AppInput';
import { COLORS } from '../src/constants/theme';
import { useAuth } from '../src/contexts/AuthContext';
import { canManageUsers } from '../src/permissions';
import { getUsers } from '../src/services/user.service';

import {
  UserProfile,
  UserRole,
} from '../src/types/user.types';

const roleLabels: Record<UserRole, string> = {
  responsable: 'Responsable',
  adjoint: 'Adjoint',
  secretaire: 'Secrétaire',
  conseiller: 'Conseiller',
  logistique: 'Logistique',
};

export default function UsersScreen() {
  const { profile } = useAuth();

  const [users, setUsers] =
    useState<UserProfile[]>([]);

  const [searchQuery, setSearchQuery] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const hasPermission =
    canManageUsers(profile);

  const loadUsers = useCallback(
    async (refreshing = false) => {
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }

      try {
        if (refreshing) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const result = await getUsers();

        setUsers(result);
      } catch (error) {
        console.error(
          'Erreur lors du chargement des utilisateurs :',
          error
        );

        Alert.alert(
          'Erreur',
          'Impossible de charger la liste des utilisateurs.'
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [hasPermission]
  );

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [loadUsers])
  );

  const filteredUsers = useMemo(() => {
    const normalizedSearch =
      searchQuery
        .trim()
        .toLowerCase();

    if (!normalizedSearch) {
      return users;
    }

    return users.filter((user) => {
      const displayName =
        user.displayName.toLowerCase();

      const email =
        user.email.toLowerCase();

      const roleLabel =
        roleLabels[user.role].toLowerCase();

      return (
        displayName.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        roleLabel.includes(normalizedSearch)
      );
    });
  }, [searchQuery, users]);

  if (!hasPermission) {
    return (
      <SafeAreaView
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
            fontSize: 24,
            fontWeight: '700',
            color: COLORS.text,
            textAlign: 'center',
          }}
        >
          Accès refusé
        </Text>

        <Text
          style={{
            marginTop: 12,
            color: COLORS.muted,
            textAlign: 'center',
            lineHeight: 21,
          }}
        >
          Seuls le responsable et l’adjoint peuvent gérer les
          utilisateurs.
        </Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.light,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" />

        <Text
          style={{
            marginTop: 12,
            color: COLORS.text,
          }}
        >
          Chargement des utilisateurs...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.light,
        padding: 16,
      }}
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: '700',
          color: COLORS.text,
          marginBottom: 6,
        }}
      >
        Utilisateurs
      </Text>

      <Text
        style={{
          color: COLORS.muted,
          marginBottom: 18,
          lineHeight: 20,
        }}
      >
        Consultez, créez et modifiez les profils des utilisateurs
        autorisés à accéder à l’application.
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/user-create')}
        style={{
          minHeight: 52,
          backgroundColor: COLORS.primary,
          borderRadius: 12,
          paddingHorizontal: 16,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            color: COLORS.white,
            fontSize: 16,
            fontWeight: '700',
          }}
        >
          Nouvel utilisateur
        </Text>
      </TouchableOpacity>

      <AppInput
        placeholder="Rechercher par nom, email ou rôle"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
      />

      <Text
        style={{
          marginTop: 12,
          marginBottom: 12,
          color: COLORS.muted,
        }}
      >
        {filteredUsers.length} utilisateur(s)
      </Text>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.uid}
        refreshing={isRefreshing}
        onRefresh={() => loadUsers(true)}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: '/user-form',
                params: {
                  id: item.uid,
                },
              })
            }
            style={{
              backgroundColor: COLORS.white,
              padding: 16,
              borderRadius: 12,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: COLORS.text,
                  }}
                >
                  {item.displayName ||
                    'Nom non renseigné'}
                </Text>

                <Text
                  style={{
                    marginTop: 5,
                    color: COLORS.muted,
                  }}
                >
                  {item.email ||
                    'Email non renseigné'}
                </Text>

                <Text
                  style={{
                    marginTop: 3,
                    color: COLORS.muted,
                  }}
                >
                  {roleLabels[item.role]}
                </Text>
              </View>

              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 20,
                  backgroundColor: item.isActive
                    ? '#E8F5E9'
                    : '#FFEBEE',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: item.isActive
                      ? '#2E7D32'
                      : '#C62828',
                  }}
                >
                  {item.isActive
                    ? 'Actif'
                    : 'Inactif'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 30,
            }}
          >
            <Text
              style={{
                color: COLORS.muted,
                textAlign: 'center',
              }}
            >
              {searchQuery.trim()
                ? 'Aucun utilisateur ne correspond à cette recherche.'
                : 'Aucun utilisateur enregistré.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}