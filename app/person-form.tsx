// app/person-form.tsx
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

import { AppButton } from '../src/components/ui/AppButton';
import { AppInput } from '../src/components/ui/AppInput';
import { AppSelect } from '../src/components/ui/AppSelect';
import { COLORS } from '../src/constants/theme';
import {
  createPerson,
  findPeopleByExactName,
  findPersonByPhone,
  getPersonById,
  updatePerson,
} from '../src/services/person.service';
import {
  ChurchStatus,
  ContactChannel,
  Gender,
  Person,
  PersonOrigin,
} from '../src/types/person.types';

const genderOptions: Array<{
  label: string;
  value: Gender;
}> = [
    {
      label: 'Homme',
      value: 'male',
    },
    {
      label: 'Femme',
      value: 'female',
    },
  ];

const churchStatusOptions: Array<{
  label: string;
  value: ChurchStatus;
}> = [
    {
      label: 'Visiteur',
      value: 'visitor',
    },
    {
      label: 'Nouveau',
      value: 'new',
    },
    {
      label: 'Membre',
      value: 'member',
    },
    {
      label: 'Ancien membre',
      value: 'former_member',
    },
    {
      label: 'Externe',
      value: 'external',
    },
  ];

const originOptions: Array<{
  label: string;
  value: PersonOrigin;
}> = [
    {
      label: 'Culte',
      value: 'service',
    },
    {
      label: 'Famille',
      value: 'family',
    },
    {
      label: 'Évangélisation',
      value: 'evangelism',
    },
    {
      label: 'Recommandation',
      value: 'recommendation',
    },
    {
      label: 'Réseaux sociaux',
      value: 'social_media',
    },
    {
      label: 'Site Internet',
      value: 'website',
    },
    {
      label: 'Autre',
      value: 'other',
    },
  ];

const contactChannelOptions: Array<{
  label: string;
  value: ContactChannel;
}> = [
    {
      label: 'WhatsApp',
      value: 'whatsapp',
    },
    {
      label: 'Téléphone',
      value: 'phone',
    },
    {
      label: 'En présentiel',
      value: 'in_person',
    },
    {
      label: 'Email',
      value: 'email',
    },
    {
      label: 'Site Internet',
      value: 'website',
    },
    {
      label: 'Autre',
      value: 'other',
    },
  ];

