//app/(app)/requests/index.tsx

import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { COLORS } from '@/constants/theme';

import { getRequests } from '@/features/requests/request.service';

import {
  HelpRequest,
  REQUEST_PRIORITY_LABELS,
  REQUEST_STATUS_LABELS,
} from '@/features/requests/request.types';

export default function RequestsScreen() {
  const [requests, setRequests] = useState<
    HelpRequest[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [])
  );

  async function loadRequests() {
    try {
      setLoading(true);

      const list =
        await getRequests();

      setRequests(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function statusColor(status: string) {
    switch (status) {
      case 'new':
        return '#1976D2';

      case 'assigned':
        return '#7B1FA2';

      case 'in_progress':
        return '#F57C00';

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

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
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
            marginBottom: 20,
          }}
        >
          Demandes
        </Text>

        <AppButton
          title="Nouvelle demande"
          onPress={() =>
            router.push('/requests/form')
          }
        />

        <FlatList
          style={{
            marginTop: 20,
          }}
          data={requests}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: 'center',
                marginTop: 40,
              }}
            >
              Aucune demande.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 14,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#ECECEC',
              }}
              onPress={() =>
                router.push({
                  pathname: '/requests/[id]',
                  params: {
                    id: item.id,
                  },
                })
              }
            >
              <Text
                style={{
                  color: COLORS.muted,
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                {item.requestNumber}
              </Text>

              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 16,
                }}
              >
                {item.personName}
              </Text>

              <Text
                style={{
                  marginTop: 5,
                }}
              >
                {item.reason}
              </Text>

              <Text
                style={{
                  marginTop: 10,
                  color: statusColor(item.status),
                  fontWeight: '600',
                }}
              >
                Statut : {REQUEST_STATUS_LABELS[item.status]}
              </Text>

              <Text
                style={{
                  color: priorityColor(item.priority),
                  fontWeight: '600',
                }}
              >
                Priorité : {REQUEST_PRIORITY_LABELS[item.priority]}
              </Text>

              {item.assignedCounselorName ? (
                <Text
                  style={{
                    marginTop: 6,
                  }}
                >
                  Conseiller : {item.assignedCounselorName}
                </Text>
              ) : (
                <Text
                  style={{
                    marginTop: 6,
                    color: '#999',
                  }}
                >
                  Aucun conseiller assigné
                </Text>
              )}
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}