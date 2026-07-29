// app/(app)/appointments/form.tsx
import {
  router,
  useLocalSearchParams,
} from 'expo-router';
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
import { AppInput } from '@/components/ui/AppInput';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { createAppointment } from '@/features/appointments/appointment.service';
import { getRequest } from '@/features/requests/request.service';
import { HelpRequest } from '@/features/requests/request.types';

function parseDateTime(
  dateValue: string,
  timeValue: string
): Date | null {
  const dateMatch = dateValue
    .trim()
    .match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  const timeMatch = timeValue
    .trim()
    .match(/^(\d{2}):(\d{2})$/);

  if (!dateMatch || !timeMatch) {
    return null;
  }

  const [, day, month, year] = dateMatch;
  const [, hours, minutes] = timeMatch;

  const result = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    0,
    0
  );

  if (
    result.getFullYear() !== Number(year) ||
    result.getMonth() !== Number(month) - 1 ||
    result.getDate() !== Number(day) ||
    result.getHours() !== Number(hours) ||
    result.getMinutes() !== Number(minutes)
  ) {
    return null;
  }

  return result;
}

function getErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Impossible de planifier le rendez-vous.';
  }

  switch (error.message) {
    case 'REQUEST_NOT_FOUND':
      return 'La demande est introuvable.';

    case 'REQUEST_NOT_ASSIGNED':
      return 'La demande doit être affectée avant de planifier un rendez-vous.';

    case 'REQUEST_PERSON_MISMATCH':
      return 'La personne liée à la demande est incorrecte.';

    case 'INITIAL_APPOINTMENT_ALREADY_EXISTS':
      return 'Un premier rendez-vous existe déjà pour cette demande.';

    case 'START_DATE_INVALID':
      return 'La date ou l’heure de début est invalide.';

    case 'END_DATE_INVALID':
      return 'L’heure de fin est invalide.';

    default:
      return 'Impossible de planifier le rendez-vous.';
  }
}

export default function AppointmentFormScreen() {
  const { requestId } = useLocalSearchParams<{
    requestId?: string;
  }>();

  const { profile } = useAuth();

  const [request, setRequest] =
    useState<HelpRequest | null>(null);

  const [date, setDate] = useState('');
  const [startTime, setStartTime] =
    useState('');
  const [endTime, setEndTime] =
    useState('');
  const [location, setLocation] =
    useState('');
  const [notes, setNotes] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(true);
  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadRequest() {
      if (!requestId) {
        Alert.alert(
          'Erreur',
          'La demande liée au rendez-vous est obligatoire.',
          [
            {
              text: 'Retour',
              onPress: () => router.back(),
            },
          ]
        );

        if (isMounted) {
          setIsLoading(false);
        }

        return;
      }

      try {
        const result = await getRequest(requestId);

        if (!result) {
          Alert.alert(
            'Erreur',
            'La demande est introuvable.',
            [
              {
                text: 'Retour',
                onPress: () => router.back(),
              },
            ]
          );
          return;
        }

        if (result.status !== 'assigned') {
          Alert.alert(
            'Action impossible',
            'La demande doit être affectée avant de planifier un rendez-vous.',
            [
              {
                text: 'Retour',
                onPress: () => router.back(),
              },
            ]
          );
          return;
        }

        if (
          !result.assignedCounselorId ||
          !result.assignedCounselorName
        ) {
          Alert.alert(
            'Action impossible',
            'Aucun conseiller n’est affecté à cette demande.',
            [
              {
                text: 'Retour',
                onPress: () => router.back(),
              },
            ]
          );
          return;
        }

        if (result.initialAppointmentId) {
          Alert.alert(
            'Action impossible',
            'Un premier rendez-vous existe déjà pour cette demande.',
            [
              {
                text: 'Voir le rendez-vous',
                onPress: () =>
                  router.replace({
                    pathname: '/appointments/[id]',
                    params: {
                      id: result.initialAppointmentId,
                    },
                  }),
              },
            ]
          );
          return;
        }

        if (isMounted) {
          setRequest(result);
        }
      } catch (error) {
        console.error(
          'Erreur lors du chargement de la demande :',
          error
        );

        Alert.alert(
          'Erreur',
          'Impossible de charger la demande.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRequest();

    return () => {
      isMounted = false;
    };
  }, [requestId]);

  async function handleSave() {
    if (!profile || !request || isSaving) {
      return;
    }

    const startAt = parseDateTime(
      date,
      startTime
    );

    if (!startAt) {
      Alert.alert(
        'Validation',
        'Saisissez une date au format JJ/MM/AAAA et une heure au format HH:MM.'
      );
      return;
    }

    if (startAt <= new Date()) {
      Alert.alert(
        'Validation',
        'Le rendez-vous doit être planifié dans le futur.'
      );
      return;
    }

    let endAt: Date | undefined;

    if (endTime.trim()) {
      const parsedEndAt = parseDateTime(
        date,
        endTime
      );

      if (!parsedEndAt) {
        Alert.alert(
          'Validation',
          'L’heure de fin doit respecter le format HH:MM.'
        );
        return;
      }

      endAt = parsedEndAt;
    }

    if (endAt && endAt <= startAt) {
      Alert.alert(
        'Validation',
        'L’heure de fin doit être postérieure à l’heure de début.'
      );
      return;
    }

    try {
      setIsSaving(true);

      const appointmentId =
        await createAppointment({
          requestId: request.id,

          personId: request.personId,
          personName: request.personName,

          counselorId:
            request.assignedCounselorId!,
          counselorName:
            request.assignedCounselorName!,

          type: 'initial_interview',

          startAt,
          endAt,

          location,
          notes,

          createdBy: profile.uid,
          createdByName:
            profile.displayName,
        });
    

      Alert.alert(
        'Succès',
        'Le premier rendez-vous a été planifié.',
        [
          {
            text: 'Voir le rendez-vous',
            onPress: () =>
              router.replace({
                pathname: '/appointments/[id]',
                params: {
                  id: appointmentId,
                },
              }),
          },
        ]
      );

          router.back();
    } catch (error) {
      console.error(
        'Erreur lors de la création du rendez-vous :',
        error
      );

      Alert.alert(
        'Erreur',
        getErrorMessage(error)
      );
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

  if (!request) {
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
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: '700',
            color: COLORS.text,
          }}
        >
          Premier rendez-vous
        </Text>

        <Text
          style={{
            marginTop: 6,
            marginBottom: 20,
            color: COLORS.muted,
            fontSize: 16,
          }}
        >
          {request.personName}
        </Text>

        <View style={{ gap: 16 }}>
          <Text
            style={{
              color: COLORS.text,
              fontWeight: '600',
            }}
          >
            Type : Premier entretien
          </Text>

          <AppInput
            placeholder="Date — JJ/MM/AAAA"
            value={date}
            onChangeText={setDate}
          />

          <AppInput
            placeholder="Heure de début — HH:MM"
            value={startTime}
            onChangeText={setStartTime}
          />

          <AppInput
            placeholder="Heure de fin — HH:MM (facultatif)"
            value={endTime}
            onChangeText={setEndTime}
          />

          <AppInput
            placeholder="Lieu"
            value={location}
            onChangeText={setLocation}
          />

          <AppInput
            placeholder="Notes complémentaires"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          <Text style={{ color: COLORS.muted }}>
            Conseiller :{' '}
            {request.assignedCounselorName}
          </Text>

          <AppButton
            title={
              isSaving
                ? 'Enregistrement...'
                : 'Planifier le rendez-vous'
            }
            disabled={isSaving}
            onPress={handleSave}
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