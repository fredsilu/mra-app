// app/(app)/users/index.tsx

import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { AppInput } from "@/components/ui/AppInput";
import { COLORS } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { getUsers } from "@/features/users/user.service";
import type { UserProfile, UserRole } from "@/features/users/user.types";
import { canManageUsers } from "@/permissions";

const roleLabels: Record<UserRole, string> = {
  responsable: "Responsable",
  adjoint: "Responsable adjoint",
  secretaire: "Secrétaire",
  conseiller: "Conseiller",
};

export default function UsersScreen() {
  const { profile } = useAuth();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;
  const hasPermission = canManageUsers(profile);

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadUsers = useCallback(
    async (refreshOnly = false) => {
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }

      try {
        if (refreshOnly) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        setUsers(await getUsers());
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs :", error);

        Alert.alert("Erreur", "Impossible de charger les utilisateurs.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [hasPermission],
  );

  useFocusEffect(
    useCallback(() => {
      void loadUsers();
    }, [loadUsers]),
  );

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.displayName.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        roleLabels[user.role].toLowerCase().includes(normalizedSearch)
      );
    });
  }, [search, users]);

  const statistics = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.isActive).length,
      inactive: users.filter((user) => !user.isActive).length,
    }),
    [users],
  );

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.deniedTitle}>Accès refusé</Text>

        <Text style={styles.deniedText}>
          Seuls le responsable et le responsable adjoint peuvent gérer les
          utilisateurs.
        </Text>
      </SafeAreaView>
    );
  }

  if (isLoading && users.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Chargement des utilisateurs...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={[styles.header, !isDesktop ? styles.headerMobile : null]}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>ADMINISTRATION</Text>

            <Text style={styles.title}>Utilisateurs</Text>

            <Text style={styles.subtitle}>
              Gérez les comptes, les rôles et les accès à l’application.
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/users/user-create")}
            style={({ pressed }) => [
              styles.newButton,
              !isDesktop ? styles.newButtonMobile : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.newButtonText}>Nouvel utilisateur</Text>
          </Pressable>
        </View>

        <View
          style={[styles.statistics, isDesktop && styles.statisticsDesktop]}
        >
          <SummaryCard
            label="Total"
            value={statistics.total}
            compact={isDesktop}
          />

          <SummaryCard
            label="Actifs"
            value={statistics.active}
            variant="active"
            compact={isDesktop}
          />

          <SummaryCard
            label="Inactifs"
            value={statistics.inactive}
            variant="inactive"
            compact={isDesktop}
          />
        </View>

        <View
          style={[styles.toolbar, !isDesktop ? styles.toolbarMobile : null]}
        >
          <View style={styles.searchContainer}>
            <AppInput
              placeholder="Rechercher par nom, email ou rôle"
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
            />
          </View>

          <Text
            style={[
              styles.resultCount,
              !isDesktop ? styles.resultCountMobile : null,
            ]}
          >
            {filteredUsers.length} utilisateur(s)
          </Text>
        </View>

        {isDesktop ? (
          <UsersTable
            users={filteredUsers}
            refreshing={isRefreshing}
            onRefresh={() => void loadUsers(true)}
          />
        ) : (
          <FlatList
            style={styles.list}
            data={filteredUsers}
            keyExtractor={(item) => item.uid}
            refreshing={isRefreshing}
            onRefresh={() => void loadUsers(true)}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <EmptyUsers hasSearch={Boolean(search.trim())} />
            }
            renderItem={({ item }) => <UserCard user={item} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function UsersTable({
  users,
  refreshing,
  onRefresh,
}: {
  users: UserProfile[];
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.nameColumn]}>
          Utilisateur
        </Text>

        <Text style={[styles.tableHeaderText, styles.emailColumn]}>Email</Text>

        <Text style={[styles.tableHeaderText, styles.roleColumn]}>Rôle</Text>

        <Text style={[styles.tableHeaderText, styles.statusColumn]}>
          Statut
        </Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyUsers hasSearch />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/users/form",
                params: { id: item.uid },
              })
            }
            style={({ pressed }) => [
              styles.tableRow,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text
              numberOfLines={1}
              style={[styles.tableTextStrong, styles.nameColumn]}
            >
              {item.displayName || "Nom non renseigné"}
            </Text>

            <Text
              numberOfLines={1}
              style={[styles.tableText, styles.emailColumn]}
            >
              {item.email || "Email non renseigné"}
            </Text>

            <Text style={[styles.tableText, styles.roleColumn]}>
              {roleLabels[item.role]}
            </Text>

            <View style={styles.statusColumn}>
              <StatusBadge active={item.isActive} />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

function UserCard({ user }: { user: UserProfile }) {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/users/form",
          params: { id: user.uid },
        })
      }
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(user.displayName)}</Text>
        </View>

        <View style={styles.cardIdentity}>
          <Text style={styles.cardName}>
            {user.displayName || "Nom non renseigné"}
          </Text>

          <Text style={styles.cardEmail}>
            {user.email || "Email non renseigné"}
          </Text>
        </View>

        <StatusBadge active={user.isActive} />
      </View>

      <Text style={styles.cardRole}>{roleLabels[user.role]}</Text>
    </Pressable>
  );
}

