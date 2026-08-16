//src/features/activities/components/ActivityActions.tsx
import { router } from "expo-router";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";

type Props = {
  personId: string;
};

export function ActivityActions({ personId }: Props) {
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
        title="Retour aux activités"
        secondary
        compact
        onPress={() => router.push("/activities")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 0,
    width: "100%",
  },

  containerDesktop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
