// app/(app)/cases/[id].tsx

import {
  router,
  useLocalSearchParams,
} from 'expo-router';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { COLORS } from '@/constants/theme';
import { getCase } from '@/features/cases/case.service';
import {
  CASE_STATUS_LABELS,
  type Case,
} from '@/features/cases/case.types';

function formatDate(
  value?: Case['openedAt']
): string {
  if (!value) {
    return '-';
  }

  try {
    return value
      .toDate()
      .toLocaleDateString('fr-FR');
  } catch {
    return '-';
  }
}

export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams<{
    id?: string;
  }>();

  const [helpCase, setHelpCase] =
    useState<Case | null>(null);
  const [loading, setLoading] =
    useState(true);

  const loadCase = useCallback(async () => {
    const caseId = id?.trim();

    if (!caseId) {
      Alert.alert(
        'Erreur',
        'Identifiant du dossier manquant.'
      );
      router.back();
      return;
    }

    try {
      setLoading(true);

      const loadedCase = await getCase(caseId);

      if (!loadedCase) {
        Alert.alert(
          'Erreur',
          'Dossier introuvable.'
        );
        router.back();
        return;
      }

      setHelpCase(loadedCase);
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Erreur',
        'Impossible de charger le dossier.'
      );
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadCase();
  }, [loadCase]);

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

  if (!helpCase) {
    return null;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.light,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 40,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: COLORS.text,
          }}
        >
          {helpCase.caseNumber}
        </Text>

        <Text
          style={{
            marginTop: 4,
            color: COLORS.muted,
          }}
        >
          Fiche du dossier d’accompagnement
        </Text>

        <View
          style={{
            marginTop: 24,
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Text
            style={{
              fontWeight: '700',
              fontSize: 18,
              marginBottom: 12,
            }}
          >
            Personne accompagnée
          </Text>

          <Text>Nom : {helpCase.personName}</Text>
          <Text style={{ marginTop: 6 }}>
            Identifiant : {helpCase.personId}
          </Text>
        </View>

        <View
          style={{
            marginTop: 20,
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Text
            style={{
              fontWeight: '700',
              fontSize: 18,
              marginBottom: 12,
            }}
          >
            Dossier
          </Text>

          <Text>
            Statut : {CASE_STATUS_LABELS[helpCase.status]}
          </Text>

          <Text style={{ marginTop: 6 }}>
            Conseiller : {helpCase.counselorName}
          </Text>

          <Text style={{ marginTop: 6 }}>
            Ouvert le : {formatDate(helpCase.openedAt)}
          </Text>

          {helpCase.status === 'suspended' ? (
            <>
              <Text style={{ marginTop: 6 }}>
                Suspendu le : {formatDate(helpCase.suspendedAt)}
              </Text>
              <Text style={{ marginTop: 6 }}>
                Motif : {helpCase.suspensionReason ?? '-'}
              </Text>
            </>
          ) : null}

          {helpCase.status === 'closed' ? (
            <>
              <Text style={{ marginTop: 6 }}>
                Clôturé le : {formatDate(helpCase.closedAt)}
              </Text>
              <Text style={{ marginTop: 6 }}>
                Motif : {helpCase.closureReason ?? '-'}
              </Text>
            </>
          ) : null}
        </View>

        <View
          style={{
            marginTop: 20,
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Text
            style={{
              fontWeight: '700',
              fontSize: 18,
              marginBottom: 12,
            }}
          >
            Origine du dossier
          </Text>

          <Text>Contrat : {helpCase.contractId}</Text>
          <Text style={{ marginTop: 6 }}>
            Entretien : {helpCase.interviewId}
          </Text>
          <Text style={{ marginTop: 6 }}>
            Rendez-vous : {helpCase.appointmentId}
          </Text>
          <Text style={{ marginTop: 6 }}>
            Demande : {helpCase.requestId}
          </Text>
        </View>

        <View
          style={{
            marginTop: 30,
            gap: 12,
          }}
        >
          <AppButton
            title="Voir les activités"
            onPress={() =>
              router.push({
                pathname: '/(app)/case-activities',
                params: {
                  caseId: helpCase.id,
                },
              })
            }
          />

          <AppButton
            title="Voir la chronologie"
            onPress={() =>
              router.push({
                pathname: '/(app)/cases/timeline',
                params: {
                  caseId: helpCase.id,
                },
              })
            }
          />

          <AppButton
            title="Retour"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
