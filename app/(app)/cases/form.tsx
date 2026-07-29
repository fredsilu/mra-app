// app/(app)/cases/form.tsx

import {
  router,
  useLocalSearchParams,
} from 'expo-router';
import {
  useCallback,
  useEffect,
  useRef,
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
import { useAuth } from '@/contexts/AuthContext';
import {
  createCase,
  getCaseByContractId,
} from '@/features/cases/case.service';
import { getContract } from '@/features/contracts/contract.service';
import type { Contract } from '@/features/contracts/contract.types';

function getCreationErrorMessage(
  error: unknown
): string {
  if (!(error instanceof Error)) {
    return "Impossible d'ouvrir le dossier.";
  }

  switch (error.message) {
    case 'CONTRACT_ID_REQUIRED':
      return 'Le contrat est obligatoire.';
    case 'CONTRACT_NOT_FOUND':
      return 'Le contrat est introuvable.';
    case 'CASE_ALREADY_EXISTS':
      return 'Un dossier a déjà été ouvert pour ce contrat.';
    case 'PERSON_ALREADY_HAS_OPEN_CASE':
      return 'Cette personne possède déjà un dossier en cours.';
    case 'INTERVIEW_NOT_FOUND':
      return "L'entretien lié au contrat est introuvable.";
    case 'REQUEST_NOT_FOUND':
      return 'La demande liée au contrat est introuvable.';
    case 'USER_ID_REQUIRED':
      return 'Votre profil utilisateur est introuvable.';
    default:
      return "Impossible d'ouvrir le dossier.";
  }
}

export default function CaseFormScreen() {
  const { contractId } = useLocalSearchParams<{
    contractId?: string;
  }>();
  const { profile } = useAuth();

  const [contract, setContract] =
    useState<Contract | null>(null);
  const [isLoading, setIsLoading] =
    useState(true);
  const [isSaving, setIsSaving] =
    useState(false);

  const isSubmittingRef = useRef(false);

  const loadContract = useCallback(async () => {
    const normalizedContractId =
      contractId?.trim();

    if (!normalizedContractId) {
      Alert.alert(
        'Erreur',
        "Le contrat signé n'a pas été indiqué."
      );
      router.back();
      return;
    }

    try {
      setIsLoading(true);

      const [loadedContract, existingCase] =
        await Promise.all([
          getContract(normalizedContractId),
          getCaseByContractId(normalizedContractId),
        ]);

      if (!loadedContract) {
        Alert.alert(
          'Erreur',
          'Le contrat est introuvable.'
        );
        router.back();
        return;
      }

      if (existingCase) {
        router.replace({
          pathname: '/cases/[id]',
          params: { id: existingCase.id },
        });
        return;
      }

      setContract(loadedContract);
    } catch (error) {
      console.error(
        'Erreur lors du chargement du contrat :',
        error
      );

      Alert.alert(
        'Erreur',
        'Impossible de préparer l’ouverture du dossier.'
      );
      router.back();
    } finally {
      setIsLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    void loadContract();
  }, [loadContract]);

  async function handleSave() {
    if (
      isSubmittingRef.current ||
      !contract
    ) {
      return;
    }

    if (!profile) {
      Alert.alert(
        'Erreur',
        'Votre profil utilisateur est introuvable.'
      );
      return;
    }

    isSubmittingRef.current = true;
    setIsSaving(true);

    try {
      const caseId = await createCase({
        contractId: contract.id,
        interviewId: contract.interviewId,
        appointmentId: contract.appointmentId,
        requestId: contract.requestId,
        personId: contract.personId,
        personName: contract.personName,
        counselorId: contract.counselorId,
        counselorName: contract.counselorName,
        createdBy: profile.uid,
        createdByName: profile.displayName,
      });

      Alert.alert(
        'Dossier ouvert',
        'Le dossier d’accompagnement a été créé avec succès.'
      );

      router.replace({
        pathname: '/cases/[id]',
        params: { id: caseId },
      });
    } catch (error) {
      console.error(
        'Erreur lors de la création du dossier :',
        error
      );

      Alert.alert(
        'Ouverture impossible',
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
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!contract) {
    return null;
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
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: '700',
            color: COLORS.text,
            marginBottom: 6,
          }}
        >
          Ouvrir le dossier
        </Text>

        <Text
          style={{
            color: COLORS.muted,
            lineHeight: 20,
            marginBottom: 20,
          }}
        >
          Le contrat papier a été signé. Confirmez
          maintenant l’ouverture du dossier
          d’accompagnement.
        </Text>

        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Text
            style={{
              fontWeight: '700',
              fontSize: 18,
              marginBottom: 12,
            }}
          >
            Informations
          </Text>

          <Text>
            Contrat : {contract.contractNumber}
          </Text>
          <Text style={{ marginTop: 8 }}>
            Personne : {contract.personName}
          </Text>
          <Text style={{ marginTop: 8 }}>
            Conseiller : {contract.counselorName}
          </Text>
        </View>

        <View style={{ marginTop: 24, gap: 12 }}>
          <AppButton
            title={
              isSaving
                ? 'Ouverture du dossier...'
                : 'Confirmer l’ouverture du dossier'
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
