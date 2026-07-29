// app/(app)/case-activities/form.tsx

import {
  router,
  useLocalSearchParams,
} from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import {
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { AppSelect } from '@/components/ui/AppSelect';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import {
  createCaseActivity,
  getCaseActivity,
  updateCaseActivity,
} from '@/features/case-activities/case-activity.service';
import {
  CASE_ACTIVITY_TYPE_OPTIONS,
  type CaseActivity,
  type CaseActivityType,
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

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function formatDateInput(
  value: Date
): string {
  return [
    value.getFullYear(),
    '-',
    pad(value.getMonth() + 1),
    '-',
    pad(value.getDate()),
    ' ',
    pad(value.getHours()),
    ':',
    pad(value.getMinutes()),
  ].join('');
}

function parseDateInput(
  value: string
): Date | null {
  const normalizedValue = value.trim();

  const match = normalizedValue.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2}))?$/
  );

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hours = Number(match[4] ?? 0);
  const minutes = Number(match[5] ?? 0);

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  const result = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    0,
    0
  );

  if (
    result.getFullYear() !== year ||
    result.getMonth() !== month - 1 ||
    result.getDate() !== day ||
    result.getHours() !== hours ||
    result.getMinutes() !== minutes
  ) {
    return null;
  }

  return result;
}

function FieldLabel({
  children,
  required = false,
}: {
  children: string;
  required?: boolean;
}) {
  return (
    <Text
      style={{
        marginBottom: 6,
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
      }}
    >
      {children}
      {required ? ' *' : ''}
    </Text>
  );
}

function ErrorText({
  children,
}: {
  children?: string;
}) {
  if (!children) {
    return null;
  }

  return (
    <Text
      style={{
        marginTop: 5,
        color: '#C62828',
        fontSize: 13,
      }}
    >
      {children}
    </Text>
  );
}

function getErrorMessage(
  error: unknown
): string {
  const code =
    error instanceof Error
      ? error.message
      : '';

  switch (code) {
    case 'CASE_ID_REQUIRED':
      return 'Le dossier est obligatoire.';

    case 'CASE_NOT_FOUND':
      return 'Le dossier est introuvable.';

    case 'CASE_ALREADY_CLOSED':
      return 'Aucune activité ne peut être enregistrée dans un dossier clôturé.';

    case 'CASE_ACTIVITY_NOT_FOUND':
      return 'Cette activité est introuvable.';

    case 'CASE_ACTIVITY_TYPE_INVALID':
      return 'Le type d’activité sélectionné est invalide.';

    case 'CASE_ACTIVITY_TITLE_REQUIRED':
      return 'Le titre est obligatoire.';

    case 'CASE_ACTIVITY_DESCRIPTION_REQUIRED':
      return 'La description est obligatoire.';

    case 'CASE_ACTIVITY_DATE_REQUIRED':
      return 'La date de réalisation est obligatoire.';

    case 'USER_ID_REQUIRED':
      return 'Votre session utilisateur est invalide.';

    default:
      return 'Une erreur est survenue pendant l’enregistrement.';
  }
}

