// app/(app)/case-activities/[id].tsx

import {
    router,
    useFocusEffect,
    useLocalSearchParams,
} from 'expo-router';
import {
    useCallback,
    useState,
} from 'react';
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
import {
    getCaseActivity,
} from '@/features/case-activities/case-activity.service';
import {
    CASE_ACTIVITY_TYPE_LABELS,
    type CaseActivity,
} from '@/features/case-activities/case-activity.types';
import {
    getCase,
} from '@/features/cases/case.service';
import type {
    Case,
} from '@/features/cases/case.types';

function getParam(
    value: string | string[] | undefined
): string {
    if (Array.isArray(value)) {
        return value[0]?.trim() ?? '';
    }

    return value?.trim() ?? '';
}

function formatDate(
    value: CaseActivity['performedAt']
): string {
    try {
        return value
            .toDate()
            .toLocaleString('fr-FR', {
                dateStyle: 'long',
                timeStyle: 'short',
            });
    } catch {
        return '-';
    }
}

function formatCreatedDate(
    value: CaseActivity['createdAt']
): string {
    try {
        return value
            .toDate()
            .toLocaleString('fr-FR', {
                dateStyle: 'medium',
                timeStyle: 'short',
            });
    } catch {
        return '-';
    }
}

function Section({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <View
            style={{
                marginTop: 18,
            }}
        >
            <Text
                style={{
                    color: COLORS.muted,
                    fontSize: 13,
                    fontWeight: '600',
                    marginBottom: 6,
                }}
            >
                {label}
            </Text>

            <View
                style={{
                    padding: 14,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#ECECEC',
                    backgroundColor: '#FFFFFF',
                }}
            >
                {children}
            </View>
        </View>
    );
}

