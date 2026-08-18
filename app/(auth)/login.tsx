//app/(auth)/login.tsx
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { APP_FULL_NAME, COLORS } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { resetPassword } from "@/features/auth/auth.service";

function getLoginErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    switch (error.code) {
      case "auth/invalid-email":
        return "L’adresse email renseignée n’est pas valide.";

      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Adresse email ou mot de passe incorrect.";

      case "auth/user-disabled":
        return "Ce compte Firebase a été désactivé.";

      case "auth/network-request-failed":
        return "Connexion au serveur impossible. Vérifiez votre connexion Internet.";

      case "auth/too-many-requests":
        return "Trop de tentatives. Veuillez réessayer plus tard.";
    }
  }

  return "Une erreur est survenue pendant la connexion.";
}

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isResetting, setIsResetting] = useState(false);

  async function handleLogin() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      Alert.alert(
        "Champs obligatoires",
        "Veuillez saisir votre adresse email et votre mot de passe.",
      );

      return;
    }

    try {
      setIsSubmitting(true);

      await login(normalizedEmail, password);
    } catch (error) {
      console.error("Erreur de connexion :", error);

      Alert.alert("Connexion impossible", getLoginErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      Alert.alert(
        "Adresse email requise",
        "Saisissez votre adresse email avant de demander la réinitialisation.",
      );

      return;
    }

    try {
      setIsResetting(true);

      await resetPassword(normalizedEmail);

      Alert.alert(
        "Email envoyé",
        "Un lien de réinitialisation du mot de passe a été envoyé.",
      );
    } catch (error) {
      console.error("Erreur de réinitialisation :", error);

      Alert.alert(
        "Réinitialisation impossible",
        "Impossible d’envoyer le lien de réinitialisation.",
      );
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: COLORS.light,
      }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <Image
            source={require("@/assets/logo-mra.jpg")}
            style={{
              width: 120,
              height: 120,
              resizeMode: "contain",
              borderRadius: 18,
              marginBottom: 16,
            }}
          />

          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: COLORS.text,
            }}
          >
            Connexion
          </Text>

          <Text
            style={{
              marginTop: 6,
              color: COLORS.muted,
              textAlign: "center",
            }}
          >
            {APP_FULL_NAME}
          </Text>
        </View>

        <View style={{ gap: 14 }}>
          <AppInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!isSubmitting && !isResetting}
          />

          <AppInput
            placeholder="Mot de passe"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
            editable={!isSubmitting && !isResetting}
          />

          <TouchableOpacity
            disabled={isSubmitting || isResetting}
            onPress={handleResetPassword}
            style={{
              alignSelf: "flex-end",
            }}
          >
            <Text
              style={{
                color: COLORS.primary,
                fontWeight: "600",
              }}
            >
              {isResetting ? "Envoi en cours..." : "Mot de passe oublié ?"}
            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: 8 }}>
            <AppButton
              title={isSubmitting ? "Connexion..." : "Se connecter"}
              onPress={handleLogin}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
