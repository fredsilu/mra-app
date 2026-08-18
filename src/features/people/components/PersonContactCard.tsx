// src/features/people/components/PersonContactCard.tsx

import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { COLORS } from "@/constants/theme";
import type { Person } from "@/features/people/person.types";

type Props = {
  person: Person;
};

export function PersonContactCard({ person }: Props) {
  const phone = person.phone?.trim() ?? "";
  const email = person.email?.trim() ?? "";

  async function handleCall() {
    if (!phone) return;
    await Linking.openURL(`tel:${phone}`);
  }

  async function handleWhatsApp() {
    if (!phone) return;

    const normalized = phone.replace(/[^\d+]/g, "");

    const message = encodeURIComponent(
      `Bonjour ${person.fullName},\n\nJe vous contacte dans le cadre du Ministère de la Relation d'Aide (MRA).`,
    );

    const url =
      Platform.OS === "web"
        ? `https://wa.me/${normalized.replace("+", "")}?text=${message}`
        : `whatsapp://send?phone=${normalized}&text=${message}`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      await Linking.openURL(
        `https://wa.me/${normalized.replace("+", "")}?text=${message}`,
      );
    }
  }

  async function handleEmail() {
    if (!email) return;
    await Linking.openURL(`mailto:${email}`);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Coordonnées</Text>

      <Info label="Téléphone" value={phone || "Non renseigné"} />
      <Info label="Email" value={email || "Non renseigné"} />

      {phone ? (
        <View style={styles.actions}>
          <Pressable
            onPress={() => void handleCall()}
            style={({ pressed }) => [
              styles.actionButton,
              styles.callButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.buttonText}>📞 Appeler</Text>
          </Pressable>

          <Pressable
            onPress={() => void handleWhatsApp()}
            style={({ pressed }) => [
              styles.actionButton,
              styles.whatsappButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.buttonText}>💬 WhatsApp</Text>
          </Pressable>
        </View>
      ) : null}

      {email ? (
        <Pressable
          onPress={() => void handleEmail()}
          style={({ pressed }) => [
            styles.emailButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.emailText}>✉️ Envoyer un email</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },

  title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
  },

  info: {
    gap: 4,
  },

  label: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "700",
  },

  value: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },

  actionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
    borderRadius: 10,
  },

  callButton: {
    backgroundColor: "#2563EB",
  },

  whatsappButton: {
    backgroundColor: "#16A34A",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  emailButton: {
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    marginTop: 4,
    minHeight: 44,
    justifyContent: "center",
  },

  emailText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.75,
  },
});
