import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { getAppointment } from '@/features/appointments/appointment.service';
import { Appointment } from '@/features/appointments/appointment.types';
import {
  createInterview,
  getInterviewByAppointmentId,
} from '@/features/interviews/interview.service';

export default function InterviewFormScreen() {
  const { appointmentId } =
    useLocalSearchParams<{ appointmentId?: string }>();
  const { profile } = useAuth();

  const [appointment, setAppointment] =
    useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!appointmentId) {
        Alert.alert('Erreur', 'Le rendez-vous est obligatoire.');
        router.back();
        return;
      }

      try {
        const existing =
          await getInterviewByAppointmentId(appointmentId);

        if (existing) {
          router.replace({
            pathname: '/interviews/[id]',
            params: { id: existing.id },
          });
          return;
        }

        const result = await getAppointment(appointmentId);

        if (!result) {
          Alert.alert('Erreur', 'Rendez-vous introuvable.');
          router.back();
          return;
        }

        if (result.status !== 'completed') {
          Alert.alert(
            'Action impossible',
            'Le rendez-vous doit être marqué comme réalisé.'
          );
          router.back();
          return;
        }

        setAppointment(result);
      } catch (error) {
        console.error(error);
        Alert.alert('Erreur', 'Impossible de préparer l’entretien.');
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [appointmentId]);

  async function handleCreate() {
    if (!appointment || !profile || isSaving) return;

    try {
      setIsSaving(true);

      const id = await createInterview({
        appointmentId: appointment.id,
        requestId: appointment.requestId,
        personId: appointment.personId,
        personName: appointment.personName,
        counselorId: appointment.counselorId,
        counselorName: appointment.counselorName,
        startedAt: new Date(),
        createdBy: profile.uid,
        createdByName: profile.displayName,
      });

      router.replace({
        pathname: '/interviews/[id]',
        params: { id },
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de créer l’entretien.');
    } finally {
      setIsSaving(false);
    }
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

  if (!appointment) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.light }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={{ fontSize: 26, fontWeight: '700', color: COLORS.text }}>
          Démarrer l’entretien
        </Text>

        <Text style={{ marginTop: 8, marginBottom: 24, color: COLORS.muted }}>
          {appointment.personName}
        </Text>

        <Text style={{ marginBottom: 8 }}>
          Conseiller : {appointment.counselorName}
        </Text>

        <Text style={{ marginBottom: 24 }}>
          Rendez-vous : {appointment.appointmentNumber}
        </Text>

        <AppButton
          title={isSaving ? 'Création...' : 'Commencer l’entretien'}
          disabled={isSaving}
          onPress={handleCreate}
        />

        <AppButton
          title="Retour"
          disabled={isSaving}
          onPress={() => router.back()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