export default function PersonFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<Gender | undefined>();
  const [churchStatus, setChurchStatus] =
    useState<ChurchStatus | undefined>();
  const [origin, setOrigin] = useState<PersonOrigin | undefined>();
  const [contactChannel, setContactChannel] =
    useState<ContactChannel | undefined>();

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const [phoneDuplicate, setPhoneDuplicate] =
    useState<Person | null>(null);
  const [nameDuplicates, setNameDuplicates] = useState<Person[]>([]);

  const [fullNameError, setFullNameError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [churchStatusError, setChurchStatusError] = useState('');
  const [originError, setOriginError] = useState('');
  const [contactChannelError, setContactChannelError] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
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
        setGender(person.gender);
        setChurchStatus(person.churchStatus);
        setOrigin(person.origin);
        setContactChannel(person.contactChannel);
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

  function clearDuplicateWarnings() {
    setPhoneDuplicate(null);
    setNameDuplicates([]);
  }

  function handleFullNameChange(value: string) {
    setFullName(value);
    setFullNameError('');
    setNameDuplicates([]);
  }

  function handlePhoneChange(value: string) {
    setPhone(value);
    setPhoneDuplicate(null);
  }

  function validateForm(): boolean {
    let isValid = true;

    setFullNameError('');
    setGenderError('');
    setChurchStatusError('');
    setOriginError('');
    setContactChannelError('');

    if (!fullName.trim()) {
      setFullNameError('Le nom complet est obligatoire.');
      isValid = false;
    }

    if (!gender) {
      setGenderError('Le sexe est obligatoire.');
      isValid = false;
    }

    if (!churchStatus) {
      setChurchStatusError(
        'Le statut dans l’Église est obligatoire.'
      );
      isValid = false;
    }

    if (!origin) {
      setOriginError('L’origine est obligatoire.');
      isValid = false;
    }

    if (!contactChannel) {
      setContactChannelError(
        'Le canal de contact est obligatoire.'
      );
      isValid = false;
    }

    return isValid;
  }

  function openPerson(personId: string) {
    clearDuplicateWarnings();

    router.replace({
      pathname: '/person-form',
      params: {
        id: personId,
      },
    });
  }

  async function savePerson() {
    if (
      !gender ||
      !churchStatus ||
      !origin ||
      !contactChannel
    ) {
      Alert.alert(
        'Validation',
        'Veuillez compléter tous les champs obligatoires.'
      );
      return;
    }

    try {
      setIsSaving(true);

      const personData = {
        fullName: fullName.trim(),
        gender,
        churchStatus,
        origin,
        contactChannel,
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
      };

      if (id) {
        await updatePerson(id, personData);
      } else {
        await createPerson({
          ...personData,
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
    if (!validateForm()) {
      Alert.alert(
        'Validation',
        'Veuillez compléter les champs obligatoires.'
      );
      return;
    }

    if (isSaving) {
      return;
    }

    clearDuplicateWarnings();

    try {
      setIsSaving(true);

      const normalizedPhoneInput = phone.trim();

      if (normalizedPhoneInput) {
        const existingPerson = await findPersonByPhone(
          normalizedPhoneInput
        );

        if (existingPerson && existingPerson.id !== id) {
          setPhoneDuplicate(existingPerson);
          return;
        }
      }

      const existingPeople = await findPeopleByExactName(
        fullName.trim()
      );

      const otherPeopleWithSameName = existingPeople.filter(
        (person) => person.id !== id
      );

      if (otherPeopleWithSameName.length > 0) {
        setNameDuplicates(otherPeopleWithSameName);
        return;
      }

      await savePerson();
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
    setNameDuplicates([]);
    await savePerson();
  }

  async function archiveCurrentPerson() {
    if (!id || isSaving || isArchiving) {
      return;
    }

    try {
      setIsArchiving(true);

      await updatePerson(id, {
        isArchived: true,
      });

      Alert.alert(
        'Personne archivée',
        'La fiche a été archivée avec succès.'
      );

      router.back();
    } catch (error) {
      console.error(
        'Erreur lors de l’archivage de la personne :',
        error
      );

      Alert.alert(
        'Erreur',
        'Impossible d’archiver cette personne.'
      );
    } finally {
      setIsArchiving(false);
    }
  }

  function handleArchive() {
    if (!id || isSaving || isArchiving) {
      return;
    }

    const message =
      `Voulez-vous vraiment archiver la fiche de ${fullName.trim()} ? ` +
      'Elle ne sera plus visible dans la liste active, mais elle ne sera pas supprimée.';

    if (Platform.OS === 'web') {
      const isConfirmed = window.confirm(message);

      if (isConfirmed) {
        archiveCurrentPerson();
      }

      return;
    }

    Alert.alert(
      'Archiver la personne',
      message,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Archiver',
          style: 'destructive',
          onPress: archiveCurrentPerson,
        },
      ]
    );
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
            marginBottom: 20,
            color: COLORS.text,
          }}
        >
          {id ? 'Modifier la personne' : 'Nouvelle personne'}
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
              value={fullName}
              onChangeText={handleFullNameChange}
              autoCapitalize="words"
              style={{
                borderColor: fullNameError
                  ? '#C62828'
                  : COLORS.border,
              }}
            />

            {fullNameError ? (
              <Text
                style={{
                  color: '#C62828',
                  fontSize: 13,
                }}
              >
                {fullNameError}
              </Text>
            ) : null}
          </View>

          <AppSelect
            label="Sexe"
            placeholder="Sélectionner le sexe"
            value={gender}
            options={genderOptions}
            onValueChange={(value) => {
              setGender(value);
              setGenderError('');
            }}
            required
            error={genderError}
          />

          <AppSelect
            label="Statut dans l’Église"
            placeholder="Sélectionner le statut"
            value={churchStatus}
            options={churchStatusOptions}
            onValueChange={(value) => {
              setChurchStatus(value);
              setChurchStatusError('');
            }}
            required
            error={churchStatusError}
          />

          <AppSelect
            label="Origine"
            placeholder="Sélectionner l’origine"
            value={origin}
            options={originOptions}
            onValueChange={(value) => {
              setOrigin(value);
              setOriginError('');
            }}
            required
            error={originError}
          />

          <AppSelect
            label="Canal de contact"
            placeholder="Sélectionner le canal"
            value={contactChannel}
            options={contactChannelOptions}
            onValueChange={(value) => {
              setContactChannel(value);
              setContactChannelError('');
            }}
            required
            error={contactChannelError}
          />

          <View style={{ gap: 6 }}>
            <Text
              style={{
                color: COLORS.text,
                fontSize: 14,
                fontWeight: '600',
              }}
            >
              Téléphone
            </Text>

            <AppInput
              placeholder="Téléphone"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={handlePhoneChange}
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
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
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
              Adresse
            </Text>

            <AppInput
              placeholder="Adresse"
              value={address}
              onChangeText={setAddress}
            />
          </View>

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
                    backgroundColor: COLORS.white,
                    gap: 6,
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
                  ? 'Enregistrement...'
                  : id
                    ? 'Modifier'
                    : 'Enregistrer'
              }
              onPress={handleSave}
            />
          )}

          {id &&
            !phoneDuplicate &&
            nameDuplicates.length === 0 && (
              <View
                style={{
                  marginTop: 8,
                  paddingTop: 18,
                  borderTopWidth: 1,
                  borderTopColor: COLORS.border,
                }}
              >
                <Text
                  style={{
                    marginBottom: 12,
                    color: COLORS.muted,
                    lineHeight: 20,
                  }}
                >
                  L’archivage retire la personne de la liste active sans
                  supprimer son dossier.
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleArchive}
                  disabled={isSaving || isArchiving}
                  style={{
                    backgroundColor: '#C62828',
                    paddingVertical: 15,
                    borderRadius: 12,
                    alignItems: 'center',
                    opacity: isSaving || isArchiving ? 0.6 : 1,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: 16,
                      fontWeight: '700',
                    }}
                  >
                    {isArchiving
                      ? 'Archivage...'
                      : 'Archiver la personne'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}