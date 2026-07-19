// app/cases.tsx

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
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import { AppButton } from '../src/components/ui/AppButton';
import { COLORS } from '../src/constants/theme';

import { getCases } from '../src/services/case.service';
import { getPeople } from '../src/services/person.service';
import { getUsers } from '../src/services/user.service';

import {
  CASE_PRIORITY_LABELS,
  CASE_STATUS_LABELS,
  HelpCase,
} from '../src/types/case.types';

import { Person } from '../src/types/person.types';
import { UserProfile } from '../src/types/user.types';

function statusColor(status: string) {
  switch (status) {
    case 'new':
      return '#1976D2';

    case 'assigned':
      return '#7B1FA2';

    case 'in_progress':
      return '#F57C00';

    case 'waiting':
      return '#795548';

    case 'closed':
      return '#2E7D32';

    case 'cancelled':
      return '#D32F2F';

    default:
      return '#616161';
  }
}

function priorityColor(priority: string) {
  switch (priority) {
    case 'low':
      return '#43A047';

    case 'normal':
      return '#1976D2';

    case 'high':
      return '#FB8C00';

    case 'urgent':
      return '#D32F2F';

    default:
      return '#616161';
  }
}

function formatDate(
  value: HelpCase['createdAt']
): string {
  try {
    return value
      .toDate()
      .toLocaleDateString('fr-FR');
  } catch {
    return '-';
  }
}

export default function CasesScreen() {
  const [cases, setCases] = useState<
    HelpCase[]
  >([]);

  const [people, setPeople] = useState<
    Person[]
  >([]);

  const [users, setUsers] = useState<
    UserProfile[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    try {
      setLoading(true);

      const [
        caseList,
        peopleList,
        userList,
      ] = await Promise.all([
        getCases(),
        getPeople(),
        getUsers(),
      ]);

      setCases(caseList);
      setPeople(peopleList);
      setUsers(userList);
    } catch (error) {
      console.error(
        'Erreur lors du chargement des dossiers :',
        error
      );

      Alert.alert(
        'Erreur',
        'Impossible de charger les dossiers.'
      );
    } finally {
      setLoading(false);
    }
  }

  const peopleById = useMemo(() => {
    return new Map(
      people.map((person) => [
        person.id,
        person,
      ])
    );
  }, [people]);

  const usersById = useMemo(() => {
    return new Map(
      users.map((user) => [
        user.uid,
        user,
      ])
    );
  }, [users]);

  function getPersonName(
    personId: string
  ): string {
    return (
      peopleById.get(personId)
        ?.fullName ??
      'Personne introuvable'
    );
  }

  function getCounselorName(
    counselorId?: string
  ): string | null {
    if (!counselorId) {
      return null;
    }

    return (
      usersById.get(counselorId)
        ?.displayName ??
      'Conseiller introuvable'
    );
  }

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.light,
        }}
      >
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.light,
      }}
    >
      <View
        style={{
          flex: 1,
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
          Dossiers de relation d’aide
        </Text>

        <Text
          style={{
            color: COLORS.muted,
            lineHeight: 20,
            marginBottom: 20,
          }}
        >
          Consultez et gérez les dossiers ouverts
          pour les personnes accompagnées.
        </Text>

        <AppButton
          title="Nouveau dossier"
          onPress={() =>
            router.push('/case-form')
          }
        />

        <FlatList
          style={{
            marginTop: 20,
          }}
          data={cases}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: 'center',
                marginTop: 40,
                color: COLORS.muted,
              }}
            >
              Aucun dossier de relation d’aide.
            </Text>
          }
          renderItem={({ item }) => {
            const counselorName =
              getCounselorName(
                item.assignedCounselorId
              );

            return (
              <Pressable
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: '#ECECEC',
                }}
                onPress={() => {
                  /*
                   * La fiche détaillée du dossier
                   * sera ajoutée à l’étape suivante.
                   */
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.muted,
                    marginBottom: 4,
                  }}
                >
                  {item.caseNumber ||
                    item.id}
                </Text>

                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: 16,
                    color: COLORS.text,
                  }}
                >
                  {getPersonName(
                    item.personId
                  )}
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    fontWeight: '600',
                    color: COLORS.text,
                  }}
                >
                  {item.requestTitle}
                </Text>

                <Text
                  style={{
                    marginTop: 5,
                    color: COLORS.muted,
                    lineHeight: 20,
                  }}
                  numberOfLines={3}
                >
                  {item.requestDescription}
                </Text>

                <Text
                  style={{
                    marginTop: 10,
                    color: statusColor(
                      item.status
                    ),
                    fontWeight: '600',
                  }}
                >
                  Statut :{' '}
                  {
                    CASE_STATUS_LABELS[
                      item.status
                    ]
                  }
                </Text>

                <Text
                  style={{
                    marginTop: 2,
                    color: priorityColor(
                      item.priority
                    ),
                    fontWeight: '600',
                  }}
                >
                  Priorité :{' '}
                  {
                    CASE_PRIORITY_LABELS[
                      item.priority
                    ]
                  }
                </Text>

                {counselorName ? (
                  <Text
                    style={{
                      marginTop: 6,
                      color: COLORS.text,
                    }}
                  >
                    Conseiller :{' '}
                    {counselorName}
                  </Text>
                ) : (
                  <Text
                    style={{
                      marginTop: 6,
                      color: '#999',
                    }}
                  >
                    Aucun conseiller affecté
                  </Text>
                )}

                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: COLORS.muted,
                  }}
                >
                  Ouvert le :{' '}
                  {formatDate(
                    item.openedAt
                  )}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}