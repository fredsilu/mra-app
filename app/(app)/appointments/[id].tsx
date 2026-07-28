// app/(app)/appointments/[id].tsx
import {
  router,
  useLocalSearchParams,
} from 'expo-router';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import {
  cancelAppointment,
  completeAppointment,
  confirmAppointment,
  getAppointment,
  markAppointmentNoShow,
} from '@/features/appointments/appointment.service';
import {
  Appointment,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPE_LABELS,
} from '@/features/appointments/appointment.types';
import {
  getInterviewByAppointmentId,
} from '@/features/interviews/interview.service';

function formatDate(
  value?: Appointment['startAt']
): string {
  if (!value) {
    return 'Non renseignée';
  }

  return value.toDate().toLocaleString('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
      }}
    >
      <Text
        style={{
          color: COLORS.muted,
          fontSize: 13,
          marginBottom: 4,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: COLORS.text,
          fontSize: 16,
          fontWeight: '600',
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ECECEC',
        padding: 16,
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: COLORS.text,
          marginBottom: 10,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id?: string;
  }>();
  const { profile } = useAuth();

  const [appointment, setAppointment] =
    useState<Appointment | null>(null);
  const [interviewId, setInterviewId] =
    useState<string | null>(null);
  const [isLoading, setIsLoading] =
    useState(true);
  const [isSaving, setIsSaving] =
    useState(false);

  const loadAppointment =
    useCallback(async () => {
      if (!id) {
        Alert.alert(
          'Erreur',
          'Identifiant du rendez-vous manquant.'
        );
        router.back();
        return;
      }

      try {
        setIsLoading(true);
        const result = await getAppointment(id);

        if (!result) {
          Alert.alert(
            'Erreur',
            'Rendez-vous introuvable.'
          );
          router.back();
          return;
        }

        const linkedInterview =
          await getInterviewByAppointmentId(
            result.id
          );

        setAppointment(result);
        setInterviewId(
          linkedInterview?.id ?? null
        );
      } catch (error) {
        console.error(
          'Erreur lors du chargement du rendez-vous :',
          error
        );
        Alert.alert(
          'Erreur',
          'Impossible de charger le rendez-vous.'
        );
      } finally {
        setIsLoading(false);
      }
    }, [id]);

  useEffect(() => {
    loadAppointment();
  }, [loadAppointment]);

  async function executeAction(
    title: string,
    message: string,
    action: (
      appointmentId: string,
      userId: string,
      userName: string
    ) => Promise<void>
  ) {
    if (!id || !profile || isSaving) {
      return;
    }

    Alert.alert(title, message, [
      {
        text: 'Retour',
        style: 'cancel',
      },
      {
        text: 'Confirmer',
        onPress: async () => {
          try {
            setIsSaving(true);
            await action(
              id,
              profile.uid,
              profile.displayName
            );
            await loadAppointment();
          } catch (error) {
            console.error(
              'Erreur lors du changement de statut :',
              error
            );
            Alert.alert(
              'Erreur',
              'Impossible de modifier le rendez-vous.'
            );
          } finally {
            setIsSaving(false);
          }
        },
      },
    ]);
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

  if (!appointment) {
    return null;
  }

  const isActive =
    appointment.status === 'scheduled' ||
    appointment.status === 'confirmed';

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
          paddingBottom: 50,
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: '800',
            color: COLORS.text,
          }}
        >
          Détail du rendez-vous
        </Text>

        <Text
          style={{
            marginTop: 6,
            marginBottom: 20,
            color: COLORS.muted,
            fontSize: 17,
          }}
        >
          {appointment.appointmentNumber}
        </Text>

        <Section title="Rendez-vous">
          <InfoRow
            label="Personne"
            value={appointment.personName}
          />
          <InfoRow
            label="Type"
            value={
              APPOINTMENT_TYPE_LABELS[
                appointment.type
              ]
            }
          />
          <InfoRow
            label="Statut"
            value={
              APPOINTMENT_STATUS_LABELS[
                appointment.status
              ]
            }
          />
          <InfoRow
            label="Début"
            value={formatDate(
              appointment.startAt
            )}
          />
          <InfoRow
            label="Fin"
            value={
              appointment.endAt
                ? formatDate(appointment.endAt)
                : 'Non renseignée'
            }
          />
          <InfoRow
            label="Lieu"
            value={
              appointment.location ||
              'Non renseigné'
            }
          />
          <InfoRow
            label="Conseiller"
            value={appointment.counselorName}
          />
        </Section>

        <Section title="Notes">
          <Text
            style={{
              color: appointment.notes
                ? COLORS.text
                : COLORS.muted,
              fontSize: 16,
              lineHeight: 23,
            }}
          >
            {appointment.notes || 'Aucune note.'}
          </Text>
        </Section>

        <Section title="Historique">
          <InfoRow
            label="Création"
            value={formatDate(
              appointment.createdAt
            )}
          />
          {appointment.confirmedAt ? (
            <InfoRow
              label={`Confirmation par ${
                appointment.confirmedByName ||
                'un utilisateur'
              }`}
              value={formatDate(
                appointment.confirmedAt
              )}
            />
          ) : null}
          {appointment.completedAt ? (
            <InfoRow
              label={`Réalisation par ${
                appointment.completedByName ||
                'un utilisateur'
              }`}
              value={formatDate(
                appointment.completedAt
              )}
            />
          ) : null}
          {appointment.cancelledAt ? (
            <InfoRow
              label={`Annulation par ${
                appointment.cancelledByName ||
                'un utilisateur'
              }`}
              value={formatDate(
                appointment.cancelledAt
              )}
            />
          ) : null}
          {appointment.noShowAt ? (
            <InfoRow
              label={`Absence constatée par ${
                appointment.noShowByName ||
                'un utilisateur'
              }`}
              value={formatDate(
                appointment.noShowAt
              )}
            />
          ) : null}
        </Section>

        <View style={{ gap: 12 }}>
          {appointment.status === 'scheduled' ? (
            <AppButton
              title="Confirmer le rendez-vous"
              disabled={isSaving}
              onPress={() =>
                executeAction(
                  'Confirmer le rendez-vous',
                  'Confirmer la présence prévue à ce rendez-vous ?',
                  confirmAppointment
                )
              }
            />
          ) : null}

          {isActive ? (
            <>
              <AppButton
                title="Marquer comme réalisé"
                disabled={isSaving}
                onPress={() =>
                  executeAction(
                    'Rendez-vous réalisé',
                    'Confirmer que ce rendez-vous a été réalisé ?',
                    completeAppointment
                  )
                }
              />

              <AppButton
                title="Marquer la personne absente"
                disabled={isSaving}
                onPress={() =>
                  executeAction(
                    'Personne absente',
                    'Confirmer que la personne ne s’est pas présentée ?',
                    markAppointmentNoShow
                  )
                }
              />

              <AppButton
                title="Annuler le rendez-vous"
                disabled={isSaving}
                onPress={() =>
                  executeAction(
                    'Annuler le rendez-vous',
                    'Voulez-vous réellement annuler ce rendez-vous ?',
                    cancelAppointment
                  )
                }
              />
            </>
          ) : null}

          {appointment.status === 'completed' ? (
            <AppButton
              title={
                interviewId
                  ? 'Voir l’entretien'
                  : 'Démarrer l’entretien'
              }
              disabled={isSaving}
              onPress={() => {
                if (interviewId) {
                  router.push({
                    pathname:
                      '/interviews/[id]',
                    params: {
                      id: interviewId,
                    },
                  });
                  return;
                }

                router.push({
                  pathname: '/interviews/form',
                  params: {
                    appointmentId:
                      appointment.id,
                  },
                });
              }}
            />
          ) : null}

          <AppButton
            title="Voir la demande"
            disabled={isSaving}
            onPress={() =>
              router.push({
                pathname: '/requests/[id]',
                params: {
                  id: appointment.requestId,
                },
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