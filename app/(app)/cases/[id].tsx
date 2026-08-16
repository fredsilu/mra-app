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
  useWindowDimensions,
  View,
} from "react-native";

import {
  CaseActions,
  CaseActivitiesCard,
  CaseClosureCard,
  CaseHeader,
  CaseInformationCard,
} from "@/features/cases";
import { AppButton } from "@/components/ui/AppButton";

import { COLORS } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { getActivitiesByCase, type Activity } from "@/features/activities";
import { closeCase, getCase } from "@/features/cases/case.service";
import type { Case } from "@/features/cases/case.types";

function showMessage(title: string, message: string): void {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}

export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams<{
    id?: string;
  }>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

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
        const hasAccess = loadedCase.counselorId === profile.uid;

        if (!hasAccess) {
          setHelpCase(null);
          setActivities([]);

          showMessage(
            "Accès refusé",
            "Ce dossier est attribué à un autre conseiller.",
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
      <ScrollView
        contentContainerStyle={[
          styles.content,
          isDesktop && styles.contentDesktop,
        ]}
      >
        <CaseHeader helpCase={helpCase} />

        <View
          style={[styles.desktopGrid, !isDesktop && styles.desktopGridMobile]}
        >
          <View style={[styles.leftColumn, !isDesktop && styles.mobileColumn]}>
            <CaseInformationCard helpCase={helpCase} />

            <CaseActions personId={helpCase.personId} />
          </View>

          <View style={[styles.rightColumn, !isDesktop && styles.mobileColumn]}>
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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    padding: 16,
    paddingBottom: 50,
    width: "100%",
  },

  contentDesktop: {
    maxWidth: 1180,
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  desktopGrid: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 18,
    marginTop: 16,
  },

  desktopGridMobile: {
    flexDirection: "column",
  },

  leftColumn: {
    flex: 1,
    gap: 16,
    width: "100%",
  },

  rightColumn: {
    flex: 1.25,
    gap: 16,
    width: "100%",
  },
  mobileColumn: {
    flexBasis: "auto",
    flexGrow: 0,
    flexShrink: 0,
    width: "100%",
  },
});
