// src/features/cases/components/CaseActions.tsx

import { router } from "expo-router";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";

type Props = {
  personId: string;
};

export function CaseActions({ personId }: Props) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  return (
    <View style={[styles.container, isDesktop && styles.containerDesktop]}>
      <View style={[styles.actionItem, isDesktop && styles.actionItemDesktop]}>
        <AppButton
          title="Voir la personne"
          compact
          onPress={() =>
            router.push({
              pathname: "/people/[id]",
              params: {
                id: personId,
              },
            })
          }
        />
      </View>

      <View style={[styles.actionItem, isDesktop && styles.actionItemDesktop]}>
        <AppButton
          title="Retour"
          secondary
          compact
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 0,
    marginTop: 0,
    width: "100%",
  },

  containerDesktop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  actionItem: {
    width: "100%",
  },

  actionItemDesktop: {
    width: "auto",
  },
});
