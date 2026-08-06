import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function FormCard({ title, description, children }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },

  header: {
    marginBottom: 18,
  },

  title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
  },

  description: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },

  content: {
    gap: 16,
  },
});
