import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";
import {
  CASE_STATUS_LABELS,
  type Case,
  type CaseStatus,
} from "@/features/cases/case.types";

type Props = {
  cases: Case[];
  refreshing: boolean;
  onRefresh: () => void;
  search: string;
};

function statusColor(status: CaseStatus): string {
  return status === "active" ? "#15803D" : "#64748B";
}

function statusBackgroundColor(status: CaseStatus): string {
  return status === "active" ? "#DCFCE7" : "#F1F5F9";
}

function formatDate(value: Case["openedAt"]): string {
  try {
    return value.toDate().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Date non renseignée";
  }
}

export function CasesList({ cases, refreshing, onRefresh, search }: Props) {
  return (
    <FlatList
      style={styles.list}
      data={cases}
      keyExtractor={(item) => item.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={[
        styles.content,
        cases.length === 0 ? styles.emptyContent : null,
      ]}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Aucun dossier</Text>

          <Text style={styles.emptyText}>
            {search.trim()
              ? "Aucun dossier ne correspond à cette recherche."
              : "Aucun dossier dans cette catégorie."}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/cases/[id]",
              params: {
                id: item.id,
              },
            })
          }
          style={({ pressed }) => [
            styles.card,
            pressed ? styles.cardPressed : null,
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardHeading}>
              <Text style={styles.caseNumber}>
                {item.caseNumber || item.id}
              </Text>

              <Text style={styles.personName}>{item.personName}</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusBackgroundColor(item.status),
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: statusColor(item.status),
                  },
                ]}
              >
                {CASE_STATUS_LABELS[item.status]}
              </Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.cardMeta}>
              Conseiller :{" "}
              <Text style={styles.cardMetaStrong}>{item.counselorName}</Text>
            </Text>

            <Text style={styles.cardMeta}>
              Ouvert le :{" "}
              <Text style={styles.cardMetaStrong}>
                {formatDate(item.openedAt)}
              </Text>
            </Text>
          </View>

          <Text style={styles.openLabel}>Ouvrir le dossier</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },

  content: {
    paddingBottom: 40,
  },

  emptyContent: {
    flexGrow: 1,
  },

  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },

  cardPressed: {
    opacity: 0.75,
  },

  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },

  cardHeading: {
    flex: 1,
    gap: 4,
  },

  caseNumber: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
  },

  personName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },

  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },

  cardBody: {
    gap: 6,
    marginTop: 14,
  },

  cardMeta: {
    color: COLORS.muted,
    fontSize: 14,
  },

  cardMetaStrong: {
    color: COLORS.text,
    fontWeight: "600",
  },

  openLabel: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 16,
  },

  empty: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 20,
    padding: 30,
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },

  emptyText: {
    color: COLORS.muted,
    lineHeight: 20,
    marginTop: 6,
    textAlign: "center",
  },
});
