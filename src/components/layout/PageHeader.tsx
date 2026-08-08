//src/components/layout/PageHeader.tsx

import { ReactNode } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: Props) {
  const { width } = useWindowDimensions();
  const stacked = width < 640;

  return (
    <View style={[styles.root, stacked && styles.rootStacked]}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>MINISTÈRE DE LA RELATION D’AIDE</Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {action ? (
        <View style={stacked ? styles.actionFull : undefined}>{action}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 22,
  },
  rootStacked: { alignItems: "stretch", flexDirection: "column" },
  copy: { flex: 1 },
  eyebrow: {
    color: "#9A6B13",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: { color: "#17213B", fontSize: 30, fontWeight: "800", marginTop: 5 },
  subtitle: { color: "#64748B", fontSize: 15, lineHeight: 22, marginTop: 6 },
  actionFull: { width: "100%" },
});
