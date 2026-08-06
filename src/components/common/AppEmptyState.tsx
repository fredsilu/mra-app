import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { COLORS } from "@/constants/theme";

type Props = {
  icon?: string;
  title: string;
  message: string;
  buttonTitle?: string;
  buttonRoute?: string;
};

export function AppEmptyState({
  icon = "📂",
  title,
  message,
  buttonTitle,
  buttonRoute,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.message}>{message}</Text>

      {buttonTitle && buttonRoute ? (
        <View style={styles.button}>
          <AppButton
            title={buttonTitle}
            onPress={() => router.push(buttonRoute as never)}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 42,
    paddingHorizontal: 24,
  },

  icon: {
    fontSize: 54,
    marginBottom: 14,
  },

  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },

  message: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
    maxWidth: 420,
    textAlign: "center",
  },

  button: {
    marginTop: 22,
    minWidth: 220,
  },
});
