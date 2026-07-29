// app/(app)/case-activities/index.tsx

import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import {
  useCallback,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { COLORS } from '@/constants/theme';
import {
  getCaseActivitiesByCaseId,
} from '@/features/case-activities/case-activity.service';
import {
  CASE_ACTIVITY_TYPE_LABELS,
  type CaseActivity,
} from '@/features/case-activities/case-activity.types';
import {
  getCase,
} from '@/features/cases/case.service';
import type {
  Case,
} from '@/features/cases/case.types';

function getParam(
  value: string | string[] | undefined
): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? '';
  }

  return value?.trim() ?? '';
}

function formatDate(
  value: CaseActivity['performedAt']
): string {
  try {
    return value
      .toDate()
      .toLocaleString('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
  } catch {
    return '-';
  }
}

export default function CaseActivitiesScreen() {
  const params = useLocalSearchParams<{
    caseId?: string | string[];
  }>();

  const caseId = getParam(params.caseId);

  const [currentCase, setCurrentCase] =
    useState<Case | null>(null);

  const [activities, setActivities] =
    useState<CaseActivity[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const loadData = useCallback(
    async (refresh = false) => {
      if (!caseId) {
        setCurrentCase(null);
        setActivities([]);
        setIsLoading(false);

        Alert.alert(
          'Erreur',
          'Identifiant du dossier manquant.'
        );

        return;
      }

      try {
        if (refresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const [
          caseResult,
          activitiesResult,
        ] = await Promise.all([
          getCase(caseId),
          getCaseActivitiesByCaseId(caseId),
        ]);

        if (!caseResult) {
          setCurrentCase(null);
          setActivities([]);

          Alert.alert(
            'Dossier introuvable',
            'Ce dossier n’existe pas ou n’est plus accessible.'
          );

          return;
        }

        setCurrentCase(caseResult);
        setActivities(activitiesResult);
      } catch (error) {
        console.error(
          'Erreur lors du chargement des activités :',
          error
        );

        Alert.alert(
          'Erreur',
          'Impossible de charger les activités du dossier.'
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [caseId]
  );

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData])
  );

  function openActivity(
    activityId: string
  ): void {
    router.push({
      pathname: '/case-activities/[id]',
      params: {
        id: activityId,
        caseId,
      },
    });
  }

  function createActivity(): void {
    if (!currentCase) {
      return;
    }

    if (currentCase.status === 'closed') {
      Alert.alert(
        'Dossier clôturé',
        'Aucune activité ne peut être ajoutée à un dossier clôturé.'
      );

      return;
    }

    router.push({
      pathname: '/case-activities/form',
      params: {
        caseId: currentCase.id,
      },
    });
  }

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.light,
        }}
      >
        <ActivityIndicator size="large" />

        <Text
          style={{
            marginTop: 12,
            color: COLORS.muted,
          }}
        >
          Chargement des activités...
        </Text>
      </SafeAreaView>
    );
  }

  if (!currentCase) {
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
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: COLORS.text,
              textAlign: 'center',
            }}
          >
            Dossier introuvable
          </Text>

          <Text
            style={{
              marginTop: 10,
              color: COLORS.muted,
              textAlign: 'center',
              lineHeight: 21,
            }}
          >
            Impossible d’afficher les activités de ce dossier.
          </Text>

          <View
            style={{
              marginTop: 24,
              width: '100%',
              maxWidth: 420,
            }}
          >
            <AppButton
              title="Retour"
              onPress={() => router.back()}
            />
          </View>
        </View>
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
          width: '100%',
          maxWidth: 760,
          alignSelf: 'center',
          padding: 16,
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: '700',
            color: COLORS.text,
          }}
        >
          Activités
        </Text>

        <View
          style={{
            marginTop: 14,
            marginBottom: 18,
            padding: 14,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#ECECEC',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: COLORS.muted,
            }}
          >
            Dossier
          </Text>

          <Text
            style={{
              marginTop: 3,
              fontSize: 17,
              fontWeight: '700',
              color: COLORS.text,
            }}
          >
            {currentCase.caseNumber ||
              currentCase.id}
          </Text>

          <Text
            style={{
              marginTop: 8,
              fontSize: 16,
              fontWeight: '600',
              color: COLORS.text,
            }}
          >
            {currentCase.personName}
          </Text>

          <Text
            style={{
              marginTop: 4,
              color: COLORS.muted,
            }}
          >
            Conseiller :{' '}
            {currentCase.counselorName}
          </Text>
        </View>

        {currentCase.status !== 'closed' ? (
          <AppButton
            title="Nouvelle activité"
            onPress={createActivity}
          />
        ) : (
          <View
            style={{
              padding: 12,
              borderRadius: 8,
              backgroundColor: '#EEEEEE',
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: COLORS.muted,
                fontWeight: '600',
              }}
            >
              Ce dossier est clôturé.
            </Text>
          </View>
        )}

        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          style={{
            marginTop: 18,
          }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 30,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                void loadData(true);
              }}
            />
          }
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 50,
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: COLORS.text,
                  textAlign: 'center',
                }}
              >
                Aucune activité enregistrée
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  color: COLORS.muted,
                  lineHeight: 21,
                  textAlign: 'center',
                }}
              >
                Ce dossier ne contient encore aucune activité de suivi.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                openActivity(item.id)
              }
              style={{
                marginBottom: 12,
                padding: 14,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#ECECEC',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Text
                style={{
                  color: COLORS.muted,
                  fontSize: 13,
                }}
              >
                {item.activityNumber}
              </Text>

              <Text
                style={{
                  marginTop: 5,
                  fontSize: 14,
                  fontWeight: '700',
                  color: '#2E7D32',
                }}
              >
                {
                  CASE_ACTIVITY_TYPE_LABELS[
                    item.type
                  ]
                }
              </Text>

              <Text
                style={{
                  marginTop: 7,
                  fontSize: 17,
                  fontWeight: '700',
                  color: COLORS.text,
                }}
              >
                {item.title}
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  color: COLORS.muted,
                }}
              >
                {formatDate(item.performedAt)}
              </Text>

              <Text
                numberOfLines={3}
                style={{
                  marginTop: 10,
                  color: COLORS.text,
                  lineHeight: 21,
                }}
              >
                {item.description}
              </Text>

              {item.nextAction ? (
                <Text
                  numberOfLines={2}
                  style={{
                    marginTop: 10,
                    color: COLORS.muted,
                    fontStyle: 'italic',
                  }}
                >
                  Prochaine action :{' '}
                  {item.nextAction}
                </Text>
              ) : null}
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}