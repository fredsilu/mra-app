// src/components/layout/AppNavigationMenu.tsx

import { router } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { canManageAgenda, canManageUsers } from "@/permissions";

export function AppNavigationMenu() {
  const { profile, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!profile) {
    return null;
  }

  function navigate(path: string) {
    setOpen(false);
    router.push(path as never);
  }

  async function handleLogout() {
    setOpen(false);
    await logout();
    router.replace("/login");
  }

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.menuButton,
          pressed ? styles.pressed : null,
        ]}
      >
        <Text style={styles.menuIcon}>☰</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />

          <View style={styles.panel}>
            <View style={styles.header}>
              <View style={styles.headerCopy}>
                <Text style={styles.appName}>
                  MINISTÈRE DE LA RELATION D’AIDE
                </Text>

                <Text style={styles.userName}>{profile.displayName}</Text>

                <Text style={styles.role}>{getRoleLabel(profile.role)}</Text>
              </View>

              <Pressable
                onPress={() => setOpen(false)}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed ? styles.itemPressed : null,
                ]}
              >
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            <View style={styles.divider} />

            {profile.role !== "conseiller" ? (
              <MenuItem
                icon="⌂"
                label="Tableau de bord"
                onPress={() => navigate("/dashboard")}
              />
            ) : null}

            <MenuItem
              icon="👤"
              label="Personnes"
              onPress={() => navigate("/people")}
            />

            <MenuItem
              icon="▣"
              label="Activités"
              onPress={() => navigate("/activities")}
            />

            <MenuItem
              icon="▱"
              label="Dossiers"
              onPress={() => navigate("/cases")}
            />

            {canManageAgenda(profile) ? (
              <MenuItem
                icon="◷"
                label="Agenda"
                onPress={() => navigate("/activities")}
              />
            ) : null}

            <MenuItem
              icon="◎"
              label="Mon espace conseiller"
              onPress={() => navigate("/counselors")}
            />

            {canManageUsers(profile) ? (
              <MenuItem
                icon="⚙"
                label="Utilisateurs"
                onPress={() => navigate("/users")}
              />
            ) : null}

            <MenuItem
              icon="🔑"
              label="Modifier mon mot de passe"
              onPress={() => navigate("/change-password")}
            />

            <View style={styles.divider} />

            <MenuItem
              icon="↪"
              label="Se déconnecter"
              danger
              onPress={() => {
                void handleLogout();
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

function MenuItem({
  icon,
  label,
  danger = false,
  onPress,
}: {
  icon: string;
  label: string;
  danger?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.item,
        pressed ? styles.itemPressed : null,
      ]}
    >
      <Text style={styles.itemIcon}>{icon}</Text>

      <Text style={[styles.itemText, danger ? styles.dangerText : null]}>
        {label}
      </Text>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

function getRoleLabel(role: string): string {
  switch (role) {
    case "responsable":
      return "Responsable";

    case "adjoint":
      return "Responsable adjoint";

    case "secretaire":
      return "Secrétaire";

    case "conseiller":
      return "Conseiller";

    default:
      return "";
  }
}

const styles = StyleSheet.create({
  menuButton: {
    alignItems: "center",
    backgroundColor: "#17213B",
    borderRadius: 12,
    height: 44,
    justifyContent: "center",
    width: 44,
  },

  menuIcon: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },

  overlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(15, 23, 42, 0.48)",
  },

  panel: {
    backgroundColor: COLORS.white,
    height: "100%",
    maxWidth: 370,
    paddingHorizontal: 18,
    paddingTop: 24,
    width: "88%",
  },

  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },

  headerCopy: {
    flex: 1,
  },

  appName: {
    color: "#9A6B13",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  userName: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 8,
  },

  role: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 3,
  },

  closeButton: {
    alignItems: "center",
    borderRadius: 10,
    height: 42,
    justifyContent: "center",
    width: 42,
  },

  closeText: {
    color: COLORS.text,
    fontSize: 30,
    lineHeight: 32,
  },

  divider: {
    backgroundColor: COLORS.border,
    height: 1,
    marginVertical: 16,
  },

  item: {
    alignItems: "center",
    borderRadius: 12,
    flexDirection: "row",
    minHeight: 54,
    paddingHorizontal: 10,
  },

  itemPressed: {
    backgroundColor: "#F1F5F9",
  },

  itemIcon: {
    color: "#17213B",
    fontSize: 20,
    width: 36,
  },

  itemText: {
    color: COLORS.text,
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
  },

  dangerText: {
    color: "#B91C1C",
  },

  arrow: {
    color: "#94A3B8",
    fontSize: 24,
  },

  pressed: {
    opacity: 0.78,
  },
});
