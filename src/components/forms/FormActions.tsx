import type { ReactNode } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

type Props = {
  children: ReactNode;
};

export function FormActions({ children }: Props) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  return (
    <View
      style={[styles.container, isDesktop ? styles.desktop : styles.mobile]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },

  desktop: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  mobile: {
    flexDirection: "column",
  },
});
