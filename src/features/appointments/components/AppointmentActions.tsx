//src/features/appointments/components/AppointmentActions.tsx
import { router } from 'expo-router';
import type { ReactNode } from 'react';

import { AppButton } from '@/components/ui/AppButton';
import {
    cancelAppointment,
    confirmAppointment,
    markAppointmentNoShow,
} from '@/features/appointments/appointment.service';
import type { Appointment } from '@/features/appointments/appointment.types';
import type { UserRole } from '@/features/users/user.types';
import { canConfirmAppointment } from '@/permissions';

type UserProfile = Parameters<
    typeof canConfirmAppointment
>[0];

type AppointmentAction = (
    appointmentId: string,
    userId: string,
    userName: string,
    userRole?: UserRole
) => Promise<void>;

type ExecuteAction = (
    title: string,
    message: string,
    action: AppointmentAction
) => Promise<void>;

type AppointmentActionsProps = {
    appointment: Appointment;
    interviewId: string | null;
    profile: UserProfile;
    isSaving: boolean;
    executeAction: ExecuteAction;
};

export function AppointmentActions({
    appointment,
    interviewId,
    profile,
    isSaving,
    executeAction,
}: AppointmentActionsProps): ReactNode {
    const isActive =
        appointment.status === 'scheduled' ||
        appointment.status === 'confirmed';

    const canConfirm = canConfirmAppointment(
        profile,
        appointment.counselorId
    );

    const canOpenInterview =
        appointment.status === 'confirmed' ||
        appointment.status === 'completed';

    function openInterview() {
        if (interviewId) {
            router.push({
                pathname: '/interviews/[id]',
                params: {
                    id: interviewId,
                },
            });

            return;
        }

        router.push({
            pathname: '/interviews/form',
            params: {
                appointmentId: appointment.id,
            },
        });
    }

    return (
        <>
            {appointment.status === 'scheduled' &&
                canConfirm ? (
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

            {canOpenInterview ? (
                <AppButton
                    title={
                        interviewId
                            ? 'Voir l’entretien'
                            : 'Démarrer l’entretien'
                    }
                    disabled={isSaving}
                    onPress={openInterview}
                />
            ) : null}

            {isActive ? (
                <>
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
        </>
    );
}