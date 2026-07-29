import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingView } from '@/components/common/LoadingView';
import { Page } from '@/components/layout/Page';
import { PageHeader } from '@/components/layout/PageHeader';
import { PersonCard } from '@/features/people/components/PersonCard';
import { PeopleTable } from '@/features/people/components/PeopleTable';
import { usePeople } from '@/features/people/hooks/usePeople';

export default function PeopleScreen() {
  const vm = usePeople();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const openPerson = (id: string) => router.push({ pathname: '/people/form', params: { id } });

  if (vm.isLoading) return <LoadingView label="Chargement des personnes..." />;

  return (
    <Page>
      <PageHeader
        title="Personnes"
        subtitle="Accueillir, connaître et accompagner chaque personne avec attention."
        action={<AppButton title="Nouvelle personne" onPress={() => router.push('/people/form')} />}
      />

      <View style={styles.toolbar}>
        <View style={styles.search}>
          <AppInput
            value={vm.search}
            onChangeText={vm.setSearch}
            placeholder="Rechercher par nom, téléphone ou numéro MRA"
            autoCapitalize="none"
          />
        </View>
        <Text style={styles.count}>{vm.total} personne(s)</Text>
      </View>

      {vm.people.length === 0 ? (
        <EmptyState
          title={vm.search ? 'Aucun résultat' : 'Aucune personne enregistrée'}
          message={vm.search ? 'Essayez une autre recherche.' : 'Commencez par créer la première fiche.'}
        />
      ) : isDesktop ? (
        <PeopleTable people={vm.people} onOpen={openPerson} />
      ) : (
        <FlatList
          data={vm.people}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PersonCard person={item} onPress={() => openPerson(item.id)} />}
          refreshing={vm.isRefreshing}
          onRefresh={vm.refresh}
          scrollEnabled={false}
        />
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  toolbar: { alignItems: 'center', flexDirection: 'row', gap: 14, marginBottom: 16 },
  search: { flex: 1 },
  count: { color: '#64748B', fontSize: 13, fontWeight: '700' },
});
