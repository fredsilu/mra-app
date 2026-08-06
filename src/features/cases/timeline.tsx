import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";

import {
  ACTIVITY_TYPE_LABELS,
  getActivitiesByCase,
  type Activity,
} from "@/features/activities";

import { getCaseHistory } from "@/features/cases/case-history.service";
import { type CaseHistoryEntry } from "@/features/cases/case-history.types";
import type {
  TimelineItem,
  TimelineItemType,
} from "@/features/cases/timeline.types";

function getParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function getTimelineTitle(type: TimelineItemType): string {
  switch (type) {
    case "case_created":
      return "Dossier créé";

    case "case_suspended":
      return "Dossier suspendu";

    case "case_reactivated":
      return "Dossier réactivé";

    case "case_closed":
      return "Dossier clôturé";

    case "counselor_changed":
      return "Conseiller remplacé";

    case "activity":
      return "Activité";

    default:
      return "Événement";
  }
}

function getTimelineCategory(type: TimelineItemType): string {
  return type === "activity" ? "ACTIVITÉ" : "HISTORIQUE DU DOSSIER";
}

function formatTimelineDate(item: TimelineItem): string {
  return item.date.toDate().toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CaseTimelineScreen() {
  const params = useLocalSearchParams<{
    caseId?: string | string[];
  }>();

  const caseId = getParam(params.caseId);

  const [historyItems, setHistoryItems] = useState<CaseHistoryEntry[]>([]);

  const [activities, setActivities] = useState<Activity[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadTimelineData = useCallback(
    async (refreshOnly = false): Promise<void> => {
      if (!caseId) {
        setHistoryItems([]);
        setActivities([]);
        setIsLoading(false);
        setIsRefreshing(false);

        Alert.alert(
          "Dossier manquant",
          "Aucun dossier n’a été transmis à la chronologie.",
        );

        return;
      }

      try {
        if (refreshOnly) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const [historyResult, activitiesResult] = await Promise.all([
          getCaseHistory(caseId),
          getActivitiesByCase(caseId),
        ]);

        setHistoryItems(historyResult);
        setActivities(activitiesResult);
      } catch (error) {
        console.error("Erreur lors du chargement de la chronologie :", error);

        Alert.alert(
          "Erreur",
          "Impossible de charger la chronologie du dossier.",
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [caseId],
  );

  useEffect(() => {
    void loadTimelineData();
  }, [loadTimelineData]);

  const timelineItems = useMemo<TimelineItem[]>(() => {
    const historyTimeline: TimelineItem[] = historyItems.map((item) => {
      let type: TimelineItemType;

      switch (item.action) {
        case "CASE_CREATED":
          type = "case_created";
          break;

        case "CASE_SUSPENDED":
          type = "case_suspended";
          break;

        case "CASE_REACTIVATED":
          type = "case_reactivated";
          break;

        case "CASE_CLOSED":
          type = "case_closed";
          break;

        case "COUNSELOR_CHANGED":
        default:
          type = "counselor_changed";
          break;
      }

      return {
        id: `history-${item.id}`,
        referenceId: item.id,
        caseId: item.caseId,
        type,
        date: item.performedAt,
        title: getTimelineTitle(type),
        description: item.description,
      };
    });

    const activityTimeline: TimelineItem[] = activities
      .filter((activity) => activity.scheduledAt)
      .map((activity) => ({
        id: `activity-${activity.id}`,
        referenceId: activity.id,
        caseId: activity.caseId ?? caseId,
        type: "activity",
        date: activity.scheduledAt!,
        title: ACTIVITY_TYPE_LABELS[activity.type] ?? activity.title,
        description: activity.result || activity.description || "",
      }));

    return [...historyTimeline, ...activityTimeline].sort(
      (firstItem, secondItem) =>
        secondItem.date.toMillis() - firstItem.date.toMillis(),
    );
  }, [historyItems, activities]);

  const renderTimelineItem = ({ item }: { item: TimelineItem }) => {
    const isActivity = item.type === "activity";

    const content = (
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            width: 28,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: isActivity ? "#2563EB" : "#7C3AED",
              marginTop: 5,
              zIndex: 1,
            }}
          />

          <View
            style={{
              width: 2,
              flex: 1,
              minHeight: 120,
              backgroundColor: "#D1D5DB",
            }}
          />
        </View>

        <View
          style={{
            flex: 1,
            marginLeft: 12,
            marginBottom: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            borderRadius: 12,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: isActivity ? "#2563EB" : "#7C3AED",
              marginBottom: 6,
            }}
          >
            {getTimelineCategory(item.type)}
          </Text>

          <Text
            style={{
              fontSize: 17,
              fontWeight: "700",
              color: "#111827",
              marginBottom: 6,
            }}
          >
            {item.title}
          </Text>

          {item.description.trim() ? (
            <Text
              style={{
                fontSize: 14,
                lineHeight: 21,
                color: "#4B5563",
                marginBottom: 12,
              }}
            >
              {item.description}
            </Text>
          ) : null}

          <Text
            style={{
              fontSize: 12,
              color: "#6B7280",
            }}
          >
            {formatTimelineDate(item)}
          </Text>

          {isActivity ? (
            <Text
              style={{
                marginTop: 12,
                fontSize: 13,
                fontWeight: "700",
                color: "#2563EB",
              }}
            >
              Voir le détail
            </Text>
          ) : null}
        </View>
      </View>
    );

    if (!isActivity) {
      return content;
    }

    return (
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/activities/[id]",
            params: {
              id: item.referenceId,
            },
          })
        }
      >
        {content}
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <ActivityIndicator size="large" />

        <Text
          style={{
            marginTop: 12,
            color: "#4B5563",
          }}
        >
          Chargement de la chronologie...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
      }}
    >
      <FlatList
        data={timelineItems}
        keyExtractor={(item) => item.id}
        renderItem={renderTimelineItem}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 24,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              void loadTimelineData(true);
            }}
          />
        }
        ListHeaderComponent={
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 24,
              paddingBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 26,
                fontWeight: "700",
                color: "#111827",
              }}
            >
              Chronologie du dossier
            </Text>

            <Text
              style={{
                marginTop: 6,
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              {timelineItems.length}{" "}
              {timelineItems.length > 1
                ? "éléments enregistrés"
                : "élément enregistré"}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 32,
              paddingVertical: 80,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#111827",
                textAlign: "center",
              }}
            >
              Chronologie vide
            </Text>

            <Text
              style={{
                marginTop: 8,
                fontSize: 14,
                lineHeight: 21,
                color: "#6B7280",
                textAlign: "center",
              }}
            >
              Aucun événement ni aucune activité n’a encore été enregistré pour
              ce dossier.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
