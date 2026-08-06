import { router } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { AppInput } from "@/components/ui/AppInput";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingView } from "@/components/common/LoadingView";
import { Page } from "@/components/layout/Page";
import { PageHeader } from "@/components/layout/PageHeader";
import { PersonCard } from "@/features/people/components/PersonCard";
import { PeopleTable } from "@/features/people/components/PeopleTable";
import { usePeople } from "@/features/people/hooks/usePeople";
import { COLORS } from "@/constants/theme";

export default function PeopleScreen() {
  const vm = usePeople();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const openPerson = (id: string) =>
    router.push({
      pathname: "/people/[id]",
      params: { id },
    });

  if (vm.isLoading) return <LoadingView label="Chargement des personnes..." />;

  return (
    <Page>
      <View style={[styles.header, !isDesktop && styles.headerMobile]}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>MINISTÈRE DE LA RELATION D’AIDE</Text>

          <Text style={styles.title}>Personnes</Text>

          <Text style={styles.subtitle}>
            Accueillir, connaître et accompagner chaque personne avec attention.
          </Text>
        </View>

        <View style={!isDesktop ? styles.mobileButton : undefined}>
          <Pressable
            onPress={() => router.push("/people/form")}
            style={({ pressed }) => [
              styles.newButton,
              pressed ? styles.buttonPressed : null,
            ]}
          >
            <Text style={styles.newButtonText}>Nouvelle personne</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.toolbar, !isDesktop && styles.toolbarMobile]}>
        <View style={styles.searchContainer}>
          <AppInput
            value={vm.search}
            onChangeText={vm.setSearch}
            placeholder="Rechercher par nom, téléphone ou numéro MRA"
            autoCapitalize="none"
          />
        </View>

        <Text
          style={[styles.resultCount, !isDesktop && styles.resultCountMobile]}
        >
          {vm.people.length} personne(s)
        </Text>
      </View>

      {vm.people.length === 0 ? (
        <EmptyState
          title={vm.search ? "Aucun résultat" : "Aucune personne enregistrée"}
          message={
            vm.search
              ? "Essayez une autre recherche."
              : "Commencez par créer la première fiche."
          }
        />
      ) : isDesktop ? (
        <PeopleTable people={vm.people} onOpen={openPerson} />
      ) : (
        <FlatList
          data={vm.people}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PersonCard person={item} onPress={() => openPerson(item.id)} />
          )}
          refreshing={vm.isRefreshing}
          onRefresh={vm.refresh}
          scrollEnabled={false}
        />
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 24,
    justifyContent: "space-between",
    marginBottom: 24,
    maxWidth: 1400,
  },

  headerMobile: {
    flexDirection: "column",
    gap: 16,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    color: "#9A6700",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  title: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: "900",
    marginTop: 12,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
  },

  mobileButton: {
    width: "100%",
  },
  toolbar: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
    maxWidth: 1200,
  },

  searchContainer: {
    flex: 1,
    maxWidth: 1000,
  },

  resultCount: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: "700",
    minWidth: 130,
    textAlign: "left",
  },

  toolbarMobile: {
    alignItems: "stretch",
    flexDirection: "column",
    gap: 10,
  },

  resultCountMobile: {
    minWidth: 0,
    textAlign: "left",
  },
  newButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  newButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
