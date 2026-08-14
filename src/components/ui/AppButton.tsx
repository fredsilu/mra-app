//src/components/ui/AppButton.tsx

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import { COLORS } from "@/constants/theme";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  compact?: boolean;
  secondary?: boolean;
};

export function AppButton({
  title,
  onPress,
  disabled = false,
  compact = false,
  secondary = false,
}: AppButtonProps) {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        secondary ? styles.secondaryButton : styles.primaryButton,
        compact && isDesktop ? styles.compactDesktop : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <Text
        style={[
          styles.text,
          secondary ? styles.secondaryText : styles.primaryText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: 22,
    paddingVertical: 13,
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
  },

  secondaryButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
  },

  compactDesktop: {
    alignSelf: "flex-start",
    minWidth: 160,
    maxWidth: 260,
  },

  text: {
    fontSize: 15,
    fontWeight: "700",
  },

  primaryText: {
    color: COLORS.white,
  },

  secondaryText: {
    color: COLORS.text,
  },

  disabled: {
    opacity: 0.55,
  },
});
