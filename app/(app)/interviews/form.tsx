// app/(app)/interviews/form.tsx
import {
    router,
    useLocalSearchParams,
} from 'expo-router';
import {
    useEffect,
    useState,
} from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { getAppointment } from '@/features/appointments/appointment.service';
import type { Appointment } from '@/features/appointments/appointment.types';
import {
    createInterview,
    getInterviewByAppointmentId,
} from '@/features/interviews/interview.service';

function showMessage(
    title: string,
    message: string
): void {
    if (Platform.OS === 'web') {
        window.alert(`${title}\n\n${message}`);
        return;
    }

    Alert.alert(title, message);
}

export default function InterviewFormScreen() {
    const { appointmentId } =
        useLocalSearchParams<{
            appointmentId?: string;
        }>();

    const { profile } = useAuth();

    const [
        appointment,
        setAppointment,
    ] = useState<Appointment | null>(null);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    useEffect(() => {
        async function load(): Promise<void> {
            if (!appointmentId) {
                showMessage(
                    'Erreur',
                    'Le rendez-vous est obligatoire.'
                );

                router.back();
                return;
            }

            try {
                setIsLoading(true);

                const existing =
                    await getInterviewByAppointmentId(
                        appointmentId
                    );

                /*
                 * Un rendez-vous ne peut avoir
                 * qu'un seul entretien.
                 */
                if (existing) {
                    router.replace({
                        pathname:
                            '/interviews/[id]',
                        params: {
                            id: existing.id,
                        },
                    });

                    return;
                }

                const result =
                    await getAppointment(
                        appointmentId
                    );

                if (!result) {
                    showMessage(
                        'Erreur',
                        'Rendez-vous introuvable.'
                    );

                    router.back();
                    return;
                }

                /*
                 * Un entretien peut être créé
                 * pour un rendez-vous confirmé
                 * ou déjà réalisé.
                 */
                if (
                    result.status !== 'confirmed' &&
                    result.status !== 'completed'
                ) {
                    showMessage(
                        'Action impossible',
                        'Le rendez-vous doit être confirmé ou réalisé avant la création de l’entretien.'
                    );

                    router.back();
                    return;
                }

                setAppointment(result);
            } catch (error) {
                console.error(
                    'Erreur lors de la préparation de l’entretien :',
                    error
                );

                const message =
                    error instanceof Error
                        ? error.message
                        : 'Erreur inconnue';

                showMessage(
                    'Erreur',
                    `Impossible de préparer l’entretien : ${message}`
                );
            } finally {
                setIsLoading(false);
            }
        }

        load();
    }, [appointmentId]);

    async function handleCreate(): Promise<void> {
        if (
            !appointment ||
            !profile ||
            isSaving
        ) {
            return;
        }

        const canCreate =
            appointment.counselorId ===
            profile.uid ||
            profile.role ===
            'responsable' ||
            profile.role ===
            'adjoint';

        if (!canCreate) {
            showMessage(
                'Accès refusé',
                'Seul le conseiller affecté, le responsable ou son adjoint peut créer cet entretien.'
            );

            return;
        }

        try {
            setIsSaving(true);

            const interviewId =
                await createInterview({
                    appointmentId:
                        appointment.id,

                    requestId:
                        appointment.requestId,

                    personId:
                        appointment.personId,

                    personName:
                        appointment.personName,

                    counselorId:
                        appointment.counselorId,

                    counselorName:
                        appointment.counselorName,

                    createdBy:
                        profile.uid,

                    createdByName:
                        profile.displayName,
                });

            router.replace({
                pathname:
                    '/interviews/[id]',
                params: {
                    id: interviewId,
                },
            });
        } catch (error) {
            console.error(
                'Erreur lors de la création de l’entretien :',
                error
            );

            if (
                error instanceof Error &&
                error.message ===
                'INTERVIEW_ALREADY_EXISTS'
            ) {
                const existing =
                    await getInterviewByAppointmentId(
                        appointment.id
                    );

                if (existing) {
                    router.replace({
                        pathname:
                            '/interviews/[id]',
                        params: {
                            id: existing.id,
                        },
                    });

                    return;
                }
            }

            const message =
                error instanceof Error
                    ? error.message
                    : 'Erreur inconnue';

            showMessage(
                'Erreur',
                `Impossible de créer l’entretien : ${message}`
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
                    justifyContent:
                        'center',
                    backgroundColor:
                        COLORS.light,
                }}
            >
                <ActivityIndicator
                    size="large"
                />

                <Text
                    style={{
                        marginTop: 12,
                        color: COLORS.muted,
                    }}
                >
                    Préparation de l’entretien...
                </Text>
            </SafeAreaView>
        );
    }

    if (!appointment) {
        return null;
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor:
                    COLORS.light,
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
                        fontSize: 26,
                        fontWeight: '700',
                        color: COLORS.text,
                    }}
                >
                    Créer l’entretien
                </Text>

                <Text
                    style={{
                        marginTop: 8,
                        color: COLORS.muted,
                        lineHeight: 21,
                    }}
                >
                    Un compte rendu d’entretien sera créé
                    pour ce rendez-vous.
                </Text>

                <View
                    style={{
                        marginTop: 20,
                        marginBottom: 24,
                        padding: 16,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor:
                            '#ECECEC',
                        backgroundColor:
                            '#FFFFFF',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 19,
                            fontWeight: '700',
                            color: COLORS.text,
                        }}
                    >
                        {appointment.personName}
                    </Text>

                    <Text
                        style={{
                            marginTop: 10,
                            color: COLORS.text,
                        }}
                    >
                        Conseiller :{' '}
                        {appointment.counselorName}
                    </Text>

                    <Text
                        style={{
                            marginTop: 6,
                            color: COLORS.text,
                        }}
                    >
                        Rendez-vous :{' '}
                        {appointment.appointmentNumber}
                    </Text>
                </View>

                <View style={{ gap: 12 }}>
                    <AppButton
                        title={
                            isSaving
                                ? 'Création en cours...'
                                : 'Créer l’entretien'
                        }
                        disabled={isSaving}
                        onPress={handleCreate}
                    />

                    <AppButton
                        title="Retour"
                        disabled={isSaving}
                        onPress={() =>
                            router.back()
                        }
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}