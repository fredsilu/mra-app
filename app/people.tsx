//app/peopple.tsx
import { useCallback, useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
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

  const loadPeople = useCallback(async () => {
    const result = await getPeople();
    setPeople(result);
  }, []);

  useEffect(() => {
    loadPeople();
  }, [loadPeople]);

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
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: '#FFFFFF',
              padding: 16,
              borderRadius: 12,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: '700', fontSize: 16 }}>
              {item.fullName}
            </Text>

            <Text>{item.phone || '-'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text>Aucune personne enregistrée.</Text>
        }
      />
    </SafeAreaView>
  );
}