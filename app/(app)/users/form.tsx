// app/(app)/users/form.tsx
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";

import {
  FormActions,
  FormCard,
  FormHeader,
  FormPage,
} from "@/components/forms";
import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { AppSelect } from "@/components/ui/AppSelect";
import { COLORS } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { getUserById, updateUserProfile } from "@/features/users/user.service";
import type { UserProfile, UserRole } from "@/features/users/user.types";
import { canManageUsers } from "@/permissions";

const roleOptions: Array<{
  label: string;
  value: UserRole;
}> = [
  {
    label: "Responsable",
    value: "responsable",
  },
  {
    label: "Responsable adjoint",
    value: "adjoint",
  },
  {
    label: "Secrétaire",
    value: "secretaire",
  },
  {
    label: "Conseiller",
    value: "conseiller",
  },
];

type ActiveStatus = "active" | "inactive";

const activeOptions: Array<{
  label: string;
  value: ActiveStatus;
}> = [
  {
    label: "Actif",
    value: "active",
  },
  {
    label: "Inactif",
    value: "inactive",
  },
];

export default function UserFormScreen() {
  const { id } = useLocalSearchParams<{
    id?: string;
  }>();

  const { profile } = useAuth();

  const hasPermission = canManageUsers(profile);

  const [user, setUser] = useState<UserProfile | null>(null);

  const [displayName, setDisplayName] = useState("");

  const [role, setRole] = useState<UserRole>();

  const [activeStatus, setActiveStatus] = useState<ActiveStatus>();

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const isCurrentUser = Boolean(id) && profile?.uid === id;

  useEffect(() => {
    async function loadUser(): Promise<void> {
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }

      if (!id) {
        Alert.alert("Erreur", "Identifiant utilisateur manquant.");

        router.back();
        return;
      }

      try {
        const result = await getUserById(id);

        if (!result) {
          Alert.alert("Erreur", "Utilisateur introuvable.");

          router.back();
          return;
        }

        setUser(result);
        setDisplayName(result.displayName);
        setRole(result.role);
        setActiveStatus(result.isActive ? "active" : "inactive");
      } catch (error) {
        console.error("Erreur lors du chargement de l’utilisateur :", error);

        Alert.alert("Erreur", "Impossible de charger cet utilisateur.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadUser();
  }, [hasPermission, id]);

  async function handleSave(): Promise<void> {
    if (!id || !user || isSaving) {
      return;
    }

    const normalizedDisplayName = displayName.trim();

    if (!normalizedDisplayName) {
      Alert.alert("Validation", "Le nom est obligatoire.");
      return;
    }

    if (!role) {
      Alert.alert("Validation", "Le rôle est obligatoire.");
      return;
    }

    if (!activeStatus) {
      Alert.alert("Validation", "Le statut est obligatoire.");
      return;
    }

    const requestedIsActive = activeStatus === "active";

    if (isCurrentUser && role !== user.role) {
      Alert.alert(
        "Action interdite",
        "Vous ne pouvez pas modifier votre propre rôle.",
      );
      return;
    }

    if (isCurrentUser && !requestedIsActive) {
      Alert.alert(
        "Action interdite",
        "Vous ne pouvez pas désactiver votre propre compte.",
      );
      return;
    }

    try {
      setIsSaving(true);

      await updateUserProfile(id, {
        displayName: normalizedDisplayName,
        role: isCurrentUser ? user.role : role,
        isActive: isCurrentUser ? true : requestedIsActive,
      });

      Alert.alert("Succès", "Utilisateur modifié avec succès.");

      router.back();
    } catch (error) {
      console.error("Erreur lors de la modification de l’utilisateur :", error);

      Alert.alert("Erreur", "Impossible de modifier cet utilisateur.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.deniedTitle}>Accès refusé</Text>

        <Text style={styles.deniedText}>
          Seuls le responsable et le responsable adjoint peuvent modifier les
          utilisateurs.
        </Text>

        <View style={styles.backAction}>
          <AppButton title="Retour" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <FormPage>
      <FormHeader
        title="Modifier l’utilisateur"
        description="Mettez à jour les informations, le rôle et le statut de cet utilisateur."
      />

      <FormCard
        title="Informations générales"
        description="Les informations d’identification du compte."
      >
        <View style={styles.field}>
          <Text style={styles.label}>Nom complet *</Text>

          <AppInput
            placeholder="Nom complet"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>

          <AppInput
            placeholder="Email"
            value={user.email}
            editable={false}
            autoCapitalize="none"
          />

          <Text style={styles.helperText}>
            L’adresse email ne peut pas être modifiée depuis cet écran.
          </Text>
        </View>
      </FormCard>

      <FormCard
        title="Accès et permissions"
        description="Définissez le rôle et l’état du compte."
      >
        <AppSelect
          label="Rôle"
          placeholder="Sélectionner le rôle"
          value={role}
          options={roleOptions}
          onValueChange={(value) => {
            if (isCurrentUser) {
              Alert.alert(
                "Action interdite",
                "Vous ne pouvez pas modifier votre propre rôle.",
              );
              return;
            }

            setRole(value);
          }}
          required
        />

        <AppSelect
          label="Statut"
          placeholder="Sélectionner le statut"
          value={activeStatus}
          options={activeOptions}
          onValueChange={(value) => {
            if (isCurrentUser && value === "inactive") {
              Alert.alert(
                "Action interdite",
                "Vous ne pouvez pas désactiver votre propre compte.",
              );
              return;
            }

            setActiveStatus(value);
          }}
          required
        />

        {isCurrentUser ? (
          <View style={styles.warning}>
            <Text style={styles.warningText}>
              Pour des raisons de sécurité, vous ne pouvez pas modifier votre
              propre rôle ni désactiver votre propre compte.
            </Text>
          </View>
        ) : null}
      </FormCard>

      <FormActions>
        <View style={styles.actionButton}>
          <AppButton
            title="Annuler"
            disabled={isSaving}
            onPress={() => router.back()}
          />
        </View>

        <View style={styles.actionButton}>
          <AppButton
            title={isSaving ? "Enregistrement..." : "Enregistrer"}
            disabled={isSaving}
            onPress={() => {
              void handleSave();
            }}
          />
        </View>
      </FormActions>
    </FormPage>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    backgroundColor: COLORS.light,
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  deniedTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },

  deniedText: {
    color: COLORS.muted,
    lineHeight: 21,
    marginTop: 12,
    textAlign: "center",
  },

  backAction: {
    marginTop: 24,
    maxWidth: 300,
    width: "100%",
  },

  loadingText: {
    color: COLORS.text,
  },

  field: {
    gap: 7,
  },

  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },

  helperText: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 18,
  },

  warning: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FDBA74",
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },

  warningText: {
    color: "#C2410C",
    fontWeight: "600",
    lineHeight: 20,
  },

  actionButton: {
    minWidth: 150,
  },
});
