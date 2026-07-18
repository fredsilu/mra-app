// app/person-form.tsx

import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, Text, View } from 'react-native';

import { AppButton } from '../src/components/ui/AppButton';
import { AppInput } from '../src/components/ui/AppInput';
import { COLORS } from '../src/constants/theme';
import {
  createPerson,
  findPeopleByExactName,
  findPersonByPhone,
  getPersonById,
  updatePerson,
} from '../src/services/person.service';
import { Person } from '../src/types/person.types';

export default function PersonFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const [phoneDuplicate, setPhoneDuplicate] = useState<Person | null>(null);
  const [nameDuplicates, setNameDuplicates] = useState<Person[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(id));

  useEffect(() => {
    async function loadPerson() {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const person = await getPersonById(id);

        if (!person) {
          Alert.alert('Erreur', 'Personne introuvable.');
          router.back();
          return;
        }

        setFullName(person.fullName);
        setPhone(person.phone ?? '');
        setEmail(person.email ?? '');
        setAddress(person.address ?? '');
      } catch (error) {
        console.error(
          'Erreur lors du chargement de la personne :',
          error
        );

        Alert.alert(
          'Erreur',
          'Impossible de charger les informations de la personne.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadPerson();
  }, [id]);

  function handleFullNameChange(value: string) {
    setFullName(value);
    setNameDuplicates([]);
  }

  function handlePhoneChange(value: string) {
    setPhone(value);
    setPhoneDuplicate(null);
  }

  function openPerson(personId: string) {
    setPhoneDuplicate(null);
    setNameDuplicates([]);

    router.replace({
      pathname: '/person-form',
      params: {
        id: personId,
      },
    });
  }

  async function savePerson(normalizedFullName: string) {
    try {
      setIsSaving(true);

      const personData = {
        fullName: normalizedFullName,
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
      };

      if (id) {
        await updatePerson(id, personData);
      } else {
        await createPerson({
          ...personData,
          gender: 'male',
          churchStatus: 'visitor',
          source: 'other',
          assignedCounselorIds: [],
          isArchived: false,
        });
      }

      Alert.alert(
        'Succès',
        id
          ? 'La personne a été modifiée avec succès.'
          : 'La personne a été créée avec succès.'
      );

      router.back();
    } catch (error) {
      console.error(
        id
          ? 'Erreur lors de la modification de la personne :'
          : 'Erreur lors de la création de la personne :',
        error
      );

      Alert.alert(
        'Erreur',
        id
          ? 'Impossible de modifier la personne.'
          : "Impossible d'enregistrer la personne."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSave() {
    const normalizedFullName = fullName.trim();

    if (!normalizedFullName) {
      Alert.alert('Validation', 'Le nom est obligatoire.');
      return;
    }

    if (isSaving) {
      return;
    }

    setPhoneDuplicate(null);
    setNameDuplicates([]);

    try {
      setIsSaving(true);

      const normalizedPhoneInput = phone.trim();

      /*
       * Le téléphone est prioritaire.
       * Un téléphone identique bloque l'enregistrement.
       */
      if (normalizedPhoneInput) {
        const existingPerson = await findPersonByPhone(
          normalizedPhoneInput
        );

        const isAnotherPerson =
          existingPerson && existingPerson.id !== id;

        if (isAnotherPerson) {
          setPhoneDuplicate(existingPerson);
          return;
        }
      }

      /*
       * Le nom identique produit seulement un avertissement.
       * La fiche courante est exclue en mode modification.
       */
      const existingPeople = await findPeopleByExactName(
        normalizedFullName
      );

      const otherPeopleWithSameName = existingPeople.filter(
        (person) => person.id !== id
      );

      if (otherPeopleWithSameName.length > 0) {
        setNameDuplicates(otherPeopleWithSameName);
        return;
      }

      await savePerson(normalizedFullName);
    } catch (error) {
      console.error(
        'Erreur lors de la vérification des doublons :',
        error
      );

      Alert.alert(
        'Erreur',
        'Impossible de vérifier les éventuels doublons.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function continueDespiteNameDuplicate() {
    const normalizedFullName = fullName.trim();

    setNameDuplicates([]);

    await savePerson(normalizedFullName);
  }

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.light,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: COLORS.text }}>
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
        padding: 16,
      }}
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: '700',
          marginBottom: 20,
          color: COLORS.text,
        }}
      >
        {id ? 'Modifier la personne' : 'Nouvelle personne'}
      </Text>

      <View style={{ gap: 16 }}>
        <AppInput
          placeholder="Nom complet"
          value={fullName}
          onChangeText={handleFullNameChange}
          autoCapitalize="words"
        />

        <AppInput
          placeholder="Téléphone"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={handlePhoneChange}
        />

        <AppInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <AppInput
          placeholder="Adresse"
          value={address}
          onChangeText={setAddress}
        />

        {phoneDuplicate && (
          <View
            style={{
              padding: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#C62828',
              backgroundColor: '#FFEBEE',
              gap: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#B71C1C',
              }}
            >
              Téléphone déjà utilisé
            </Text>

            <Text
              style={{
                color: COLORS.text,
                lineHeight: 21,
              }}
            >
              Ce numéro appartient déjà à{' '}
              <Text style={{ fontWeight: '700' }}>
                {phoneDuplicate.fullName}
              </Text>
              , dossier {phoneDuplicate.mraNumber}.
            </Text>

            {phoneDuplicate.isArchived && (
              <Text
                style={{
                  color: '#B71C1C',
                  fontWeight: '600',
                }}
              >
                Cette fiche est actuellement archivée.
              </Text>
            )}

            <AppButton
              title="Ouvrir la fiche existante"
              onPress={() => openPerson(phoneDuplicate.id)}
            />

            <AppButton
              title="Fermer l’avertissement"
              onPress={() => setPhoneDuplicate(null)}
            />
          </View>
        )}

        {nameDuplicates.length > 0 && (
          <View
            style={{
              padding: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#EF6C00',
              backgroundColor: '#FFF3E0',
              gap: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#E65100',
              }}
            >
              Nom déjà enregistré
            </Text>

            <Text
              style={{
                color: COLORS.text,
                lineHeight: 21,
              }}
            >
              {nameDuplicates.length === 1
                ? 'Une personne porte déjà exactement ce nom.'
                : `${nameDuplicates.length} personnes portent déjà exactement ce nom.`}
            </Text>

            {nameDuplicates.map((person) => (
              <View
                key={person.id}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: '#FFFFFF',
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    color: COLORS.text,
                    fontWeight: '700',
                  }}
                >
                  {person.fullName}
                </Text>

                <Text style={{ color: COLORS.text }}>
                  {person.mraNumber}
                  {person.phone ? ` • ${person.phone}` : ''}
                </Text>

                {person.isArchived && (
                  <Text
                    style={{
                      color: '#E65100',
                      fontWeight: '600',
                    }}
                  >
                    Fiche archivée
                  </Text>
                )}

                <AppButton
                  title="Ouvrir cette fiche"
                  onPress={() => openPerson(person.id)}
                />
              </View>
            ))}

            <AppButton
              title="Continuer malgré l’avertissement"
              onPress={continueDespiteNameDuplicate}
            />

            <AppButton
              title="Annuler"
              onPress={() => setNameDuplicates([])}
            />
          </View>
        )}

        {!phoneDuplicate && nameDuplicates.length === 0 && (
          <AppButton
            title={
              isSaving
                ? 'Vérification...'
                : id
                  ? 'Modifier'
                  : 'Enregistrer'
            }
            onPress={handleSave}
          />
        )}
      </View>
    </SafeAreaView>
  );
}