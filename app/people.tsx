//app/people.tsx

import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppButton } from '../src/components/ui/AppButton';
import { COLORS } from '../src/constants/theme';
import { getPeople } from '../src/services/person.service';
import { Person } from '../src/types/person.types';

export default function PeopleScreen() {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadPeople = useCallback(async (refreshing = false) => {
    try {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const result = await getPeople();

      const sortedPeople = [...result].sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
      );

      setPeople(sortedPeople);
    } catch (error) {
      console.error('Erreur lors du chargement des personnes :', error);

      Alert.alert(
        'Erreur',
        'Impossible de charger la liste des personnes.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPeople();
    }, [loadPeople])
  );

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.light,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" />

        <Text
          style={{
            marginTop: 12,
            color: COLORS.text,
          }}
        >
          Chargement des personnes...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.light,
        padding: 16,
      }}
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: '700',
          color: COLORS.text,
          marginBottom: 20,
        }}
      >
        Personnes
      </Text>

      <AppButton
        title="Nouvelle personne"
        onPress={() => router.push('/person-form')}
      />

      <View style={{ height: 20 }} />

      <FlatList
        data={people}
        keyExtractor={(item) => item.id}
        refreshing={isRefreshing}
        onRefresh={() => loadPeople(true)}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/person-form',
                params: { id: item.id },
              })
            }
            style={{
              backgroundColor: COLORS.white,
              padding: 16,
              borderRadius: 12,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: COLORS.text,
              }}
            >
              {item.fullName}
            </Text>

            <Text
              style={{
                marginTop: 5,
                color: COLORS.muted,
              }}
            >
              {item.mraNumber || 'Numéro MRA non attribué'}
            </Text>

            <Text
              style={{
                marginTop: 3,
                color: COLORS.muted,
              }}
            >
              {item.phone || 'Aucun téléphone'}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 30,
            }}
          >
            <Text
              style={{
                color: COLORS.muted,
                textAlign: 'center',
              }}
            >
              Aucune personne enregistrée.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}