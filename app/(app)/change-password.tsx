//app/(app)/change-password.tsx
// app/(app)/change-password.tsx

import { router } from "expo-router";
import { useState } from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";

import { FormCard, FormHeader, FormPage } from "@/components/forms";
import { FormField } from "@/components/forms/FormField";
import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { COLORS } from "@/constants/theme";
import { changePassword } from "@/features/auth/auth.service";

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
        return "Le mot de passe actuel est incorrect.";

      case "auth/too-many-requests":
        return "Trop de tentatives. Veuillez réessayer plus tard.";

      case "auth/network-request-failed":
        return "Connexion au serveur impossible. Vérifiez votre connexion Internet.";

      case "auth/requires-recent-login":
        return "Votre session doit être réauthentifiée avant de modifier le mot de passe.";
    }
  }

  if (error instanceof Error) {
    switch (error.message) {
      case "USER_NOT_AUTHENTICATED":
        return "Votre session n’est plus valide.";

      case "USER_EMAIL_MISSING":
        return "Impossible d’identifier l’adresse email du compte.";

      case "CURRENT_PASSWORD_REQUIRED":
        return "Le mot de passe actuel est obligatoire.";

      case "NEW_PASSWORD_REQUIRED":
        return "Le nouveau mot de passe est obligatoire.";

      case "NEW_PASSWORD_TOO_SHORT":
        return "Le nouveau mot de passe doit contenir au moins 8 caractères.";

      case "PASSWORDS_ARE_IDENTICAL":
        return "Le nouveau mot de passe doit être différent de l’ancien.";
    }
  }

  return "Impossible de modifier le mot de passe.";
}

function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (isSaving) {
      return;
    }

    if (!currentPassword) {
      showMessage("Champ obligatoire", "Saisissez votre mot de passe actuel.");
      return;
    }

    if (newPassword.length < 8) {
      showMessage(
        "Mot de passe trop court",
        "Le nouveau mot de passe doit contenir au moins 8 caractères.",
      );
      return;
    }

    if (newPassword !== confirmation) {
      showMessage(
        "Confirmation incorrecte",
        "Les deux nouveaux mots de passe ne correspondent pas.",
      );
      return;
    }

    try {
      setIsSaving(true);

      await changePassword(currentPassword, newPassword);

      showMessage(
        "Mot de passe modifié",
        "Votre mot de passe a été modifié avec succès.",
      );

      router.back();
    } catch (error) {
      console.error("Erreur modification mot de passe :", error);

      showMessage("Modification impossible", getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <FormPage>
      <FormHeader
        title="Modifier mon mot de passe"
        description="Pour votre sécurité, confirmez votre mot de passe actuel avant d’en choisir un nouveau."
      />

      <FormCard
        title="Sécurité du compte"
        description="Le nouveau mot de passe doit contenir au moins 8 caractères."
      >
        <View style={styles.form}>
          <FormField label="Mot de passe actuel" required>
            <AppInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Votre mot de passe actuel"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSaving}
            />
          </FormField>

          <FormField label="Nouveau mot de passe" required>
            <AppInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Minimum 8 caractères"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSaving}
            />
          </FormField>

          <FormField label="Confirmer le nouveau mot de passe" required>
            <AppInput
              value={confirmation}
              onChangeText={setConfirmation}
              placeholder="Répétez le nouveau mot de passe"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSaving}
            />
          </FormField>
        </View>
      </FormCard>

      <View style={styles.actions}>
        <AppButton
          title="Annuler"
          secondary
          compact
          disabled={isSaving}
          onPress={() => router.back()}
        />

        <AppButton
          title={isSaving ? "Modification..." : "Modifier le mot de passe"}
          compact
          disabled={isSaving}
          onPress={() => {
            void handleSave();
          }}
        />
      </View>
    </FormPage>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 14,
  },

  actions: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "flex-end",
  },
});
