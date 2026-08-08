//src/components/layout/Page.tsx

import { PropsWithChildren } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

export function Page({ children }: PropsWithChildren) {
  const { width } = useWindowDimensions();
  const isWebWide = width >= 900;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isWebWide && styles.scrollContentWide,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F7FB" },
  scrollContent: { flexGrow: 1, padding: 16, paddingBottom: 40 },
  scrollContentWide: { paddingHorizontal: 32, paddingVertical: 28 },
  content: { width: "100%", maxWidth: 1180, alignSelf: "center" },
});
