// app/user-create.tsx

import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppInput } from '../src/components/ui/AppInput';
import {
  AppSelect,
  AppSelectOption,
} from '../src/components/ui/AppSelect';
import { COLORS } from '../src/constants/theme';
import { useAuth } from '../src/contexts/AuthContext';
import { canManageUsers } from '../src/permissions';
import { createUserProfile } from '../src/services/user.service';
import { UserRole } from '../src/types/user.types';

type ActiveStatus = 'active' | 'inactive';

const roleOptions: AppSelectOption<UserRole>[] = [
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

const activeStatusOptions: AppSelectOption<ActiveStatus>[] = [
  {
    label: 'Actif',
    value: 'active',
  },
  {
    label: 'Inactif',
    value: 'inactive',
  },
];

function getErrorCode(error: unknown): string | undefined {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    return error.code;
  }

  return undefined;
}

function getErrorMessage(error: unknown): string {
  const errorCode = getErrorCode(error);

  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Cette adresse email est déjà utilisée par un autre compte.';

    case 'auth/invalid-email':
      return 'L’adresse email renseignée n’est pas valide.';

    case 'auth/weak-password':
      return 'Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.';

    case 'auth/network-request-failed':
      return 'La connexion au serveur a échoué. Vérifiez votre connexion Internet.';

    case 'auth/operation-not-allowed':
      return 'La création de comptes par email et mot de passe n’est pas activée dans Firebase Authentication.';

    case 'auth/too-many-requests':
      return 'Trop de tentatives ont été effectuées. Veuillez réessayer plus tard.';

    case 'permission-denied':
      return 'Vous n’avez pas l’autorisation de créer cet utilisateur. Vérifiez les règles Firestore.';

    case 'DISPLAY_NAME_REQUIRED':
      return 'Le nom complet est obligatoire.';

    case 'EMAIL_REQUIRED':
      return 'L’adresse email est obligatoire.';

    case 'PASSWORD_TOO_SHORT':
      return 'Le mot de passe doit contenir au moins 6 caractères.';

    default:
      break;
  }

  if (error instanceof Error) {
    switch (error.message) {
      case 'DISPLAY_NAME_REQUIRED':
        return 'Le nom complet est obligatoire.';

      case 'EMAIL_REQUIRED':
        return 'L’adresse email est obligatoire.';

      case 'PASSWORD_TOO_SHORT':
        return 'Le mot de passe doit contenir au moins 6 caractères.';

      default:
        break;
    }
  }

  return 'Une erreur est survenue pendant la création de l’utilisateur.';
}

