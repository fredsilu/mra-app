// app/(app)/cases/form.tsx
// app/(app)/cases/form.tsx

import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  FormActions,
  FormCard,
  FormHeader,
  FormPage,
} from "@/components/forms";
import { AppButton } from "@/components/ui/AppButton";
import { COLORS } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { getActivityById, type Activity } from "@/features/activities";
import {
  createCaseFromFirstInterview,
  getOpenCaseByPersonId,
} from "@/features/cases/case.service";

function showMessage(title: string, message: string): void {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}

function getCreationErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Impossible d’ouvrir le dossier.";
  }

  switch (error.message) {
    case "FIRST_INTERVIEW_ACTIVITY_ID_REQUIRED":
      return "Le premier entretien est obligatoire.";

    case "FIRST_INTERVIEW_NOT_FOUND":
      return "Le premier entretien est introuvable.";

    case "ACTIVITY_IS_NOT_FIRST_INTERVIEW":
      return "Cette activité n’est pas un premier entretien.";

    case "FIRST_INTERVIEW_NOT_COMPLETED":
      return "Le premier entretien doit être réalisé avant l’ouverture du dossier.";

    case "FIRST_INTERVIEW_ALREADY_LINKED":
      return "Ce premier entretien est déjà lié à un dossier.";

    case "PERSON_ALREADY_HAS_OPEN_CASE":
      return "Cette personne possède déjà un dossier ouvert.";

    case "USER_ID_REQUIRED":
      return "Votre profil utilisateur est introuvable.";

    default:
      return "Impossible d’ouvrir le dossier.";
  }
}

export default function CaseFormScreen() {
  const { firstInterviewActivityId } = useLocalSearchParams<{
    firstInterviewActivityId?: string;
  }>();

  const { profile } = useAuth();

  const [firstInterview, setFirstInterview] = useState<Activity | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const isSubmittingRef = useRef(false);

  const loadFirstInterview = useCallback(async (): Promise<void> => {
    const activityId = firstInterviewActivityId?.trim();

    if (!activityId) {
      showMessage("Erreur", "Le premier entretien n’a pas été indiqué.");

      router.back();
      return;
    }

    try {
      setIsLoading(true);

      const loadedActivity = await getActivityById(activityId);

      if (!loadedActivity) {
        showMessage("Erreur", "Le premier entretien est introuvable.");

        router.back();
        return;
      }

      if (loadedActivity.type !== "first_interview") {
        showMessage("Erreur", "Cette activité n’est pas un premier entretien.");

        router.back();
        return;
      }

      if (loadedActivity.status !== "completed") {
        showMessage(
          "Entretien non réalisé",
          "Le premier entretien doit être réalisé avant l’ouverture du dossier.",
        );

        router.back();
        return;
      }

      if (loadedActivity.caseId) {
        router.replace({
          pathname: "/cases/[id]",
          params: {
            id: loadedActivity.caseId,
          },
        });

        return;
      }

      const existingOpenCase = await getOpenCaseByPersonId(
        loadedActivity.personId,
      );

      if (existingOpenCase) {
        router.replace({
          pathname: "/cases/[id]",
          params: {
            id: existingOpenCase.id,
          },
        });

        return;
      }

      setFirstInterview(loadedActivity);
    } catch (error) {
      console.error("Erreur lors de la préparation du dossier :", error);

      showMessage("Erreur", "Impossible de préparer l’ouverture du dossier.");

      router.back();
    } finally {
      setIsLoading(false);
    }
  }, [firstInterviewActivityId]);

  useEffect(() => {
    void loadFirstInterview();
  }, [loadFirstInterview]);

  async function handleSave(): Promise<void> {
    if (isSubmittingRef.current || !firstInterview) {
      return;
    }

    if (!profile) {
      showMessage("Erreur", "Votre profil utilisateur est introuvable.");

      return;
    }

    try {
      isSubmittingRef.current = true;
      setIsSaving(true);

      const caseId = await createCaseFromFirstInterview({
        firstInterviewActivityId: firstInterview.id,

        createdBy: profile.uid,

        createdByName: profile.displayName,
      });

      showMessage(
        "Dossier ouvert",
        "Le dossier d’accompagnement a été créé avec succès.",
      );

      router.replace({
        pathname: "/cases/[id]",
        params: {
          id: caseId,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la création du dossier :", error);

      showMessage("Ouverture impossible", getCreationErrorMessage(error));

      isSubmittingRef.current = false;
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Préparation du dossier...</Text>
      </SafeAreaView>
    );
  }

  if (!firstInterview) {
    return null;
  }

  return (
    <FormPage>
      <FormHeader
        title="Ouvrir le dossier"
        description="Le premier entretien a été réalisé. Confirmez l’ouverture du dossier d’accompagnement."
      />

      <FormCard
        title="Informations du premier entretien"
        description="Vérifiez les informations avant de créer le dossier."
      >
        <Info label="Personne" value={firstInterview.personName} />

        <Info label="Conseiller" value={firstInterview.counselorName} />

        <Info label="Premier entretien" value={firstInterview.title} />

        <Info label="Compte rendu" value={firstInterview.result} />
      </FormCard>

      <FormActions>
        <View style={styles.actionButton}>
          <AppButton
            title="Annuler"
            disabled={isSaving}
            onPress={() => router.back()}
          />
        </View>

        <View style={styles.actionButton}>
          <AppButton
            title={
              isSaving ? "Ouverture du dossier..." : "Confirmer l’ouverture"
            }
            disabled={isSaving}
            onPress={() => {
              void handleSave();
            }}
          />
        </View>
      </FormActions>
    </FormPage>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLabel}>{label}</Text>

      <Text style={styles.infoValue}>{value || "Non renseigné"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: "center",
    backgroundColor: COLORS.light,
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  loadingText: {
    color: COLORS.muted,
    marginTop: 12,
  },

  info: {
    gap: 4,
  },

  infoLabel: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
  },

  infoValue: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 22,
  },

  actionButton: {
    minWidth: 180,
  },
});