export default function CaseActivityDetailScreen() {
    const params = useLocalSearchParams<{
        id?: string | string[];
    }>();

    const activityId = getParam(params.id);

    const [activity, setActivity] =
        useState<CaseActivity | null>(null);

    const [currentCase, setCurrentCase] =
        useState<Case | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const loadData = useCallback(
        async () => {
            if (!activityId) {
                setActivity(null);
                setCurrentCase(null);
                setIsLoading(false);

                Alert.alert(
                    'Erreur',
                    'Identifiant de l’activité manquant.'
                );

                return;
            }

            try {
                setIsLoading(true);

                const activityResult =
                    await getCaseActivity(activityId);

                if (!activityResult) {
                    setActivity(null);
                    setCurrentCase(null);

                    Alert.alert(
                        'Activité introuvable',
                        'Cette activité n’existe pas ou n’est plus accessible.'
                    );

                    return;
                }

                const caseResult =
                    await getCase(
                        activityResult.caseId
                    );

                setActivity(activityResult);
                setCurrentCase(caseResult);
            } catch (error) {
                console.error(
                    'Erreur lors du chargement de l’activité :',
                    error
                );

                Alert.alert(
                    'Erreur',
                    'Impossible de charger cette activité.'
                );
            } finally {
                setIsLoading(false);
            }
        },
        [activityId]
    );

    useFocusEffect(
        useCallback(() => {
            void loadData();
        }, [loadData])
    );

    function handleEdit(): void {
        if (!activity) {
            return;
        }

        if (
            currentCase?.status === 'closed'
        ) {
            Alert.alert(
                'Dossier clôturé',
                'Cette activité ne peut plus être modifiée.'
            );

            return;
        }

        router.push({
            pathname:
                '/case-activities/form',
            params: {
                id: activity.id,
                caseId: activity.caseId,
            },
        });
    }

    function handleBackToActivities(): void {
        if (!activity) {
            router.back();
            return;
        }

        router.replace({
            pathname:
                '/case-activities',
            params: {
                caseId: activity.caseId,
            },
        });
    }

    if (isLoading) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
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
                    Chargement de l’activité...
                </Text>
            </SafeAreaView>
        );
    }

    if (!activity) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor:
                        COLORS.light,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        padding: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: '700',
                            color: COLORS.text,
                            textAlign: 'center',
                        }}
                    >
                        Activité introuvable
                    </Text>

                    <Text
                        style={{
                            marginTop: 10,
                            color: COLORS.muted,
                            textAlign: 'center',
                            lineHeight: 21,
                        }}
                    >
                        Impossible d’afficher cette activité.
                    </Text>

                    <View
                        style={{
                            marginTop: 24,
                            width: '100%',
                            maxWidth: 420,
                        }}
                    >
                        <AppButton
                            title="Retour"
                            onPress={() =>
                                router.back()
                            }
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
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
                    width: '100%',
                    maxWidth: 760,
                    alignSelf: 'center',
                    padding: 16,
                    paddingBottom: 50,
                }}
            >
                <Text
                    style={{
                        fontSize: 26,
                        fontWeight: '700',
                        color: COLORS.text,
                    }}
                >
                    Détail de l’activité
                </Text>

                <Text
                    style={{
                        marginTop: 6,
                        color: COLORS.muted,
                    }}
                >
                    {activity.activityNumber}
                </Text>

                <View
                    style={{
                        marginTop: 18,
                        padding: 16,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#ECECEC',
                        backgroundColor:
                            '#FFFFFF',
                    }}
                >
                    <Text
                        style={{
                            color: '#2E7D32',
                            fontSize: 14,
                            fontWeight: '700',
                        }}
                    >
                        {
                            CASE_ACTIVITY_TYPE_LABELS[
                            activity.type
                            ]
                        }
                    </Text>

                    <Text
                        style={{
                            marginTop: 8,
                            fontSize: 22,
                            fontWeight: '800',
                            color: COLORS.text,
                        }}
                    >
                        {activity.title}
                    </Text>

                    <Text
                        style={{
                            marginTop: 10,
                            color: COLORS.muted,
                        }}
                    >
                        Réalisée le{' '}
                        {formatDate(
                            activity.performedAt
                        )}
                    </Text>
                </View>

                <Section label="Dossier">
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: '700',
                            color: COLORS.text,
                        }}
                    >
                        {activity.caseNumber ||
                            activity.caseId}
                    </Text>

                    <Text
                        style={{
                            marginTop: 8,
                            fontSize: 16,
                            fontWeight: '600',
                            color: COLORS.text,
                        }}
                    >
                        {activity.personName}
                    </Text>

                    <Text
                        style={{
                            marginTop: 5,
                            color: COLORS.muted,
                        }}
                    >
                        Conseiller :{' '}
                        {activity.counselorName}
                    </Text>
                </Section>

                <Section label="Description">
                    <Text
                        style={{
                            color: COLORS.text,
                            fontSize: 16,
                            lineHeight: 24,
                        }}
                    >
                        {activity.description}
                    </Text>
                </Section>

                {activity.nextAction ? (
                    <Section label="Prochaine action">
                        <Text
                            style={{
                                color: COLORS.text,
                                fontSize: 16,
                                lineHeight: 24,
                            }}
                        >
                            {activity.nextAction}
                        </Text>
                    </Section>
                ) : null}

                {activity.nextAppointmentId ? (
                    <Section label="Prochain rendez-vous">
                        <Text
                            style={{
                                color: COLORS.text,
                                fontSize: 16,
                            }}
                        >
                            {
                                activity.nextAppointmentId
                            }
                        </Text>
                    </Section>
                ) : null}

                <Section label="Informations d’enregistrement">
                    <Text
                        style={{
                            color: COLORS.text,
                            lineHeight: 22,
                        }}
                    >
                        Enregistrée par :{' '}
                        {activity.createdByName ||
                            activity.createdBy}
                    </Text>

                    <Text
                        style={{
                            marginTop: 5,
                            color: COLORS.muted,
                            lineHeight: 22,
                        }}
                    >
                        Créée le :{' '}
                        {formatCreatedDate(
                            activity.createdAt
                        )}
                    </Text>

                    {activity.updatedAt ? (
                        <Text
                            style={{
                                marginTop: 5,
                                color: COLORS.muted,
                                lineHeight: 22,
                            }}
                        >
                            Dernière modification :{' '}
                            {formatCreatedDate(
                                activity.updatedAt
                            )}
                        </Text>
                    ) : null}
                </Section>

                {activity.attachmentIds.length >
                    0 ? (
                    <Section label="Pièces jointes">
                        <Text
                            style={{
                                color: COLORS.text,
                            }}
                        >
                            {
                                activity
                                    .attachmentIds
                                    .length
                            }{' '}
                            pièce(s) jointe(s)
                        </Text>
                    </Section>
                ) : null}

                <View
                    style={{
                        marginTop: 28,
                    }}
                >
                    <AppButton
                        title="Modifier l’activité"
                        onPress={handleEdit}
                        disabled={
                            currentCase?.status ===
                            'closed'
                        }
                    />
                </View>

                <View
                    style={{
                        marginTop: 12,
                    }}
                >
                    <AppButton
                        title="Retour aux activités"
                        onPress={
                            handleBackToActivities
                        }
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}