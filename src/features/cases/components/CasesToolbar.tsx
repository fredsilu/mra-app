//src/features/cases/components/CasesToolbar.tsx

import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppInput } from "@/components/ui/AppInput";
import { COLORS } from "@/constants/theme";

export type CaseFilter = "all" | "active" | "closed";

const filters = [
  { label: "Tous", value: "all" },
  { label: "Ouverts", value: "active" },
  { label: "Clôturés", value: "closed" },
] as const;

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  filter: CaseFilter;
  onFilterChange: (value: CaseFilter) => void;
  resultCount: number;
};

export function CasesToolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  resultCount,
}: Props) {
  return (
    <View style={styles.container}>
      <AppInput
        value={search}
        onChangeText={onSearchChange}
        placeholder="Rechercher..."
        autoCapitalize="none"
      />

      <View style={styles.filters}>
        {filters.map((item) => {
          const selected = filter === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() => onFilterChange(item.value)}
              style={[styles.button, selected && styles.buttonSelected]}
            >
              <Text style={[styles.text, selected && styles.textSelected]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.count}>{resultCount} dossier(s)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginBottom: 18,
  },

  filters: {
    flexDirection: "row",
    gap: 8,
  },

  button: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 10,
  },

  buttonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  text: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 13,
  },

  textSelected: {
    color: COLORS.white,
  },

  count: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
  },
});
