import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Person } from "@/features/people/person.types";

type Props = {
  person: Person;
  hasOpenCase: boolean;
  pendingFirstInterviewId?: string;
  waitingCaseDecision?: boolean;
  firstInterviewId?: string;
};

export function PersonActions({
  person,
  hasOpenCase,
  pendingFirstInterviewId,
  waitingCaseDecision = false,
  firstInterviewId,
}: Props) {
  return (
    <View style={styles.container}>
      <ActionButton
        title="Modifier"
        variant="secondary"
        onPress={() =>
          router.push({
            pathname: "/people/form",
            params: { id: person.id },
          })
        }
      />

      {hasOpenCase ? (
        <ActionButton
          title="Voir le dossier"
          variant="success"
          onPress={() =>
            router.push({
              pathname: "/cases",
              params: {
                personId: person.id,
              },
            })
          }
        />
      ) : waitingCaseDecision && firstInterviewId ? (
        <>
          <ActionButton
            title="Voir le premier entretien"
            variant="primary"
            onPress={() =>
              router.push({
                pathname: "/activities/[id]",
                params: {
                  id: firstInterviewId,
                },
              })
            }
          />

          <ActionButton
            title="Ouvrir le dossier"
            variant="success"
            onPress={() =>
              router.push({
                pathname: "/cases/new",
                params: {
                  personId: person.id,
                },
              })
            }
          />
        </>
      ) : pendingFirstInterviewId ? (
        <ActionButton
          title="Voir le premier entretien"
          variant="primary"
          onPress={() =>
            router.push({
              pathname: "/activities/[id]",
              params: {
                id: pendingFirstInterviewId,
              },
            })
          }
        />
      ) : (
        <ActionButton
          title="Premier entretien"
          variant="primary"
          onPress={() =>
            router.push({
              pathname: "/activities/new",
              params: {
                personId: person.id,
                personName: person.fullName,
                activityType: "first_interview",
                lockActivityType: "true",
              },
            })
          }
        />
      )}
    </View>
  );
}

function ActionButton({
  title,
  variant,
  onPress,
}: {
  title: string;
  variant: "primary" | "secondary" | "success";
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "success" && styles.success,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "secondary" && styles.secondaryText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  button: {
    minHeight: 46,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  primary: {
    backgroundColor: "#4F46E5",
  },

  secondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },

  success: {
    backgroundColor: "#15803D",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },

  secondaryText: {
    color: "#0F172A",
  },

  pressed: {
    opacity: 0.72,
  },
});
