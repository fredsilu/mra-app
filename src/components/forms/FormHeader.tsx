//src/components/forms/FormHeader.tsx
// src/components/forms/FormHeader.tsx

import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { COLORS } from "@/constants/theme";

type Props = {
  title: string;
  description?: string;
};

export function FormHeader({ title, description }: Props) {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;

  return (
    <View style={[styles.container, isDesktop && styles.containerDesktop]}>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Text style={styles.backText}>← Retour</Text>
      </Pressable>

      <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
        {title}
      </Text>

      {description ? (
        <Text
          style={[styles.description, isDesktop && styles.descriptionDesktop]}
        >
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },

  containerDesktop: {
    gap: 4,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 4,
  },

  backText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "700",
  },

  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "900",
  },

  titleDesktop: {
    fontSize: 26,
  },

  description: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
  },

  descriptionDesktop: {
    maxWidth: 760,
  },

  pressed: {
    opacity: 0.7,
  },
});
