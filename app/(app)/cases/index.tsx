// app/(app)/cases/index.tsx

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
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import { COLORS } from '@/constants/theme';
import { getCases } from '@/features/cases/case.service';
import {
  CASE_STATUS_LABELS,
  type Case,
  type CaseStatus,
} from '@/features/cases/case.types';

function statusColor(status: CaseStatus): string {
  switch (status) {
    case 'active':
      return '#2E7D32';
    case 'suspended':
      return '#F57C00';
    case 'closed':
      return '#616161';
  }
}

function formatDate(
  value: Case['openedAt']
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
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setCases(await getCases());
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
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData])
  );

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
          Consultez les accompagnements ouverts,
          suspendus ou clôturés.
        </Text>

        <FlatList
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
              Aucun dossier d’accompagnement.
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
                  pathname: '/cases/[id]',
                  params: { id: item.id },
                })
              }
            >
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.muted,
                  marginBottom: 4,
                }}
              >
                {item.caseNumber || item.id}
              </Text>

              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 16,
                  color: COLORS.text,
                }}
              >
                {item.personName}
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  color: COLORS.text,
                }}
              >
                Conseiller : {item.counselorName}
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  color: statusColor(item.status),
                  fontWeight: '600',
                }}
              >
                Statut : {CASE_STATUS_LABELS[item.status]}
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  color: COLORS.muted,
                }}
              >
                Ouvert le : {formatDate(item.openedAt)}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
