//src/features/counselor-dashboard/components/CounselorCases.tsx

import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Case } from "@/features/cases/case.types";

type Props = {
  cases: Case[];
};

export function CounselorCases({ cases }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes dossiers actifs</Text>

        <Text style={styles.count}>{cases.length}</Text>
      </View>

      {cases.length === 0 ? (
        <Text style={styles.empty}>
          Aucun dossier actif ne vous est affecté.
        </Text>
      ) : (
        cases.map((helpCase) => (
          <Pressable
            key={helpCase.id}
            onPress={() =>
              router.push({
                pathname: "/cases/[id]",
                params: {
                  id: helpCase.id,
                },
              })
            }
            style={({ pressed }) => [
              styles.item,
              pressed ? styles.pressed : null,
            ]}
          >
            <View style={styles.itemContent}>
              <Text style={styles.person}>{helpCase.personName}</Text>

              <Text style={styles.number}>
                {helpCase.caseNumber || helpCase.id}
              </Text>

              <Text style={styles.counselor}>
                Conseiller : {helpCase.counselorName}
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))
      )}

      <Pressable
        onPress={() => router.push("/cases")}
        style={({ pressed }) => [
          styles.linkButton,
          pressed ? styles.pressed : null,
        ]}
      >
        <Text style={styles.linkText}>Voir tous les dossiers</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },

  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  title: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "800",
  },

  count: {
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    color: "#15803D",
    fontWeight: "800",
    minWidth: 32,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: "center",
  },

  empty: {
    color: "#64748B",
    lineHeight: 21,
    paddingVertical: 12,
  },

  item: {
    alignItems: "center",
    borderTopColor: "#E2E8F0",
    borderTopWidth: 1,
    flexDirection: "row",
    paddingVertical: 14,
  },

  itemContent: {
    flex: 1,
  },

  person: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "800",
  },

  number: {
    color: "#15803D",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  counselor: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 4,
  },

  arrow: {
    color: "#94A3B8",
    fontSize: 28,
    marginLeft: 12,
  },

  linkButton: {
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 10,
    marginTop: 14,
    paddingVertical: 12,
  },

  linkText: {
    color: "#15803D",
    fontSize: 14,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.72,
  },
});
