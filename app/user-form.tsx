// app/user-form.tsx

import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native';

import { AppButton } from '../src/components/ui/AppButton';
import { AppInput } from '../src/components/ui/AppInput';
import { AppSelect } from '../src/components/ui/AppSelect';
import { COLORS } from '../src/constants/theme';
import { useAuth } from '../src/contexts/AuthContext';
import {
    getUserById,
    updateUserProfile,
} from '../src/services/user.service';
import {
    UserProfile,
    UserRole,
} from '../src/types/user.types';

const roleOptions: Array<{
    label: string;
    value: UserRole;
}> = [
        {
            label: 'Responsable',
            value: 'responsable',
        },
        {
            label: 'Adjoint',
            value: 'adjoint',
        },
        {
            label: 'Secrétaire',
            value: 'secretaire',
        },
        {
            label: 'Conseiller',
            value: 'conseiller',
        },
        {
            label: 'Logistique',
            value: 'logistique',
        },
    ];

type ActiveStatus = 'active' | 'inactive';

const activeOptions: Array<{
    label: string;
    value: ActiveStatus;
}> = [
        {
            label: 'Actif',
            value: 'active',
        },
        {
            label: 'Inactif',
            value: 'inactive',
        },
    ];

export default function UserFormScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const { profile } = useAuth();

    const [user, setUser] =
        useState<UserProfile | null>(null);

    const [displayName, setDisplayName] =
        useState('');

    const [role, setRole] =
        useState<UserRole>();

    const [activeStatus, setActiveStatus] =
        useState<ActiveStatus>();

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);

    const isCurrentUser =
        Boolean(id) && profile?.uid === id;

    useEffect(() => {
        async function loadUser() {
            if (!id) {
                Alert.alert(
                    'Erreur',
                    'Identifiant utilisateur manquant.'
                );

                router.back();
                return;
            }

            try {
                const result = await getUserById(id);

                if (!result) {
                    Alert.alert(
                        'Erreur',
                        'Utilisateur introuvable.'
                    );

                    router.back();
                    return;
                }

                setUser(result);
                setDisplayName(result.displayName);
                setRole(result.role);
                setActiveStatus(
                    result.isActive ? 'active' : 'inactive'
                );
            } catch (error) {
                console.error(
                    'Erreur lors du chargement de l’utilisateur :',
                    error
                );

                Alert.alert(
                    'Erreur',
                    'Impossible de charger cet utilisateur.'
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadUser();
    }, [id]);

    async function handleSave() {
        if (
            !id ||
            !user ||
            isSaving
        ) {
            return;
        }

        const normalizedDisplayName =
            displayName.trim();

        if (!normalizedDisplayName) {
            Alert.alert(
                'Validation',
                'Le nom est obligatoire.'
            );
            return;
        }

        if (!role) {
            Alert.alert(
                'Validation',
                'Le rôle est obligatoire.'
            );
            return;
        }

        if (!activeStatus) {
            Alert.alert(
                'Validation',
                'Le statut est obligatoire.'
            );
            return;
        }

        const requestedIsActive =
            activeStatus === 'active';

        if (
            isCurrentUser &&
            role !== user.role
        ) {
            Alert.alert(
                'Action interdite',
                'Vous ne pouvez pas modifier votre propre rôle.'
            );
            return;
        }

        if (
            isCurrentUser &&
            !requestedIsActive
        ) {
            Alert.alert(
                'Action interdite',
                'Vous ne pouvez pas désactiver votre propre compte.'
            );
            return;
        }

        try {
            setIsSaving(true);

            await updateUserProfile(id, {
                displayName: normalizedDisplayName,
                role: isCurrentUser
                    ? user.role
                    : role,
                isActive: isCurrentUser
                    ? true
                    : requestedIsActive,
            });

            Alert.alert(
                'Succès',
                'Utilisateur modifié avec succès.'
            );

            router.back();
        } catch (error) {
            console.error(
                'Erreur lors de la modification de l’utilisateur :',
                error
            );

            Alert.alert(
                'Erreur',
                'Impossible de modifier cet utilisateur.'
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
                    backgroundColor: COLORS.light,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        color: COLORS.text,
                    }}
                >
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
                        marginBottom: 20,
                    }}
                >
                    Modifier l’utilisateur
                </Text>

                <View style={{ gap: 16 }}>
                    <View style={{ gap: 6 }}>
                        <Text
                            style={{
                                color: COLORS.text,
                                fontSize: 14,
                                fontWeight: '600',
                            }}
                        >
                            Nom complet *
                        </Text>

                        <AppInput
                            placeholder="Nom complet"
                            value={displayName}
                            onChangeText={setDisplayName}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={{ gap: 6 }}>
                        <Text
                            style={{
                                color: COLORS.text,
                                fontSize: 14,
                                fontWeight: '600',
                            }}
                        >
                            Email
                        </Text>

                        <AppInput
                            placeholder="Email"
                            value={user?.email ?? ''}
                            editable={false}
                            autoCapitalize="none"
                        />

                        <Text
                            style={{
                                color: COLORS.muted,
                                fontSize: 13,
                                lineHeight: 18,
                            }}
                        >
                            L’adresse email ne peut pas être
                            modifiée depuis cet écran.
                        </Text>
                    </View>

                    <AppSelect
                        label="Rôle"
                        placeholder="Sélectionner le rôle"
                        value={role}
                        options={roleOptions}
                        onValueChange={(value) => {
                            if (isCurrentUser) {
                                Alert.alert(
                                    'Action interdite',
                                    'Vous ne pouvez pas modifier votre propre rôle.'
                                );
                                return;
                            }

                            setRole(value);
                        }}
                        required
                    />

                    <AppSelect
                        label="Statut"
                        placeholder="Sélectionner le statut"
                        value={activeStatus}
                        options={activeOptions}
                        onValueChange={(value) => {
                            if (
                                isCurrentUser &&
                                value === 'inactive'
                            ) {
                                Alert.alert(
                                    'Action interdite',
                                    'Vous ne pouvez pas désactiver votre propre compte.'
                                );
                                return;
                            }

                            setActiveStatus(value);
                        }}
                        required
                    />

                    {isCurrentUser ? (
                        <View
                            style={{
                                padding: 14,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: '#EF6C00',
                                backgroundColor: '#FFF3E0',
                            }}
                        >
                            <Text
                                style={{
                                    color: '#E65100',
                                    fontWeight: '600',
                                    lineHeight: 20,
                                }}
                            >
                                Pour des raisons de sécurité, vous
                                ne pouvez pas modifier votre propre
                                rôle ni désactiver votre propre
                                compte.
                            </Text>
                        </View>
                    ) : null}

                    <AppButton
                        title={
                            isSaving
                                ? 'Enregistrement...'
                                : 'Enregistrer'
                        }
                        onPress={handleSave}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}