//src/components/forms/FormPage.tsx
// src/components/forms/FormPage.tsx

import type { ReactNode } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

type Props = {
  children: ReactNode;
};

export function FormPage({ children }: Props) {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          isDesktop && styles.scrollDesktop,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.container, isDesktop && styles.containerDesktop]}>
          {children}
        </View>
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
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 36,
  },

  scrollDesktop: {
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
  },

  container: {
    gap: 18,
    width: "100%",
  },

  containerDesktop: {
    gap: 16,
    maxWidth: 1080,
  },
});
