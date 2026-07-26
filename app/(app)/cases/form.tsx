// app/case-form.tsx

import { router } from 'expo-router';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Alert,
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

import { createCase } from '@/features/cases/case.service';
import { getPeople } from '@/features/people/person.service';

import {
  CASE_PRIORITY_OPTIONS,
  CasePriority,
} from '@/features/cases/case.types';

import { Person } from '@/features/people/person.types';

function getCreationErrorMessage(
  error: unknown
): string {
  if (!(error instanceof Error)) {
    return (
      "Impossible d'enregistrer le dossier."
    );
  }

  switch (error.message) {
    case 'PERSON_REQUIRED':
      return 'Sélectionnez une personne.';

    case 'REQUEST_TITLE_REQUIRED':
      return 'Le motif principal est obligatoire.';

    case 'REQUEST_DESCRIPTION_REQUIRED':
      return 'La description de la demande est obligatoire.';

    case 'CREATED_BY_REQUIRED':
      return (
        'Votre profil utilisateur est introuvable.'
      );

    default:
      return (
        "Impossible d'enregistrer le dossier."
      );
  }
}

export default function CaseFormScreen() {
  const { profile } = useAuth();

  const [people, setPeople] = useState<
    Person[]
  >([]);

  const [personId, setPersonId] =
    useState('');

  const [priority, setPriority] =
    useState<CasePriority>('normal');

  const [requestTitle, setRequestTitle] =
    useState('');

  const [
    requestDescription,
    setRequestDescription,
  ] = useState('');

  const [notes, setNotes] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const isSubmittingRef =
    useRef(false);

  useEffect(() => {
    async function loadPeople() {
      try {
        const list = await getPeople();

        const activePeople = list.filter(
          (person) => !person.isArchived
        );

        setPeople(activePeople);
      } catch (error) {
        console.error(
          'Erreur lors du chargement des personnes :',
          error
        );

        Alert.alert(
          'Erreur',
          'Impossible de charger les personnes.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadPeople();
  }, []);

  const peopleOptions = useMemo(
    () =>
      people.map((person) => ({
        label: person.mraNumber
          ? `${person.mraNumber} - ${person.fullName}`
          : person.fullName,

        value: person.id,
      })),
    [people]
  );

  async function handleSave() {
    if (isSubmittingRef.current) {
      return;
    }

    if (!profile) {
      Alert.alert(
        'Erreur',
        'Votre profil utilisateur est introuvable.'
      );

      return;
    }

    if (!personId) {
      Alert.alert(
        'Validation',
        'Sélectionnez une personne.'
      );

      return;
    }

    const normalizedTitle =
      requestTitle.trim();

    if (!normalizedTitle) {
      Alert.alert(
        'Validation',
        'Le motif principal est obligatoire.'
      );

      return;
    }

    const normalizedDescription =
      requestDescription.trim();

    if (!normalizedDescription) {
      Alert.alert(
        'Validation',
        'La description de la demande est obligatoire.'
      );

      return;
    }

    const selectedPerson =
      people.find(
        (person) =>
          person.id === personId
      );

    if (!selectedPerson) {
      Alert.alert(
        'Erreur',
        'La personne sélectionnée est introuvable.'
      );

      return;
    }

    isSubmittingRef.current = true;
    setIsSaving(true);

    try {
      await createCase({
        personId: selectedPerson.id,

        priority,

        requestTitle:
          normalizedTitle,

        requestDescription:
          normalizedDescription,

        notes: notes.trim(),

        createdBy: profile.uid,
      });

      router.replace('/cases');

      Alert.alert(
        'Dossier créé',
        'Le dossier de relation d’aide a été ouvert avec succès.'
      );
    } catch (error) {
      console.error(
        'Erreur lors de la création du dossier :',
        error
      );

      Alert.alert(
        'Création impossible',
        getCreationErrorMessage(error)
      );

      isSubmittingRef.current = false;
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
        <Text>Chargement...</Text>
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
            marginBottom: 6,
          }}
        >
          Nouveau dossier
        </Text>

        <Text
          style={{
            color: COLORS.muted,
            lineHeight: 20,
            marginBottom: 20,
          }}
        >
          Ouvrez un nouveau dossier de relation
          d’aide pour une personne existante.
        </Text>

        <View style={{ gap: 16 }}>
          <AppSelect
            label="Personne"
            placeholder="Sélectionner une personne"
            value={personId}
            options={peopleOptions}
            onValueChange={setPersonId}
            required
          />

          <AppSelect
            label="Priorité"
            placeholder="Choisir la priorité"
            value={priority}
            options={CASE_PRIORITY_OPTIONS}
            onValueChange={setPriority}
            required
          />

          <View style={{ gap: 6 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: COLORS.text,
              }}
            >
              Motif principal *
            </Text>

            <AppInput
              placeholder="Ex. Difficultés familiales"
              value={requestTitle}
              onChangeText={setRequestTitle}
              editable={!isSaving}
            />
          </View>

          <View style={{ gap: 6 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: COLORS.text,
              }}
            >
              Demande formulée *
            </Text>

            <AppInput
              placeholder="Décrivez la demande exprimée par la personne"
              value={requestDescription}
              onChangeText={
                setRequestDescription
              }
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              editable={!isSaving}
            />
          </View>

          <View style={{ gap: 6 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: COLORS.text,
              }}
            >
              Notes complémentaires
            </Text>

            <AppInput
              placeholder="Informations complémentaires utiles"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isSaving}
            />
          </View>

          {people.length === 0 ? (
            <Text
              style={{
                color: '#B45309',
                lineHeight: 20,
              }}
            >
              Aucune personne active n’est
              disponible. Créez d’abord une fiche
              personne.
            </Text>
          ) : null}

          <AppButton
            title={
              isSaving
                ? 'Ouverture du dossier...'
                : 'Ouvrir le dossier'
            }
            onPress={handleSave}
          />

          <AppButton
            title="Annuler"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}