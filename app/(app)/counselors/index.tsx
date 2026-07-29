import {
  router,
  useFocusEffect,
} from 'expo-router';
import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { getAppointments } from '@/features/appointments/appointment.service';
import {
  APPOINTMENT_STATUS_LABELS,
  type Appointment,
} from '@/features/appointments/appointment.types';
import { getCases } from '@/features/cases/case.service';
import {
  CASE_STATUS_LABELS,
  type HelpCase,
} from '@/features/cases/case.types';
import { getInterviews } from '@/features/interviews/interview.service';
import {
  INTERVIEW_STATUS_LABELS,
  type Interview,
} from '@/features/interviews/interview.types';

function formatDate(value: { toDate: () => Date }): string {
  return value.toDate().toLocaleString('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function SectionHeader({
  title,
  count,
}: {
  title: string;
  count: number;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: '800',
          color: COLORS.text,
        }}
      >
        {title}
      </Text>

      <View
        style={{
          minWidth: 30,
          paddingHorizontal: 9,
          paddingVertical: 4,
          borderRadius: 999,
          backgroundColor: '#E8EEF9',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontWeight: '800',
            color: COLORS.text,
          }}
        >
          {count}
        </Text>
      </View>
    </View>
  );
}

function EmptyText({ children }: { children: string }) {
  return (
    <Text
      style={{
        color: COLORS.muted,
        lineHeight: 21,
      }}
    >
      {children}
    </Text>
  );
}

