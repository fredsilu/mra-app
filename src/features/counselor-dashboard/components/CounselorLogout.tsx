//src/features/counselor-dashboard/components/CounselorLogout.tsx
import { StyleSheet, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";

type Props = {
  isLoggingOut: boolean;
  onLogout: () => void;
};

export function CounselorLogout({ isLoggingOut, onLogout }: Props) {
  return (
    <View style={styles.container}>
      <AppButton
        title={isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
        disabled={isLoggingOut}
        onPress={onLogout}
        compact
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
  },
});
