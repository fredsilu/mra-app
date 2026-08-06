import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";

type Props = {
  personId: string;
};

export function CaseActions({ personId }: Props) {
  return (
    <View style={styles.container}>
      <AppButton
        title="Voir la personne"
        onPress={() =>
          router.push({
            pathname: "/people/[id]",
            params: {
              id: personId,
            },
          })
        }
      />

      <AppButton title="Retour" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginTop: 28,
  },
});
