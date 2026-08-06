import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppInput } from "@/components/ui/AppInput";
import type { ActivityStatus } from "@/features/activities";

export type StatusFilter = "all" | ActivityStatus;

const filters: Array<{
  label: string;
  value: StatusFilter;
}> = [
  {
    label: "Toutes",
    value: "all",
  },
  {
    label: "Planifiées",
    value: "planned",
  },
  {
    label: "Réalisées",
    value: "completed",
  },
  {
    label: "Annulées",
    value: "cancelled",
  },
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
  return (
    <View style={styles.container}>
      <AppInput
        value={search}
        onChangeText={onSearchChange}
        placeholder="Rechercher une personne, un conseiller ou une activité"
        autoCapitalize="none"
      />

      <View style={styles.filters}>
        {filters.map((item) => {
          const selected = filter === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() => onFilterChange(item.value)}
              style={[styles.button, selected ? styles.buttonSelected : null]}
            >
              <Text
                style={[styles.text, selected ? styles.textSelected : null]}
              >
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
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },

  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  button: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 13,
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
