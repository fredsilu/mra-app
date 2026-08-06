import type { ReactNode } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { COLORS } from "@/constants/theme";

type Props = {
  children: ReactNode;
};

export function FormPage({ children }: Props) {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.scroll, isDesktop && styles.desktop]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scroll: {
    padding: 24,
    paddingBottom: 40,
  },

  desktop: {
    alignItems: "center",
  },

  container: {
    width: "100%",
    maxWidth: 950,
    gap: 24,
  },
});
