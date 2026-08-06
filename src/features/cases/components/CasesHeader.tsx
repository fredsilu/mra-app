import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";

export function CasesHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dossiers</Text>

      <Text style={styles.subtitle}>
        Consultez les accompagnements ouverts ou clôturés.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
    marginBottom: 18,
  },

  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "800",
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
