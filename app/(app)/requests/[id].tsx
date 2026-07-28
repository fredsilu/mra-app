//app/(app)/requests/[id].tsx

import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';


import { AppButton } from '@/components/ui/AppButton';
import { AppSelect } from '@/components/ui/AppSelect';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import {
  canManageAssignments,
} from '@/permissions';
import {
  assignCounselor,
  cancelRequest,
  getRequest,
} from '@/features/requests/request.service';
import { getActiveCounselors } from '@/features/users/user.service';
import {
  HelpRequest,
  REQUEST_PRIORITY_LABELS,
  REQUEST_STATUS_LABELS,
} from '@/features/requests/request.types';
import { UserProfile } from '@/features/users/user.types';

function formatDate(
  value?: HelpRequest['createdAt']
): string {
  if (!value) {
    return 'Non renseignée';
  }

  return value.toDate().toLocaleString('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function getStatusColor(
  status: HelpRequest['status']
) {
  switch (status) {
    case 'new':
      return '#1976D2';

    case 'assigned':
      return '#7B1FA2';

    case 'cancelled':
      return '#D32F2F';

    default:
      return '#616161';
  }
}

function getPriorityColor(
  priority: HelpRequest['priority']
) {
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

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({
  label,
  value,
}: InfoRowProps) {
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
          fontSize: 13,
          color: COLORS.muted,
          marginBottom: 4,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: COLORS.text,
          fontWeight: '600',
        }}
      >
        {value}
      </Text>
    </View>
  );
}

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({
  title,
  children,
}: SectionProps) {
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

export default function RequestDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id?: string;
  }>();

  const { profile } = useAuth();

  const [request, setRequest] =
    useState<HelpRequest | null>(null);

  const [counselors, setCounselors] =
    useState<UserProfile[]>([]);

  const [
    selectedCounselorId,
    setSelectedCounselorId,
  ] = useState('');


  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const hasAssignmentPermission =
    canManageAssignments(profile);

  const isAssignedCounselor =
    Boolean(
      profile?.uid &&
      request?.assignedCounselorId === profile.uid
    );

  const canManageFirstAppointment =
    request?.status === 'assigned' &&
    (
      hasAssignmentPermission ||
      isAssignedCounselor
    );

  const canCancelRequest =
    hasAssignmentPermission &&
    request?.status !== 'cancelled';

  const counselorOptions = useMemo(
    () =>
      counselors.map((counselor) => ({
        label: counselor.displayName,
        value: counselor.uid,
      })),
    [counselors]
  );

  const loadData = useCallback(async () => {
    if (!id) {
      Alert.alert(
        'Erreur',
        'Identifiant de la demande manquant.'
      );

      router.back();
      return;
    }

    try {
      setIsLoading(true);

      const requestResult = await getRequest(id);

      if (!requestResult) {
        Alert.alert(
          'Erreur',
          'Demande introuvable.'
        );

        router.back();
        return;
      }

      setRequest(requestResult);

      setSelectedCounselorId(
        requestResult.assignedCounselorId ?? ''
      );



      if (hasAssignmentPermission) {
        const counselorList =
          await getActiveCounselors();

        setCounselors(counselorList);
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
      setIsLoading(false);
    }
  }, [id, hasAssignmentPermission]);

  useEffect(() => {
    loadData();
  }, [loadData]);



  async function handleAssignCounselor() {
    if (
      !id ||
      !selectedCounselorId ||
      isSaving
    ) {
      if (!selectedCounselorId) {
        Alert.alert(
          'Validation',
          'Sélectionnez un conseiller.'
        );
      }

      return;
    }

    const counselor = counselors.find(
      (item) =>
        item.uid === selectedCounselorId
    );
    if (
      request?.assignedCounselorId === counselor?.uid
    ) {
      Alert.alert(
        'Information',
        'Ce conseiller est déjà affecté à cette demande.'
      );

      return;
    }

    if (!counselor) {
      Alert.alert(
        'Erreur',
        'Conseiller introuvable.'
      );

      return;
    }

    try {
      setIsSaving(true);

      await assignCounselor(
        id,
        counselor.uid,
        counselor.displayName
      );

      Alert.alert(
        'Succès',
        `La demande a été affectée à ${counselor.displayName}.`
      );

      await loadData();
    } catch (error) {
      console.error(
        'Erreur lors de l’affectation :',
        error
      );

      Alert.alert(
        'Erreur',
        'Impossible d’affecter le conseiller.'
      );
    } finally {
      setIsSaving(false);
    }
  }


  function handleCancelRequest() {
    if (
      !id ||
      !profile ||
      isSaving
    ) {
      return;
    }

    Alert.alert(
      'Annuler la demande',
      'Voulez-vous réellement annuler cette demande ?',
      [
        {
          text: 'Retour',
          style: 'cancel',
        },
        {
          text: 'Annuler la demande',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSaving(true);

              await cancelRequest(
                id,
                profile.uid,
                profile.displayName
              );

              Alert.alert(
                'Succès',
                'La demande a été annulée.'
              );

              await loadData();
            } catch (error) {
              console.error(
                'Erreur lors de l’annulation :',
                error
              );

              Alert.alert(
                'Erreur',
                'Impossible d’annuler la demande.'
              );
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
          backgroundColor: COLORS.light,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" />

        <Text
          style={{
            marginTop: 12,
            color: COLORS.text,
          }}
        >
          Chargement...
        </Text>
      </SafeAreaView>
    );
  }

  if (!request) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.light,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: COLORS.text,
          }}
        >
          Demande introuvable
        </Text>

        <View
          style={{
            width: '100%',
            maxWidth: 300,
            marginTop: 24,
          }}
        >
          <AppButton
            title="Retour"
            onPress={() => router.back()}
          />
        </View>
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
          Détail de la demande
        </Text>

        <Text
          style={{
            marginTop: 6,
            marginBottom: 20,
            fontSize: 17,
            color: COLORS.muted,
          }}
        >
          {request.personName}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor:
                getStatusColor(request.status),
              borderRadius: 10,
              padding: 12,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 12,
              }}
            >
              Statut
            </Text>

            <Text
              style={{
                color: '#FFFFFF',
                fontWeight: '700',
                marginTop: 3,
              }}
            >
              {
                REQUEST_STATUS_LABELS[
                request.status
                ]
              }
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor:
                getPriorityColor(
                  request.priority
                ),
              borderRadius: 10,
              padding: 12,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 12,
              }}
            >
              Priorité
            </Text>

            <Text
              style={{
                color: '#FFFFFF',
                fontWeight: '700',
                marginTop: 3,
              }}
            >
              {
                REQUEST_PRIORITY_LABELS[
                request.priority
                ]
              }
            </Text>
          </View>
        </View>

        <Section title="Informations">
          <InfoRow
            label="Personne"
            value={request.personName}
          />

          <InfoRow
            label="Créée par"
            value={
              request.createdByName ||
              'Non renseigné'
            }
          />

          <InfoRow
            label="Date de création"
            value={formatDate(
              request.createdAt
            )}
          />

          <InfoRow
            label="Conseiller"
            value={
              request.assignedCounselorName ||
              'Aucun conseiller affecté'
            }
          />
          {request.initialAppointmentId ? (
            <InfoRow
              label="Premier rendez-vous"
              value="Planifié"
            />
          ) : (
            <InfoRow
              label="Premier rendez-vous"
              value="Non planifié"
            />
          )}
        </Section>

        <Section title="Motif">
          <Text
            style={{
              color: COLORS.text,
              fontSize: 16,
              lineHeight: 23,
            }}
          >
            {request.reason}
          </Text>
        </Section>

        <Section title="Notes">
          <Text
            style={{
              color: request.notes
                ? COLORS.text
                : COLORS.muted,
              fontSize: 16,
              lineHeight: 23,
            }}
          >
            {request.notes || 'Aucune note.'}
          </Text>
        </Section>

        {hasAssignmentPermission &&
          (request.status === 'new' ||
            request.status === 'assigned') ? (
          <Section title="Affectation">
            <AppSelect
              label="Conseiller"
              placeholder="Sélectionner un conseiller"
              value={selectedCounselorId}
              options={counselorOptions}
              onValueChange={
                setSelectedCounselorId
              }
              required
            />

            <View style={{ marginTop: 16 }}>
              <AppButton
                title={
                  isSaving
                    ? 'Enregistrement...'
                    : request.assignedCounselorId
                      ? 'Modifier l’affectation'
                      : 'Affecter le conseiller'
                }
                disabled={isSaving}
                onPress={
                  handleAssignCounselor
                }
              />
            </View>
          </Section>
        ) : null}

        {canManageFirstAppointment ? (
          <Section title="Premier rendez-vous">
            <AppButton
              title={
                request.initialAppointmentId
                  ? "Voir le rendez-vous"
                  : "Planifier le premier rendez-vous"
              }
              onPress={() => {
                if (request.initialAppointmentId) {
                  router.push({
                    pathname: '/appointments/[id]',
                    params: {
                      id: request.initialAppointmentId,
                    },
                  });
                  return;
                }

                router.push({
                  pathname: '/appointments/form',
                  params: {
                    requestId: request.id,
                  },
                });
              }}
            />
          </Section>
        ) : null}

        <Section title="Historique">
          <InfoRow
            label="Création"
            value={formatDate(
              request.createdAt
            )}
          />

          {request.assignedAt ? (
            <InfoRow
              label={`Affectation à ${request.assignedCounselorName ??
                'un conseiller'
                }`}
              value={formatDate(
                request.assignedAt
              )}
            />
          ) : null}


          {request.cancelledAt ? (
            <InfoRow
              label={`Demande annulée par ${request.cancelledByName ??
                'un utilisateur'
                }`}
              value={formatDate(
                request.cancelledAt
              )}
            />
          ) : null}
        </Section>

        <View style={{ gap: 12 }}>


          {canCancelRequest ? (
            <AppButton
              title="Annuler la demande"
              onPress={handleCancelRequest}
            />
          ) : null}

          <AppButton
            title="Retour"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}