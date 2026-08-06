import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";

type Props = {
  title: string;
  description?: string;
};

export function FormHeader({ title, description }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.backButton,
          pressed ? styles.pressed : null,
        ]}
      >
        <Text style={styles.backText}>← Retour</Text>
      </Pressable>

      <Text style={styles.title}>{title}</Text>

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 6,
  },

  backText: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "700",
  },

  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "900",
  },

  description: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
  },

  pressed: {
    opacity: 0.7,
  },
});
