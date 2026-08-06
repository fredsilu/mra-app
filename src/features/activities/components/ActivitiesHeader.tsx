import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  count: number;
};

export function ActivitiesHeader({ count }: Props) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Activités</Text>

        <Text style={styles.subtitle}>{count} activité(s)</Text>
      </View>

      <Pressable
        onPress={() => router.push("/people")}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>Nouvelle activité</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  title: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "800",
  },

  subtitle: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 2,
  },

  button: {
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
