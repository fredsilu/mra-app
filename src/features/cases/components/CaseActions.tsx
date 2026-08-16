//src/features/cases/components/CaseActions.tsx
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

      <AppButton
        title="Retour"
        secondary
        compact
        onPress={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 12,
  },

  containerDesktop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
