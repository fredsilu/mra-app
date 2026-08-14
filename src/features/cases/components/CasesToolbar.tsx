//src/features/cases/components/CasesToolbar.tsx
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

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
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  return (
    <View style={[styles.container, isDesktop && styles.containerDesktop]}>
      <View style={[styles.search, isDesktop && styles.searchDesktop]}>
        <AppInput
          value={search}
          onChangeText={onSearchChange}
          placeholder="Rechercher un dossier..."
          autoCapitalize="none"
        />
      </View>

      <View style={[styles.filters, isDesktop && styles.filtersDesktop]}>
        {filters.map((item) => {
          const selected = filter === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() => onFilterChange(item.value)}
              style={[
                styles.button,
                isDesktop && styles.buttonDesktop,
                selected && styles.buttonSelected,
              ]}
            >
              <Text style={[styles.text, selected && styles.textSelected]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.count, isDesktop && styles.countDesktop]}>
        {resultCount} dossier(s)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 16,
  },

  containerDesktop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },

  search: {
    width: "100%",
  },

  searchDesktop: {
    flex: 1,
  },

  filters: {
    flexDirection: "row",
    gap: 8,
  },

  filtersDesktop: {
    flexShrink: 0,
  },

  button: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  buttonDesktop: {
    flex: 0,
    minWidth: 90,
    paddingVertical: 8,
  },

  buttonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  text: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
  },

  textSelected: {
    color: COLORS.white,
  },

  count: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
  },

  countDesktop: {
    minWidth: 100,
    textAlign: "right",
  },
});
