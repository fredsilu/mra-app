// app/(app)/people/[id].tsx
// app/(app)/people/[id].tsx

import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { LoadingView } from "@/components/common/LoadingView";
import { Page } from "@/components/layout/Page";
import { COLORS } from "@/constants/theme";
import { getActivitiesByPerson, type Activity } from "@/features/activities";
import { usePersonJourney } from "@/features/journey";
import {
  PersonActions,
  PersonActivitiesCard,
  PersonContactCard,
  PersonHeader,
  PersonIdentityCard,
} from "@/features/people/components";
import { getPersonById } from "@/features/people/person.service";
import type { Person } from "@/features/people/person.types";

export default function PersonDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id?: string;
  }>();

  const [person, setPerson] = useState<Person | null>(null);

  const [activities, setActivities] = useState<Activity[]>([]);

  const [isLoadingPerson, setIsLoadingPerson] = useState(true);

  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  const {
    journey,
    loading: isLoadingJourney,
    refresh: refreshJourney,
  } = usePersonJourney(id);

  const loadPerson = useCallback(async () => {
    if (!id) {
      setPerson(null);
      setIsLoadingPerson(false);
      return;
    }

    try {
      setIsLoadingPerson(true);

      setPerson(await getPersonById(id));
    } catch (error) {
      console.error("Erreur lors du chargement de la personne :", error);

      setPerson(null);
    } finally {
      setIsLoadingPerson(false);
    }
  }, [id]);

  const loadActivities = useCallback(async () => {
    if (!id) {
      setActivities([]);
      setIsLoadingActivities(false);
      return;
    }

    try {
      setIsLoadingActivities(true);

      setActivities(await getActivitiesByPerson(id));
    } catch (error) {
      console.error("Erreur lors du chargement des activités :", error);

      setActivities([]);
    } finally {
      setIsLoadingActivities(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void loadPerson();
      void loadActivities();
      void refreshJourney();
    }, [loadActivities, loadPerson, refreshJourney]),
  );

  if (isLoadingPerson) {
    return <LoadingView label="Chargement de la personne..." />;
  }

  if (!person) {
    return (
      <Page>
        <Text style={styles.notFound}>Personne introuvable.</Text>
      </Page>
    );
  }

  return (
    <Page>
      <PersonHeader person={person} />

      <View style={styles.desktopGrid}>
        <View style={styles.leftColumn}>
          <PersonIdentityCard person={person} />

          <PersonContactCard person={person} />
        </View>

        <View style={styles.rightColumn}>
          <View style={styles.actions}>
            {isLoadingJourney ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" />

                <Text style={styles.loadingText}>
                  Chargement du parcours...
                </Text>
              </View>
            ) : (
              <PersonActions
                person={person}
                hasOpenCase={journey?.state === "CASE_OPEN"}
                openCaseId={
                  journey?.state === "CASE_OPEN"
                    ? journey.openCaseId
                    : undefined
                }
                pendingFirstInterviewId={
                  journey?.state === "FIRST_INTERVIEW_PLANNED"
                    ? journey.firstInterviewId
                    : undefined
                }
                waitingCaseDecision={journey?.state === "WAITING_CASE_DECISION"}
                firstInterviewId={journey?.firstInterviewId}
              />
            )}
          </View>

          <View style={styles.activities}>
            {isLoadingActivities ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" />

                <Text style={styles.loadingText}>
                  Chargement des activités...
                </Text>
              </View>
            ) : (
              <PersonActivitiesCard activities={activities} />
            )}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        {isLoadingJourney ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" />

            <Text style={styles.loadingText}>Chargement du parcours...</Text>
          </View>
        ) : (
          <PersonActions
            person={person}
            hasOpenCase={journey?.state === "CASE_OPEN"}
            openCaseId={
              journey?.state === "CASE_OPEN" ? journey.openCaseId : undefined
            }
            pendingFirstInterviewId={
              journey?.state === "FIRST_INTERVIEW_PLANNED"
                ? journey.firstInterviewId
                : undefined
            }
            waitingCaseDecision={journey?.state === "WAITING_CASE_DECISION"}
            firstInterviewId={journey?.firstInterviewId}
          />
        )}
      </View>

      <View style={styles.activities}>
        {isLoadingActivities ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" />

            <Text style={styles.loadingText}>Chargement des activités...</Text>
          </View>
        ) : (
          <PersonActivitiesCard activities={activities} />
        )}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  desktopGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
  },

  leftColumn: {
    flexBasis: 360,
    flexGrow: 1,
    gap: 16,
  },

  rightColumn: {
    flexBasis: 420,
    flexGrow: 1.2,
    gap: 16,
  },

  actions: {
    marginTop: 0,
  },

  activities: {
    marginTop: 0,
  },

  loadingBox: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    padding: 20,
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
