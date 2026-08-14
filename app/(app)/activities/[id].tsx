//app/(app)/activities/[id].tsx

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { useAuth } from "@/contexts/AuthContext";

import {
  ActivityActions,
  ActivityDecisionCard,
  ActivityHeader,
  ActivityInformationCard,
  ActivityResultCard,
} from "@/features/activities";

import { Page } from "@/components/layout/Page";
import { COLORS } from "@/constants/theme";
import {
  cancelActivity,
  completeActivity,
  getActivityById,
  type Activity,
} from "@/features/activities";

function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{
    id?: string;
  }>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [activity, setActivity] = useState<Activity | null>(null);

  const { profile } = useAuth();

  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const loadActivity = useCallback(async () => {
    if (!id) {
      setActivity(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const loadedActivity = await getActivityById(id);
      if (
        loadedActivity &&
        profile?.role === "conseiller" &&
        loadedActivity.counselorId !== profile.uid
      ) {
        setActivity(null);

        showMessage(
          "Accès refusé",
          "Cette activité est attribuée à un autre conseiller.",
        );

        return;
      }

      setActivity(loadedActivity);
      setResult(loadedActivity?.result ?? "");
    } catch (error) {
      console.error("Erreur lors du chargement de l’activité :", error);

      Alert.alert("Erreur", "Impossible de charger cette activité.");
    } finally {
      setIsLoading(false);
    }
  }, [id, profile]);

  useFocusEffect(
    useCallback(() => {
      void loadActivity();
    }, [loadActivity]),
  );

  async function handleComplete() {
    if (!activity || isCompleting) {
      return;
    }

    const normalizedResult = result.trim();

    if (!normalizedResult) {
      showMessage(
        "Compte rendu obligatoire",
        "Indiquez le résultat ou le compte rendu de l’activité.",
      );
      return;
    }

    try {
      setIsCompleting(true);

      await completeActivity(activity.id, normalizedResult);

      const updatedActivity = await getActivityById(activity.id);

      setActivity(updatedActivity);
      setResult(updatedActivity?.result ?? "");

      showMessage(
        "Activité réalisée",
        "L’activité a été marquée comme réalisée.",
      );
    } catch (error) {
      console.error("Erreur lors de la réalisation de l’activité :", error);

      showMessage(
        "Erreur",
        error instanceof Error
          ? error.message
          : "Impossible de terminer cette activité.",
      );
    } finally {
      setIsCompleting(false);
    }
  }

  async function confirmCancellation() {
    if (!activity || isCancelling) {
      return;
    }

    try {
      setIsCancelling(true);

      await cancelActivity(activity.id);
      await loadActivity();

      Alert.alert("Activité annulée", "L’activité a été annulée.");
    } catch (error) {
      console.error("Erreur lors de l’annulation de l’activité :", error);

      Alert.alert("Erreur", "Impossible d’annuler cette activité.");
    } finally {
      setIsCancelling(false);
    }
  }

  function handleCancel() {
    Alert.alert(
      "Annuler l’activité",
      "Confirmez-vous l’annulation de cette activité ?",
      [
        {
          text: "Retour",
          style: "cancel",
        },
        {
          text: "Annuler l’activité",
          style: "destructive",
          onPress: () => {
            void confirmCancellation();
          },
        },
      ],
    );
  }

  if (isLoading) {
    return (
      <Page>
        <View style={styles.loading}>
          <ActivityIndicator size="large" />

          <Text style={styles.loadingText}>Chargement de l’activité...</Text>
        </View>
      </Page>
    );
  }

  if (!activity) {
    return (
      <Page>
        <Text style={styles.notFound}>Activité introuvable.</Text>
      </Page>
    );
  }

  const isPlanned = activity.status === "planned";
  const isCompleted = activity.status === "completed";

  return (
    <Page>
      <ActivityHeader activity={activity} />

      <View
        style={[styles.desktopGrid, !isDesktop && styles.desktopGridMobile]}
      >
        <View style={styles.leftColumn}>
          <ActivityInformationCard activity={activity} />

          {isPlanned &&
          (profile?.role !== "conseiller" ||
            activity.counselorId === profile.uid) ? (
            <View style={styles.editSection}>
              <View style={styles.editCopy}>
                <Text style={styles.editTitle}>Rendez-vous planifié</Text>

                <Text style={styles.editText}>
                  Vous pouvez modifier le conseiller, la date, l’heure ou les
                  informations du rendez-vous tant qu’il n’a pas encore été
                  réalisé.
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/activities/edit",
                    params: {
                      id: activity.id,
                    },
                  })
                }
                style={({ pressed }) => [
                  styles.editButton,
                  pressed && styles.editButtonPressed,
                ]}
              >
                <Text style={styles.editButtonText}>
                  Modifier le rendez-vous
                </Text>
              </Pressable>
            </View>
          ) : null}

          <ActivityActions personId={activity.personId} />
        </View>

        <View style={styles.rightColumn}>
          <ActivityResultCard
            result={result}
            completedResult={activity.result}
            isPlanned={isPlanned}
            isCompleted={isCompleted}
            isCompleting={isCompleting}
            isCancelling={isCancelling}
            onResultChange={setResult}
            onComplete={() => {
              void handleComplete();
            }}
            onCancel={handleCancel}
          />

          <ActivityDecisionCard
            activity={activity}
            onCloseWithoutCase={() => {
              showMessage(
                "Étape suivante",
                "La clôture sans dossier sera connectée au Journey State à l’étape suivante.",
              );
            }}
          />
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: "center",
    flex: 1,
    gap: 12,
    justifyContent: "center",
    padding: 30,
  },
  desktopGrid: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 18,
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
    flex: 1.1,
    gap: 16,
    width: "100%",
  },

  editSection: {
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between",
    padding: 16,
  },

  editCopy: {
    flex: 1,
  },

  editTitle: {
    color: "#1E3A8A",
    fontSize: 16,
    fontWeight: "800",
  },

  editText: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },

  editButton: {
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 10,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: 16,
  },

  editButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  editButtonPressed: {
    opacity: 0.8,
  },

  loadingText: {
    color: COLORS.muted,
  },

  notFound: {
    color: COLORS.text,
    fontSize: 18,
    textAlign: "center",
  },
});
