//src/features/activities/components/ActivitiesToolbar.tsx
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { AppInput } from "@/components/ui/AppInput";
import type { ActivityStatus } from "@/features/activities";

export type StatusFilter = "all" | ActivityStatus;

const filters: Array<{
  label: string;
  value: StatusFilter;
}> = [
  { label: "Toutes", value: "all" },
  { label: "Planifiées", value: "planned" },
  { label: "Réalisées", value: "completed" },
  { label: "Annulées", value: "cancelled" },
];

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  filter: StatusFilter;
  onFilterChange: (value: StatusFilter) => void;
};

export function ActivitiesToolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
}: Props) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  return (
    <View style={[styles.container, isDesktop && styles.containerDesktop]}>
      <View style={[styles.search, isDesktop && styles.searchDesktop]}>
        <AppInput
          value={search}
          onChangeText={onSearchChange}
          placeholder="Rechercher une activité..."
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },

  containerDesktop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingTop: 10,
    paddingBottom: 10,
  },

  search: {
    width: "100%",
  },

  searchDesktop: {
    flex: 1,
  },

  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  filtersDesktop: {
    flexShrink: 0,
    flexWrap: "nowrap",
  },

  button: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  buttonDesktop: {
    minWidth: 92,
    paddingVertical: 8,
  },

  buttonSelected: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },

  text: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "700",
  },

  textSelected: {
    color: "#FFFFFF",
  },
});