export default function CaseActivityFormScreen() {
  const params = useLocalSearchParams<{
    caseId?: string | string[];
    id?: string | string[];
  }>();

  const { profile } = useAuth();

  const caseIdParam = getParam(params.caseId);
  const activityId = getParam(params.id);

  const isEditing = Boolean(activityId);

  const [currentCase, setCurrentCase] =
    useState<Case | null>(null);

  const [currentActivity, setCurrentActivity] =
    useState<CaseActivity | null>(null);

  const [type, setType] =
    useState<CaseActivityType>('follow_up');

  const [title, setTitle] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [performedAt, setPerformedAt] =
    useState(
      formatDateInput(new Date())
    );

  const [nextAction, setNextAction] =
    useState('');

  const [
    nextAppointmentId,
    setNextAppointmentId,
  ] = useState('');

  const [typeError, setTypeError] =
    useState('');

  const [titleError, setTitleError] =
    useState('');

  const [
    descriptionError,
    setDescriptionError,
  ] = useState('');

  const [dateError, setDateError] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);

        if (isEditing) {
          const activity =
            await getCaseActivity(activityId);

          if (!activity) {
            Alert.alert(
              'Activité introuvable',
              'Cette activité n’existe pas ou n’est plus accessible.',
              [
                {
                  text: 'Retour',
                  onPress: () => router.back(),
                },
              ]
            );

            return;
          }

          const caseResult =
            await getCase(activity.caseId);

          if (!caseResult) {
            Alert.alert(
              'Dossier introuvable',
              'Le dossier lié à cette activité est introuvable.',
              [
                {
                  text: 'Retour',
                  onPress: () => router.back(),
                },
              ]
            );

            return;
          }

          if (!isMounted) {
            return;
          }

          setCurrentActivity(activity);
          setCurrentCase(caseResult);

          setType(activity.type);
          setTitle(activity.title);
          setDescription(activity.description);

          setPerformedAt(
            formatDateInput(
              activity.performedAt.toDate()
            )
          );

          setNextAction(
            activity.nextAction ?? ''
          );

          setNextAppointmentId(
            activity.nextAppointmentId ?? ''
          );

          return;
        }

        if (!caseIdParam) {
          Alert.alert(
            'Dossier manquant',
            'Aucun dossier n’a été transmis au formulaire.',
            [
              {
                text: 'Retour',
                onPress: () => router.back(),
              },
            ]
          );

          return;
        }

        const caseResult =
          await getCase(caseIdParam);

        if (!caseResult) {
          Alert.alert(
            'Dossier introuvable',
            'Ce dossier n’existe pas ou n’est plus accessible.',
            [
              {
                text: 'Retour',
                onPress: () => router.back(),
              },
            ]
          );

          return;
        }

        if (!isMounted) {
          return;
        }

        setCurrentCase(caseResult);
      } catch (error) {
        console.error(
          'Erreur lors du chargement du formulaire d’activité :',
          error
        );

        Alert.alert(
          'Erreur',
          'Impossible de charger le formulaire.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [
    activityId,
    caseIdParam,
    isEditing,
  ]);

  function clearErrors(): void {
    setTypeError('');
    setTitleError('');
    setDescriptionError('');
    setDateError('');
  }

  function validateForm(): Date | null {
    clearErrors();

    let isValid = true;

    if (!type) {
      setTypeError(
        'Sélectionnez un type d’activité.'
      );

      isValid = false;
    }

    if (!title.trim()) {
      setTitleError(
        'Le titre est obligatoire.'
      );

      isValid = false;
    }

    if (!description.trim()) {
      setDescriptionError(
        'La description est obligatoire.'
      );

      isValid = false;
    }

    const parsedDate =
      parseDateInput(performedAt);

    if (!parsedDate) {
      setDateError(
        'Utilisez le format AAAA-MM-JJ HH:mm.'
      );

      isValid = false;
    }

    if (!isValid || !parsedDate) {
      return null;
    }

    return parsedDate;
  }

  async function handleSave(): Promise<void> {
    if (isSaving) {
      return;
    }

    if (!currentCase) {
      Alert.alert(
        'Erreur',
        'Le dossier est introuvable.'
      );

      return;
    }

    if (currentCase.status === 'closed') {
      Alert.alert(
        'Dossier clôturé',
        'Aucune activité ne peut être ajoutée ou modifiée dans ce dossier.'
      );

      return;
    }

    const userId =
      profile?.uid?.trim() ?? '';

    if (!userId) {
      Alert.alert(
        'Session invalide',
        'Impossible d’identifier l’utilisateur connecté.'
      );

      return;
    }

    const parsedDate = validateForm();

    if (!parsedDate) {
      return;
    }

    try {
      setIsSaving(true);

      const performedAtTimestamp =
        Timestamp.fromDate(parsedDate);

      if (
        isEditing &&
        currentActivity
      ) {
        await updateCaseActivity(
          currentActivity.id,
          {
            type,
            title: title.trim(),
            description:
              description.trim(),

            performedAt:
              performedAtTimestamp,

            nextAction:
              nextAction.trim() ||
              undefined,

            nextAppointmentId:
              nextAppointmentId.trim() ||
              undefined,

            attachmentIds:
              currentActivity.attachmentIds,

            updatedBy: userId,

            updatedByName:
              profile?.displayName?.trim() ||
              undefined,
          }
        );

        Alert.alert(
          'Activité modifiée',
          'Les modifications ont été enregistrées.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );

        return;
      }

      const newActivityId =
        await createCaseActivity({
          caseId: currentCase.id,

          type,
          title: title.trim(),
          description:
            description.trim(),

          performedAt:
            performedAtTimestamp,

          nextAction:
            nextAction.trim() ||
            undefined,

          nextAppointmentId:
            nextAppointmentId.trim() ||
            undefined,

          attachmentIds: [],

          createdBy: userId,

          createdByName:
            profile?.displayName?.trim() ||
            undefined,
        });

      router.replace({
        pathname: '/case-activities/[id]',
        params: {
          id: newActivityId,
          caseId: currentCase.id,
        },
      });
    } catch (error) {
      console.error(
        'Erreur lors de l’enregistrement de l’activité :',
        error
      );

      Alert.alert(
        'Enregistrement impossible',
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

        <Text
          style={{
            marginTop: 12,
            color: COLORS.muted,
          }}
        >
          Chargement du formulaire...
        </Text>
      </SafeAreaView>
    );
  }

  if (!currentCase) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.light,
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
            Dossier introuvable
          </Text>

          <View
            style={{
              width: '100%',
              maxWidth: 420,
              marginTop: 24,
            }}
          >
            <AppButton
              title="Retour"
              onPress={() => router.back()}
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
            {isEditing
              ? 'Modifier l’activité'
              : 'Nouvelle activité'}
          </Text>

          <Text
            style={{
              marginTop: 6,
              color: COLORS.muted,
              lineHeight: 20,
            }}
          >
            Enregistrez une action réalisée dans le cadre de l’accompagnement.
          </Text>

          <View
            style={{
              marginTop: 18,
              padding: 14,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#ECECEC',
              backgroundColor: '#FFFFFF',
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: COLORS.muted,
              }}
            >
              Dossier
            </Text>

            <Text
              style={{
                marginTop: 3,
                fontSize: 17,
                fontWeight: '700',
                color: COLORS.text,
              }}
            >
              {currentCase.caseNumber ||
                currentCase.id}
            </Text>

            <Text
              style={{
                marginTop: 8,
                fontSize: 16,
                fontWeight: '600',
                color: COLORS.text,
              }}
            >
              {currentCase.personName}
            </Text>

            <Text
              style={{
                marginTop: 4,
                color: COLORS.muted,
              }}
            >
              Conseiller :{' '}
              {currentCase.counselorName}
            </Text>
          </View>

          {currentCase.status ===
          'closed' ? (
            <View
              style={{
                marginTop: 16,
                padding: 13,
                borderRadius: 10,
                backgroundColor: '#FDECEC',
              }}
            >
              <Text
                style={{
                  color: '#C62828',
                  fontWeight: '600',
                  lineHeight: 20,
                }}
              >
                Ce dossier est clôturé. Cette activité ne peut pas être enregistrée ou modifiée.
              </Text>
            </View>
          ) : null}

          <View
            style={{
              marginTop: 22,
              gap: 18,
            }}
          >
            <View>
              <AppSelect
                label="Type d’activité"
                placeholder="Sélectionner un type"
                value={type}
                options={
                  CASE_ACTIVITY_TYPE_OPTIONS
                }
                onValueChange={(value) => {
                  setType(value);
                  setTypeError('');
                }}
                required
                error={typeError}
              />
            </View>

            <View>
              <FieldLabel required>
                Titre
              </FieldLabel>

              <AppInput
                value={title}
                onChangeText={(value) => {
                  setTitle(value);
                  setTitleError('');
                }}
                placeholder="Ex. Appel de suivi"
                editable={!isSaving}
                maxLength={150}
                returnKeyType="next"
              />

              <ErrorText>
                {titleError}
              </ErrorText>
            </View>

            <View>
              <FieldLabel required>
                Description
              </FieldLabel>

              <AppInput
                value={description}
                onChangeText={(value) => {
                  setDescription(value);
                  setDescriptionError('');
                }}
                placeholder="Décrivez l’activité réalisée..."
                editable={!isSaving}
                multiline
                textAlignVertical="top"
                maxLength={5000}
                style={{
                  minHeight: 150,
                }}
              />

              <ErrorText>
                {descriptionError}
              </ErrorText>
            </View>

            <View>
              <FieldLabel required>
                Date et heure de réalisation
              </FieldLabel>

              <AppInput
                value={performedAt}
                onChangeText={(value) => {
                  setPerformedAt(value);
                  setDateError('');
                }}
                placeholder="AAAA-MM-JJ HH:mm"
                editable={!isSaving}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numbers-and-punctuation"
              />

              <Text
                style={{
                  marginTop: 5,
                  color: COLORS.muted,
                  fontSize: 13,
                }}
              >
                Format : 2026-07-29 16:30
              </Text>

              <ErrorText>
                {dateError}
              </ErrorText>
            </View>

            <View>
              <FieldLabel>
                Prochaine action
              </FieldLabel>

              <AppInput
                value={nextAction}
                onChangeText={setNextAction}
                placeholder="Ex. Rappeler la personne dans une semaine"
                editable={!isSaving}
                multiline
                textAlignVertical="top"
                maxLength={1000}
                style={{
                  minHeight: 90,
                }}
              />
            </View>

            <View>
              <FieldLabel>
                Identifiant du prochain rendez-vous
              </FieldLabel>

              <AppInput
                value={nextAppointmentId}
                onChangeText={
                  setNextAppointmentId
                }
                placeholder="Facultatif"
                editable={!isSaving}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View
            style={{
              marginTop: 28,
            }}
          >
            <AppButton
              title={
                isSaving
                  ? 'Enregistrement...'
                  : isEditing
                    ? 'Enregistrer les modifications'
                    : 'Enregistrer l’activité'
              }
              onPress={() => {
                void handleSave();
              }}
              disabled={
                isSaving ||
                currentCase.status ===
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
              title="Annuler"
              onPress={() => {
                if (!isSaving) {
                  router.back();
                }
              }}
              disabled={isSaving}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}