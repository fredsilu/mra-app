// app/request-form.tsx

import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
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
import { getPeople } from '../src/services/person.service';
import { createRequest } from '../src/services/request.service';
import { Person } from '../src/types/person.types';
import {
  REQUEST_PRIORITY_OPTIONS,
  RequestPriority,
} from '../src/types/request.types';

export default function RequestFormScreen() {
  const { profile } = useAuth();

  const [people, setPeople] = useState<Person[]>([]);
  const [personId, setPersonId] = useState('');
  const [priority, setPriority] =
    useState<RequestPriority>('normal');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] =
    useState(true);
  const [isSaving, setIsSaving] =
    useState(false);

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
    if (isSaving) {
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

    const normalizedReason = reason.trim();
    const normalizedNotes = notes.trim();

    if (!normalizedReason) {
      Alert.alert(
        'Validation',
        'Le motif est obligatoire.'
      );
      return;
    }

    const person = people.find(
      (item) => item.id === personId
    );

    if (!person) {
      Alert.alert(
        'Erreur',
        'La personne sélectionnée est introuvable.'
      );
      return;
    }

    try {
      setIsSaving(true);

      await createRequest({
        personId: person.id,
        personName: person.fullName,
        priority,
        reason: normalizedReason,
        notes: normalizedNotes,
        createdBy: profile.uid,
        createdByName: profile.displayName,
      });

      Alert.alert(
        'Succès',
        'Demande créée avec succès.'
      );

      router.back();
    } catch (error) {
      console.error(
        'Erreur lors de la création de la demande :',
        error
      );

      Alert.alert(
        'Erreur',
        "Impossible d'enregistrer la demande."
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
            marginBottom: 20,
          }}
        >
          Nouvelle demande
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
            options={REQUEST_PRIORITY_OPTIONS}
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
              Motif *
            </Text>

            <AppInput
              placeholder="Motif de la demande"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
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
              Notes
            </Text>

            <AppInput
              placeholder="Notes complémentaires"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          {people.length === 0 ? (
            <Text
              style={{
                color: '#B45309',
                lineHeight: 20,
              }}
            >
              Aucune personne active n’est disponible.
              Créez d’abord une fiche personne.
            </Text>
          ) : null}

          <AppButton
            title={
              isSaving
                ? 'Enregistrement...'
                : 'Créer la demande'
            }
            onPress={handleSave}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}