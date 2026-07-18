// app/person-form.tsx

import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, Text, View } from 'react-native';

import { AppButton } from '../src/components/ui/AppButton';
import { AppInput } from '../src/components/ui/AppInput';
import { COLORS } from '../src/constants/theme';
import {
  createPerson,
  getPersonById,
  updatePerson,
} from '../src/services/person.service';

export default function PersonFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
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
        console.error('Erreur lors du chargement de la personne :', error);

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

  async function handleSave() {
    const normalizedFullName = fullName.trim();

    if (!normalizedFullName) {
      Alert.alert('Validation', 'Le nom est obligatoire.');
      return;
    }

    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      if (id) {
        await updatePerson(id, {
          fullName: normalizedFullName,
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
        });
      } else {
        await createPerson({
          fullName: normalizedFullName,
          gender: 'male',
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
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
        <Text style={{ color: COLORS.text }}>Chargement...</Text>
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
          onChangeText={setFullName}
          autoCapitalize="words"
        />

        <AppInput
          placeholder="Téléphone"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
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

        <AppButton
          title={
            isSaving
              ? 'Enregistrement...'
              : id
                ? 'Modifier'
                : 'Enregistrer'
          }
          onPress={handleSave}
        />
      </View>
    </SafeAreaView>
  );
}