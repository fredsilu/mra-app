// app/(app)/cases/[id].tsx
// app/(app)/cases/[id].tsx

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getPersonById } from "@/features/people/person.service";

import {
  CaseActions,
  CaseActivitiesCard,
  CaseClosureCard,
  CaseHeader,
  CaseInformationCard,
} from "@/features/cases";
import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { COLORS } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import {
  ActivityCard,
  getActivitiesByCase,
  type Activity,
} from "@/features/activities";
import { closeCase, getCase } from "@/features/cases/case.service";
import { CASE_STATUS_LABELS, type Case } from "@/features/cases/case.types";

function showMessage(title: string, message: string): void {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}

function formatDate(value?: { toDate: () => Date }): string {
  if (!value) {
    return "Non renseignée";
  }

  try {
    return value.toDate().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Non renseignée";
  }
}

export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams<{
    id?: string;
  }>();

  const { profile } = useAuth();

  const [helpCase, setHelpCase] = useState<Case | null>(null);

  const [activities, setActivities] = useState<Activity[]>([]);

  const [closureReason, setClosureReason] = useState("");

  const [closureSummary, setClosureSummary] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isClosing, setIsClosing] = useState(false);

  const loadData = useCallback(async () => {
    const caseId = id?.trim();

    if (!caseId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // On charge d'abord le dossier.
      const loadedCase = await getCase(caseId);

      if (!loadedCase) {
        setHelpCase(null);
        setActivities([]);
        return;
      }

      // Sécurité spécifique au conseiller.
      if (profile?.role === "conseiller") {
        const person = await getPersonById(loadedCase.personId);

        const hasAccess = person?.counselorIds?.includes(profile.uid) ?? false;

        if (!hasAccess) {
          setHelpCase(null);
          setActivities([]);

          showMessage(
            "Accès refusé",
            "Vous n’avez pas accès au dossier de cette personne.",
          );

          router.replace("/cases");
          return;
        }
      }

      // Les activités ne sont chargées qu'après
      // validation de l'accès au dossier.
      const loadedActivities = await getActivitiesByCase(caseId);

      setHelpCase(loadedCase);
      setActivities(loadedActivities);

      setClosureReason(loadedCase.closureReason ?? "");

      setClosureSummary(loadedCase.closureSummary ?? "");
    } catch (error) {
      console.error("Erreur lors du chargement du dossier :", error);

      showMessage("Erreur", "Impossible de charger le dossier.");
    } finally {
      setIsLoading(false);
    }
  }, [id, profile]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData]),
  );

  async function handleCloseCase(): Promise<void> {
    if (!helpCase || !profile || isClosing) {
      return;
    }

    const normalizedReason = closureReason.trim();

    const normalizedSummary = closureSummary.trim();

    if (!normalizedReason) {
      showMessage("Validation", "Le motif de clôture est obligatoire.");
      return;
    }

    if (!normalizedSummary) {
      showMessage(
        "Validation",
        "Le bilan de l’accompagnement est obligatoire.",
      );
      return;
    }

    const confirmed =
      Platform.OS === "web"
        ? window.confirm("Confirmez-vous la clôture définitive de ce dossier ?")
        : true;

    if (!confirmed) {
      return;
    }

    try {
      setIsClosing(true);

      await closeCase(helpCase.id, {
        closureReason: normalizedReason,
        closureSummary: normalizedSummary,
        updatedBy: profile.uid,
        updatedByName: profile.displayName,
      });

      await loadData();

      showMessage("Dossier clôturé", "Le dossier a été clôturé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la clôture du dossier :", error);

      showMessage("Erreur", "Impossible de clôturer le dossier.");
    } finally {
      setIsClosing(false);
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Chargement du dossier...</Text>
      </SafeAreaView>
    );
  }

  if (!helpCase) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text style={styles.notFound}>Dossier introuvable.</Text>

        <AppButton title="Retour" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const isClosed = helpCase.status === "closed";
  const canManageCase =
    profile?.role === "responsable" || profile?.role === "adjoint";

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <CaseHeader helpCase={helpCase} />

        <CaseInformationCard helpCase={helpCase} />

        <CaseActivitiesCard helpCase={helpCase} activities={activities} />

        {!isClosed && canManageCase ? (
          <CaseClosureCard
            closureReason={closureReason}
            closureSummary={closureSummary}
            isClosing={isClosing}
            onReasonChange={setClosureReason}
            onSummaryChange={setClosureSummary}
            onClose={() => {
              void handleCloseCase();
            }}
          />
        ) : null}

        <CaseActions personId={helpCase.personId} />
      </ScrollView>
    </SafeAreaView>
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
  screen: {
    flex: 1,
    backgroundColor: COLORS.light,
  },

  loading: {
    alignItems: "center",
    backgroundColor: COLORS.light,
    flex: 1,
    gap: 14,
    justifyContent: "center",
    padding: 24,
  },

  loadingText: {
    color: COLORS.muted,
  },

  notFound: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
  },

  content: {
    alignSelf: "center",
    maxWidth: 900,
    padding: 16,
    paddingBottom: 50,
    width: "100%",
  },

  cardTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "800",
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
});