export default function CounselorHomeScreen() {
  const { profile, logout } = useAuth();

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);
  const [interviews, setInterviews] =
    useState<Interview[]>([]);
  const [cases, setCases] =
    useState<HelpCase[]>([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [isRefreshing, setIsRefreshing] =
    useState(false);
  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  const counselorId = profile?.uid ?? '';

  const loadData = useCallback(
    async (refresh = false) => {
      if (!counselorId) {
        setAppointments([]);
        setInterviews([]);
        setCases([]);
        setIsLoading(false);
        return;
      }

      try {
        if (refresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const [
          appointmentList,
          interviewList,
          caseList,
        ] = await Promise.all([
          getAppointments(),
          getInterviews(),
          getCases(),
        ]);

        setAppointments(
          appointmentList.filter(
            (item) =>
              item.counselorId === counselorId
          )
        );

        setInterviews(
          interviewList.filter(
            (item) =>
              item.counselorId === counselorId
          )
        );

        setCases(
          caseList.filter(
            (item) =>
              item.assignedCounselorId ===
              counselorId
          )
        );
      } catch (error) {
        console.error(
          'Erreur lors du chargement de l’espace conseiller :',
          error
        );

        Alert.alert(
          'Chargement impossible',
          'Impossible de charger vos rendez-vous, entretiens et dossiers.'
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [counselorId]
  );

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const upcomingAppointments = useMemo(
    () =>
      appointments
        .filter(
          (item) =>
            item.status === 'scheduled' ||
            item.status === 'confirmed'
        )
        .sort(
          (a, b) =>
            a.startAt.toMillis() -
            b.startAt.toMillis()
        ),
    [appointments]
  );

  const activeInterviews = useMemo(
    () =>
      interviews.filter(
        (item) => item.status === 'draft'
      ),
    [interviews]
  );

  const activeCases = useMemo(
    () =>
      cases.filter(
        (item) =>
          item.status !== 'closed' &&
          item.status !== 'cancelled'
      ),
    [cases]
  );

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error(
        'Erreur lors de la déconnexion :',
        error
      );

      Alert.alert(
        'Déconnexion impossible',
        'Une erreur est survenue pendant la déconnexion.'
      );
    } finally {
      setIsLoggingOut(false);
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
        <Text
          style={{
            marginTop: 12,
            color: COLORS.muted,
          }}
        >
          Chargement de votre espace...
        </Text>
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadData(true)}
          />
        }
        contentContainerStyle={{
          width: '100%',
          maxWidth: 760,
          alignSelf: 'center',
          padding: 18,
          paddingBottom: 50,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: '800',
            color: COLORS.text,
          }}
        >
          Espace Conseiller
        </Text>

        <Text
          style={{
            marginTop: 6,
            color: COLORS.muted,
          }}
        >
          Mes âmes, mes rendez-vous et mes suivis
        </Text>

        <Text
          style={{
            marginTop: 18,
            marginBottom: 28,
            fontSize: 18,
            fontWeight: '700',
            color: COLORS.text,
          }}
        >
          {profile?.displayName || 'Conseiller MRA'}
        </Text>

        <View
          style={{
            marginBottom: 26,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#ECECEC',
            backgroundColor: '#FFFFFF',
          }}
        >
          <SectionHeader
            title="Mes rendez-vous"
            count={upcomingAppointments.length}
          />

          {upcomingAppointments.length === 0 ? (
            <EmptyText>
              Aucun rendez-vous à venir ne vous est affecté.
            </EmptyText>
          ) : (
            upcomingAppointments.map((item) => (
              <Pressable
                key={item.id}
                onPress={() =>
                  router.push({
                    pathname: '/appointments/[id]',
                    params: { id: item.id },
                  })
                }
                style={{
                  paddingVertical: 13,
                  borderTopWidth: 1,
                  borderTopColor: '#EEEEEE',
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: COLORS.text,
                  }}
                >
                  {item.personName}
                </Text>
                <Text
                  style={{
                    marginTop: 4,
                    color: COLORS.muted,
                  }}
                >
                  {formatDate(item.startAt)}
                </Text>
                <Text
                  style={{
                    marginTop: 4,
                    fontWeight: '600',
                    color: COLORS.text,
                  }}
                >
                  {APPOINTMENT_STATUS_LABELS[item.status]}
                </Text>
              </Pressable>
            ))
          )}

          <View style={{ marginTop: 12 }}>
            <AppButton
              title="Voir tous mes rendez-vous"
              onPress={() =>
                router.push('/appointments')
              }
            />
          </View>
        </View>

        <View
          style={{
            marginBottom: 26,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#ECECEC',
            backgroundColor: '#FFFFFF',
          }}
        >
          <SectionHeader
            title="Entretiens en cours"
            count={activeInterviews.length}
          />

          {activeInterviews.length === 0 ? (
            <EmptyText>
              Aucun entretien en cours.
            </EmptyText>
          ) : (
            activeInterviews.map((item) => (
              <Pressable
                key={item.id}
                onPress={() =>
                  router.push({
                    pathname: '/interviews/[id]',
                    params: { id: item.id },
                  })
                }
                style={{
                  paddingVertical: 13,
                  borderTopWidth: 1,
                  borderTopColor: '#EEEEEE',
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: COLORS.text,
                  }}
                >
                  {item.personName}
                </Text>
                <Text
                  style={{
                    marginTop: 4,
                    color: COLORS.muted,
                  }}
                >
                  {item.interviewNumber} ·{' '}
                  {formatDate(item.startedAt)}
                </Text>
                <Text
                  style={{
                    marginTop: 4,
                    fontWeight: '600',
                    color: COLORS.text,
                  }}
                >
                  {INTERVIEW_STATUS_LABELS[item.status]}
                </Text>
              </Pressable>
            ))
          )}

          <View style={{ marginTop: 12 }}>
            <AppButton
              title="Voir tous mes entretiens"
              onPress={() =>
                router.push('/interviews')
              }
            />
          </View>
        </View>

        <View
          style={{
            marginBottom: 28,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#ECECEC',
            backgroundColor: '#FFFFFF',
          }}
        >
          <SectionHeader
            title="Mes suivis"
            count={activeCases.length}
          />

          {activeCases.length === 0 ? (
            <EmptyText>
              Aucun dossier actif ne vous est affecté.
            </EmptyText>
          ) : (
            activeCases.map((item) => (
              <View
                key={item.id}
                style={{
                  paddingVertical: 13,
                  borderTopWidth: 1,
                  borderTopColor: '#EEEEEE',
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: COLORS.text,
                  }}
                >
                  {item.requestTitle}
                </Text>
                <Text
                  style={{
                    marginTop: 4,
                    color: COLORS.muted,
                  }}
                >
                  {item.caseNumber || item.id}
                </Text>
                <Text
                  style={{
                    marginTop: 4,
                    fontWeight: '600',
                    color: COLORS.text,
                  }}
                >
                  {CASE_STATUS_LABELS[item.status]}
                </Text>
              </View>
            ))
          )}

          <View style={{ marginTop: 12 }}>
            <AppButton
              title="Voir tous mes suivis"
              onPress={() => router.push('/cases')}
            />
          </View>
        </View>

        <AppButton
          title={
            isLoggingOut
              ? 'Déconnexion...'
              : 'Se déconnecter'
          }
          disabled={isLoggingOut}
          onPress={handleLogout}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