function SummaryCard({
  label,
  value,
  variant,
  compact = false,
}: {
  label: string;
  value: number;
  variant?: "active" | "inactive";
  compact?: boolean;
}) {
  return (
    <View
      style={[
        styles.summaryCard,
        compact && styles.summaryCardDesktop,
        variant === "active" ? styles.summaryCardActive : null,
        variant === "inactive" ? styles.summaryCardInactive : null,
      ]}
    >
      <Text
        style={[
          styles.summaryValue,
          compact && styles.summaryValueDesktop,
          variant === "active" ? styles.summaryValueActive : null,
          variant === "inactive" ? styles.summaryValueInactive : null,
        ]}
      >
        {value}
      </Text>

      <Text
        style={[styles.summaryLabel, compact && styles.summaryLabelDesktop]}
      >
        {label}
      </Text>
    </View>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <View
      style={[
        styles.statusBadge,
        active ? styles.activeBadge : styles.inactiveBadge,
      ]}
    >
      <Text
        style={[
          styles.statusText,
          active ? styles.activeText : styles.inactiveText,
        ]}
      >
        {active ? "Actif" : "Inactif"}
      </Text>
    </View>
  );
}

function EmptyUsers({ hasSearch }: { hasSearch: boolean }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>Aucun utilisateur</Text>

      <Text style={styles.emptyText}>
        {hasSearch
          ? "Aucun utilisateur ne correspond à cette recherche."
          : "Aucun utilisateur enregistré."}
      </Text>
    </View>
  );
}

function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "MRA"
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
    marginBottom: 14,
  },

  headerMobile: {
    flexDirection: "column",
    gap: 16,
  },

  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 5,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  center: {
    alignItems: "center",
    backgroundColor: COLORS.light,
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    color: COLORS.muted,
    marginTop: 12,
  },
  deniedTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "800",
  },
  deniedText: {
    color: COLORS.muted,
    lineHeight: 21,
    marginTop: 12,
    textAlign: "center",
  },

  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: "#7C3AED",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.1,
  },

  newButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  newButtonMobile: {
    alignItems: "center",
    width: "100%",
  },
  newButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
  statistics: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  statisticsDesktop: {
    gap: 8,
    marginBottom: 10,
  },

  summaryCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },

  summaryCardDesktop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    minHeight: 54,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  summaryCardActive: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },

  summaryCardInactive: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },

  summaryValue: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "800",
  },

  summaryValueDesktop: {
    fontSize: 20,
  },

  summaryValueActive: {
    color: "#15803D",
  },

  summaryValueInactive: {
    color: "#B91C1C",
  },

  summaryLabel: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
  },

  summaryLabelDesktop: {
    fontSize: 13,
    marginTop: 0,
  },

  toolbar: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  toolbarMobile: {
    alignItems: "stretch",
    flexDirection: "column",
    gap: 8,
  },
  searchContainer: {
    flex: 1,
  },
  resultCount: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: "700",
    minWidth: 140,
    textAlign: "right",
  },
  resultCountMobile: {
    minWidth: 0,
    textAlign: "left",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 30,
  },
  table: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#F8FAFC",
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  tableHeaderText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "800",
  },
  tableRow: {
    alignItems: "center",
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  tableText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  tableTextStrong: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },
  nameColumn: {
    flex: 1.2,
  },
  emailColumn: {
    flex: 1.5,
  },
  roleColumn: {
    flex: 0.8,
  },
  statusColumn: {
    alignItems: "flex-end",
    width: 100,
  },
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#E0E7FF",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  avatarText: {
    color: "#4338CA",
    fontWeight: "800",
  },

  cardIdentity: {
    flex: 1,
  },
  cardName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
  },
  cardEmail: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 4,
  },
  cardRole: {
    color: "#4F46E5",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 14,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  activeBadge: {
    backgroundColor: "#DCFCE7",
  },
  inactiveBadge: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },
  activeText: {
    color: "#15803D",
  },
  inactiveText: {
    color: "#B91C1C",
  },
  empty: {
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  emptyText: {
    color: COLORS.muted,
    marginTop: 7,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});
