// src/components/ui/AppInput.tsx

import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import { COLORS } from "@/constants/theme";

export function AppInput({ secureTextEntry, style, ...props }: TextInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isPassword = Boolean(secureTextEntry);

  if (!isPassword) {
    return (
      <TextInput
        {...props}
        placeholderTextColor={COLORS.muted}
        style={[styles.input, style]}
      />
    );
  }

  return (
    <View style={styles.passwordContainer}>
      <TextInput
        {...props}
        secureTextEntry={!passwordVisible}
        placeholderTextColor={COLORS.muted}
        style={[styles.passwordInput, style]}
      />

      <Pressable
        onPress={() => setPasswordVisible((current) => !current)}
        accessibilityRole="button"
        accessibilityLabel={
          passwordVisible
            ? "Masquer le mot de passe"
            : "Afficher le mot de passe"
        }
        hitSlop={8}
        style={({ pressed }) => [
          styles.eyeButton,
          pressed ? styles.pressed : null,
        ]}
      >
        <Text style={styles.eye}>{passwordVisible ? "🙈" : "👁"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    padding: 14,
  },

  passwordContainer: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 52,
    overflow: "hidden",
  },

  passwordInput: {
    color: COLORS.text,
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  eyeButton: {
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "center",
    paddingHorizontal: 14,
  },

  eye: {
    fontSize: 19,
  },

  pressed: {
    opacity: 0.55,
  },
});