export default function UserCreateScreen() {
  const { profile } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] =
    useState('');

  const [role, setRole] =
    useState<UserRole>('conseiller');

  const [activeStatus, setActiveStatus] =
    useState<ActiveStatus>('active');

  const [isSaving, setIsSaving] = useState(false);

  /*
   * Cette référence bloque immédiatement un second clic,
   * sans attendre la mise à jour du state React.
   */
  const isSubmittingRef = useRef(false);

  const hasPermission = canManageUsers(profile);

  function validateForm(): string | null {
    const normalizedDisplayName = displayName.trim();
    const normalizedEmail = email.trim();

    if (!normalizedDisplayName) {
      return 'Le nom complet est obligatoire.';
    }

    if (!normalizedEmail) {
      return 'L’adresse email est obligatoire.';
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return 'L’adresse email renseignée n’est pas valide.';
    }

    if (password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères.';
    }

    if (password !== passwordConfirmation) {
      return 'Les deux mots de passe ne correspondent pas.';
    }

    return null;
  }

  async function handleCreateUser() {
    if (isSubmittingRef.current) {
      return;
    }

    const validationMessage = validateForm();

    if (validationMessage) {
      Alert.alert(
        'Informations incomplètes',
        validationMessage
      );

      return;
    }

    isSubmittingRef.current = true;
    setIsSaving(true);

    try {
      await createUserProfile({
        displayName: displayName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        isActive: activeStatus === 'active',
      });

      /*
       * La navigation ne dépend plus du bouton OK de l’alerte.
       * Cela fonctionne aussi correctement sur le Web.
       */
      router.replace('/users');

      Alert.alert(
        'Utilisateur créé',
        'Le compte utilisateur a été créé avec succès.'
      );
    } catch (error) {
      console.error(
        'Erreur lors de la création de l’utilisateur :',
        error
      );

      Alert.alert(
        'Création impossible',
        getErrorMessage(error)
      );

      isSubmittingRef.current = false;
      setIsSaving(false);
    }
  }

  if (!hasPermission) {
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
            fontSize: 24,
            fontWeight: '700',
            color: COLORS.text,
            textAlign: 'center',
          }}
        >
          Accès refusé
        </Text>

        <Text
          style={{
            marginTop: 12,
            color: COLORS.muted,
            textAlign: 'center',
            lineHeight: 21,
          }}
        >
          Seuls le responsable et l’adjoint peuvent créer des
          utilisateurs.
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          style={{
            marginTop: 24,
            minHeight: 48,
            paddingHorizontal: 22,
            borderRadius: 12,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 16,
              fontWeight: '700',
            }}
          >
            Retour
          </Text>
        </TouchableOpacity>
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
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
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
              marginBottom: 6,
            }}
          >
            Nouvel utilisateur
          </Text>

          <Text
            style={{
              color: COLORS.muted,
              marginBottom: 22,
              lineHeight: 20,
            }}
          >
            Créez un compte et attribuez-lui un rôle dans le
            Ministère de la Relation d’Aide.
          </Text>

          <View
            style={{
              gap: 16,
            }}
          >
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
                placeholder="Ex. Jean Dupont"
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
                editable={!isSaving}
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
                Adresse email *
              </Text>

              <AppInput
                placeholder="Ex. jean@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSaving}
              />
            </View>

            <AppSelect<UserRole>
              label="Rôle"
              placeholder="Sélectionner un rôle"
              value={role}
              options={roleOptions}
              onValueChange={setRole}
              required
            />

            <AppSelect<ActiveStatus>
              label="Statut"
              placeholder="Sélectionner un statut"
              value={activeStatus}
              options={activeStatusOptions}
              onValueChange={setActiveStatus}
              required
            />

            <View style={{ gap: 6 }}>
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 14,
                  fontWeight: '600',
                }}
              >
                Mot de passe temporaire *
              </Text>

              <AppInput
                placeholder="Minimum 6 caractères"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSaving}
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
                Confirmer le mot de passe *
              </Text>

              <AppInput
                placeholder="Répéter le mot de passe"
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSaving}
              />
            </View>

            <View
              style={{
                backgroundColor: '#FFF8E1',
                borderWidth: 1,
                borderColor: '#FFE082',
                borderRadius: 12,
                padding: 14,
              }}
            >
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 13,
                  lineHeight: 19,
                }}
              >
                Communiquez le mot de passe temporaire à
                l’utilisateur de manière confidentielle. La gestion
                du changement obligatoire de mot de passe sera ajoutée
                ultérieurement.
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              disabled={isSaving}
              onPress={handleCreateUser}
              style={{
                minHeight: 52,
                borderRadius: 12,
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isSaving ? 0.65 : 1,
                marginTop: 4,
              }}
            >
              {isSaving ? (
                <>
                  <ActivityIndicator
                    color={COLORS.white}
                  />

                  <Text
                    style={{
                      marginTop: 6,
                      color: COLORS.white,
                      fontSize: 13,
                      fontWeight: '600',
                    }}
                  >
                    Création en cours...
                  </Text>
                </>
              ) : (
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 16,
                    fontWeight: '700',
                  }}
                >
                  Créer l’utilisateur
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              disabled={isSaving}
              onPress={() => router.back()}
              style={{
                minHeight: 50,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: COLORS.border,
                backgroundColor: COLORS.white,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isSaving ? 0.65 : 1,
              }}
            >
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                Annuler
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}