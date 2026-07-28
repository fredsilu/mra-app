//app/(app)/cases/[id].tsx
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
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
import { getPersonById } from '@/features/people/person.service';
import { getUserById } from '@/features/users/user.service';

import {
  CASE_PRIORITY_LABELS,
  CASE_STATUS_LABELS,
  HelpCase,
} from '@/features/cases/case.types';

import { Person } from '@/features/people/person.types';
import { UserProfile } from '@/features/users/user.types';

export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams();

  const [helpCase, setHelpCase] =
    useState<HelpCase | null>(null);

  const [person, setPerson] =
    useState<Person | null>(null);

  const [counselor, setCounselor] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadCase();
  }, []);

  async function loadCase() {
    try {
      setLoading(true);

      const caseId = String(id);

      const loadedCase =
        await getCase(caseId);

      if (!loadedCase) {
        Alert.alert(
          'Erreur',
          'Dossier introuvable.'
        );

        router.back();

        return;
      }

      setHelpCase(loadedCase);

      const loadedPerson =
        await getPersonById(
          loadedCase.personId
        );

      setPerson(loadedPerson);

      if (
        loadedCase.assignedCounselorId
      ) {
        const loadedCounselor =
          await getUserById(
            loadedCase.assignedCounselorId
          );

        setCounselor(
          loadedCounselor
        );
      }
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
          Fiche du dossier
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
            Personne
          </Text>

          <Text>
            Nom : {person?.fullName ?? '-'}
          </Text>

          <Text>
            Téléphone : {person?.phone ?? '-'}
          </Text>

          <Text>
            Email : {person?.email ?? '-'}
          </Text>

          <Text>
            N° MRA : {person?.mraNumber ?? '-'}
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
            Statut :{' '}
            {
              CASE_STATUS_LABELS[
                helpCase.status
              ]
            }
          </Text>

          <Text>
            Priorité :{' '}
            {
              CASE_PRIORITY_LABELS[
                helpCase.priority
              ]
            }
          </Text>

          <Text>
            Conseiller :{' '}
            {counselor?.displayName ??
              'Non affecté'}
          </Text>

          <Text
            style={{
              marginTop: 10,
              fontWeight: '600',
            }}
          >
            Motif
          </Text>

          <Text>
            {helpCase.requestTitle}
          </Text>

          <Text
            style={{
              marginTop: 10,
              fontWeight: '600',
            }}
          >
            Description
          </Text>

          <Text>
            {
              helpCase.requestDescription
            }
          </Text>

          {helpCase.notes ? (
            <>
              <Text
                style={{
                  marginTop: 10,
                  fontWeight: '600',
                }}
              >
                Notes
              </Text>

              <Text>
                {helpCase.notes}
              </Text>
            </>
          ) : null}
        </View>

        <View
          style={{
            marginTop: 30,
          }}
        >
          <AppButton
            title="Retour"
            onPress={() =>
              router.back()
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}