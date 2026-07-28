// app/(app)/appointments/index.tsx
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import { COLORS } from '@/constants/theme';
import { getAppointments } from '@/features/appointments/appointment.service';
import {
  Appointment,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPE_LABELS,
} from '@/features/appointments/appointment.types';

function formatDate(appointment: Appointment): string {
  return appointment.startAt.toDate().toLocaleString(
    'fr-FR',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    }
  );
}

function getStatusColor(
  status: Appointment['status']
): string {
  switch (status) {
    case 'scheduled':
      return '#1976D2';
    case 'confirmed':
      return '#7B1FA2';
    case 'completed':
      return '#2E7D32';
    case 'cancelled':
      return '#D32F2F';
    case 'no_show':
      return '#F57C00';
    default:
      return '#616161';
  }
}

export default function AppointmentsScreen() {
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);
  const [isLoading, setIsLoading] =
    useState(true);

  const loadAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      setAppointments(await getAppointments());
    } catch (error) {
      console.error(
        'Erreur lors du chargement des rendez-vous :',
        error
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, [loadAppointments])
  );

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
        <Text style={{ marginTop: 12 }}>
          Chargement...
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
      <View style={{ flex: 1, padding: 16 }}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: '700',
            color: COLORS.text,
            marginBottom: 20,
          }}
        >
          Rendez-vous
        </Text>

        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: 'center',
                marginTop: 40,
                color: COLORS.muted,
              }}
            >
              Aucun rendez-vous planifié.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/appointments/[id]',
                  params: { id: item.id },
                })
              }
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#ECECEC',
                padding: 14,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  color: COLORS.muted,
                  fontSize: 13,
                }}
              >
                {item.appointmentNumber}
              </Text>

              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '700',
                  color: COLORS.text,
                  marginTop: 4,
                }}
              >
                {item.personName}
              </Text>

              <Text style={{ marginTop: 6 }}>
                {APPOINTMENT_TYPE_LABELS[item.type]}
              </Text>

              <Text style={{ marginTop: 4 }}>
                {formatDate(item)}
              </Text>

              <Text style={{ marginTop: 4 }}>
                Conseiller : {item.counselorName}
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  color: getStatusColor(item.status),
                  fontWeight: '700',
                }}
              >
                {APPOINTMENT_STATUS_LABELS[item.status]}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
