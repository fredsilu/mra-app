//app/(app)/interviews/[id].tsx

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
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { COLORS } from '@/constants/theme';
import {
  getInterview,
  updateInterview,
} from '@/features/interviews/interview.service';
import type {
  Interview,
} from '@/features/interviews/interview.types';

function formatDate(
  value: { toDate: () => Date }
): string {
  return value.toDate().toLocaleString(
    'fr-FR',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    }
  );
}

export default function InterviewDetailsScreen() {
  const { id } =
    useLocalSearchParams<{
      id?: string;
    }>();

  const [
    interview,
    setInterview,
  ] = useState<Interview | null>(null);

  const [
    summary,
    setSummary,
  ] = useState('');

  const [
    observations,
    setObservations,
  ] = useState('');

  const [
    recommendations,
    setRecommendations,
  ] = useState('');

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const loadInterview =
    useCallback(async (): Promise<void> => {
      if (!id) {
        router.back();
        return;
      }

      try {
        setIsLoading(true);

        const result =
          await getInterview(id);

        if (!result) {
          Alert.alert(
            'Erreur',
            'Entretien introuvable.'
          );

          router.back();
          return;
        }

        setInterview(result);
        setSummary(
          result.summary ?? ''
        );
        setObservations(
          result.observations ?? ''
        );
        setRecommendations(
          result.recommendations ?? ''
        );
      } catch (error) {
        console.error(
          'Erreur lors du chargement de l’entretien :',
          error
        );

        Alert.alert(
          'Erreur',
          'Impossible de charger cet entretien.'
        );
      } finally {
        setIsLoading(false);
      }
    }, [id]);

  useEffect(() => {
    loadInterview();
  }, [loadInterview]);

  async function handleSave(): Promise<void> {
    if (
      !id ||
      isSaving
    ) {
      return;
    }

    if (!summary.trim()) {
      Alert.alert(
        'Validation',
        'Le résumé de l’entretien est obligatoire.'
      );

      return;
    }

    try {
      setIsSaving(true);

      await updateInterview(
        id,
        {
          summary:
            summary.trim(),

          observations:
            observations.trim(),

          recommendations:
            recommendations.trim(),
        }
      );

      await loadInterview();

      Alert.alert(
        'Succès',
        'L’entretien a été enregistré avec succès.'
      );
    } catch (error) {
      console.error(
        'Erreur lors de l’enregistrement de l’entretien :',
        error
      );

      Alert.alert(
        'Erreur',
        'Impossible d’enregistrer cet entretien.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  function openAppointment(): void {
    if (!interview?.appointmentId) {
      Alert.alert(
        'Information',
        'Cet entretien n’est associé à aucun rendez-vous.'
      );

      return;
    }

    router.push({
      pathname:
        '/appointments/[id]',
      params: {
        id:
          interview.appointmentId,
      },
    });
  }

  if (isLoading) {
    return (
      <SafeAreaView
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color={COLORS.text}
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Chargement de l’entretien...
        </Text>
      </SafeAreaView>
    );
  }

  if (!interview) {
    return null;
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={styles.header}
        >
          <Text
            style={styles.title}
          >
            Entretien
          </Text>

          <Text
            style={styles.number}
          >
            {interview.interviewNumber}
          </Text>

          <Text
            style={styles.createdAt}
          >
            Créé le :{' '}
            {formatDate(
              interview.createdAt
            )}
          </Text>
        </View>

        <View
          style={
            styles.personCard
          }
        >
          <Text
            style={
              styles.personName
            }
          >
            {interview.personName}
          </Text>

          <Text
            style={
              styles.secondaryText
            }
          >
            Conseiller :{' '}
            {interview.counselorName}
          </Text>
        </View>

        <View
          style={styles.form}
        >
          <View
            style={styles.field}
          >
            <Text
              style={styles.label}
            >
              Résumé de l’entretien *
            </Text>

            <AppInput
              placeholder="Résumez les principaux éléments de l’entretien"
              value={summary}
              onChangeText={
                setSummary
              }
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View
            style={styles.field}
          >
            <Text
              style={styles.label}
            >
              Observations
            </Text>

            <AppInput
              placeholder="Ajoutez les observations utiles"
              value={
                observations
              }
              onChangeText={
                setObservations
              }
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View
            style={styles.field}
          >
            <Text
              style={styles.label}
            >
              Recommandations
            </Text>

            <AppInput
              placeholder="Ajoutez les recommandations proposées"
              value={
                recommendations
              }
              onChangeText={
                setRecommendations
              }
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View
            style={
              styles.actions
            }
          >
            <AppButton
              title={
                isSaving
                  ? 'Enregistrement...'
                  : 'Enregistrer'
              }
              disabled={isSaving}
              onPress={
                handleSave
              }
            />

            <AppButton
              title="Voir le rendez-vous"
              disabled={isSaving}
              onPress={
                openAppointment
              }
            />

            <AppButton
              title="Retour"
              disabled={isSaving}
              onPress={() =>
                router.back()
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:
        COLORS.light,
    },

    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent:
        'center',
      backgroundColor:
        COLORS.light,
      padding: 24,
    },

    loadingText: {
      marginTop: 12,
      color: COLORS.muted,
      fontSize: 15,
    },

    content: {
      width: '100%',
      maxWidth: 900,
      alignSelf: 'center',
      padding: 16,
      paddingBottom: 50,
    },

    header: {
      marginBottom: 18,
    },

    title: {
      fontSize: 26,
      fontWeight: '700',
      color: COLORS.text,
    },

    number: {
      marginTop: 6,
      color: COLORS.muted,
      fontSize: 14,
    },

    createdAt: {
      marginTop: 4,
      color: COLORS.muted,
      fontSize: 14,
    },

    personCard: {
      padding: 18,
      marginBottom: 20,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      borderRadius: 14,
      backgroundColor:
        COLORS.white,
    },

    personName: {
      color: COLORS.text,
      fontSize: 18,
      fontWeight: '700',
    },

    secondaryText: {
      marginTop: 6,
      color: COLORS.muted,
      fontSize: 14,
    },

    form: {
      gap: 18,
    },

    field: {
      gap: 7,
    },

    label: {
      color: COLORS.text,
      fontSize: 14,
      fontWeight: '600',
    },

    actions: {
      gap: 12,
      marginTop: 6,
    },
  });