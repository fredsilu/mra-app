import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { getDecisionByInterviewId } from '@/features/decisions/decision.service';
import {
  completeInterview,
  getInterview,
  updateInterview,
} from '@/features/interviews/interview.service';
import {
  Interview,
  INTERVIEW_STATUS_LABELS,
} from '@/features/interviews/interview.types';

export default function InterviewDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { profile } = useAuth();

  const [interview, setInterview] = useState<Interview | null>(null);
  const [summary, setSummary] = useState('');
  const [observations, setObservations] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [decisionId, setDecisionId] = useState<string | null>(null);

  const loadInterview = useCallback(async () => {
    if (!id) {
      router.back();
      return;
    }

    try {
      setIsLoading(true);
      const result = await getInterview(id);

      if (!result) {
        Alert.alert('Erreur', 'Entretien introuvable.');
        router.back();
        return;
      }

      setInterview(result);
      setSummary(result.summary || '');
      setObservations(result.observations || '');
      setRecommendations(result.recommendations || '');

      if (result.status === 'completed') {
        const decision = await getDecisionByInterviewId(result.id);
        setDecisionId(decision?.id ?? null);
      } else {
        setDecisionId(null);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de charger l’entretien.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadInterview();
  }, [loadInterview]);

  async function save() {
    if (!id || isSaving) return;

    try {
      setIsSaving(true);
      await updateInterview(id, { summary, observations, recommendations });
      await loadInterview();
      Alert.alert('Succès', 'L’entretien a été enregistré.');
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible d’enregistrer l’entretien.');
    } finally {
      setIsSaving(false);
    }
  }

  function finish() {
    if (!id || !profile || isSaving) return;

    if (!summary.trim()) {
      Alert.alert('Validation', 'Le résumé est obligatoire.');
      return;
    }

    Alert.alert(
      'Terminer l’entretien',
      'Après validation, l’entretien ne pourra plus être modifié.',
      [
        { text: 'Retour', style: 'cancel' },
        {
          text: 'Terminer',
          onPress: async () => {
            try {
              setIsSaving(true);
              await updateInterview(id, {
                summary,
                observations,
                recommendations,
              });
              await completeInterview(
                id,
                profile.uid,
                profile.displayName
              );
              await loadInterview();
            } catch (error) {
              console.error(error);
              Alert.alert('Erreur', 'Impossible de terminer l’entretien.');
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
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
      </SafeAreaView>
    );
  }

  if (!interview) return null;

  const completed = interview.status === 'completed';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.light }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 26, fontWeight: '700', color: COLORS.text }}>
          Entretien
        </Text>

        <Text style={{ marginTop: 6, color: COLORS.muted }}>
          {interview.interviewNumber}
        </Text>

        <View style={{ marginTop: 18, marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '700' }}>
            {interview.personName}
          </Text>
          <Text style={{ marginTop: 5, color: COLORS.muted }}>
            Conseiller : {interview.counselorName}
          </Text>
          <Text style={{ marginTop: 5, fontWeight: '700' }}>
            {INTERVIEW_STATUS_LABELS[interview.status]}
          </Text>
        </View>

        <View style={{ gap: 16 }}>
          <AppInput
            placeholder="Résumé de l’entretien"
            value={summary}
            onChangeText={setSummary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            editable={!completed}
          />

          <AppInput
            placeholder="Observations"
            value={observations}
            onChangeText={setObservations}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            editable={!completed}
          />

          <AppInput
            placeholder="Recommandations"
            value={recommendations}
            onChangeText={setRecommendations}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            editable={!completed}
          />

          {!completed ? (
            <>
              <AppButton
                title={isSaving ? 'Enregistrement...' : 'Enregistrer'}
                disabled={isSaving}
                onPress={save}
              />
              <AppButton
                title="Terminer l’entretien"
                disabled={isSaving}
                onPress={finish}
              />
            </>
          ) : null}

          {completed ? (
            <AppButton
              title={decisionId ? 'Voir la décision' : 'Prendre une décision'}
              disabled={isSaving}
              onPress={() =>
                decisionId
                  ? router.push({
                      pathname: '/decisions/[id]',
                      params: { id: decisionId },
                    })
                  : router.push({
                      pathname: '/decisions/form',
                      params: { interviewId: interview.id },
                    })
              }
            />
          ) : null}

          <AppButton
            title="Voir le rendez-vous"
            disabled={isSaving}
            onPress={() =>
              router.push({
                pathname: '/appointments/[id]',
                params: { id: interview.appointmentId },
              })
            }
          />

          <AppButton
            title="Retour"
            disabled={isSaving}
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
