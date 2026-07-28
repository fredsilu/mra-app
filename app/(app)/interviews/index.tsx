// app/(app)/interviews/index.tsx
import {
  router,
  useFocusEffect,
} from 'expo-router';
import {
  useCallback,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import { COLORS } from '@/constants/theme';
import { getInterviews } from '@/features/interviews/interview.service';
import {
  Interview,
  INTERVIEW_STATUS_LABELS,
} from '@/features/interviews/interview.types';

function formatDate(
  interview: Interview
): string {
  return interview.startedAt
    .toDate()
    .toLocaleString(
      'fr-FR',
      {
        dateStyle: 'medium',
        timeStyle: 'short',
      }
    );
}

function getStatusColor(
  status: Interview['status']
): string {
  switch (status) {
    case 'draft':
      return '#1976D2';

    case 'completed':
      return '#2E7D32';

    default:
      return '#616161';
  }
}

export default function InterviewsScreen() {
  const [
    interviews,
    setInterviews,
  ] = useState<Interview[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const loadInterviews =
    useCallback(async () => {
      try {
        setIsLoading(true);

        const result =
          await getInterviews();

        setInterviews(result);
      } catch (error) {
        console.error(
          'Erreur lors du chargement des entretiens :',
          error
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      loadInterviews();
    }, [loadInterviews])
  );

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:
            COLORS.light,
        }}
      >
        <ActivityIndicator
          size="large"
        />

        <Text
          style={{
            marginTop: 12,
          }}
        >
          Chargement...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          COLORS.light,
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
            marginBottom: 20,
          }}
        >
          Entretiens
        </Text>

        <FlatList
          data={interviews}
          keyExtractor={(item) =>
            item.id
          }
          ListEmptyComponent={
            <Text
              style={{
                textAlign: 'center',
                marginTop: 40,
                color: COLORS.muted,
              }}
            >
              Aucun entretien enregistré.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname:
                    '/interviews/[id]',
                  params: {
                    id: item.id,
                  },
                })
              }
              style={{
                backgroundColor:
                  '#FFFFFF',
                borderRadius: 10,
                borderWidth: 1,
                borderColor:
                  '#ECECEC',
                padding: 14,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  color:
                    COLORS.muted,
                  fontSize: 13,
                }}
              >
                {
                  item.interviewNumber
                }
              </Text>

              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '700',
                  color:
                    COLORS.text,
                  marginTop: 4,
                }}
              >
                {item.personName}
              </Text>

              <Text
                style={{
                  marginTop: 6,
                }}
              >
                Début :{' '}
                {formatDate(item)}
              </Text>

              <Text
                style={{
                  marginTop: 4,
                }}
              >
                Conseiller :{' '}
                {item.counselorName}
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  color:
                    getStatusColor(
                      item.status
                    ),
                  fontWeight: '700',
                }}
              >
                {
                  INTERVIEW_STATUS_LABELS[
                    item.status
                  ]
                }
              </Text>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}