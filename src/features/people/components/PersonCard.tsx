import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Person } from '../person.types';

interface Props { person: Person; onPress: () => void; }

export function PersonCard({ person, onPress }: Props) {
  const initials = person.fullName.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
      <View style={styles.avatar}><Text style={styles.initials}>{initials}</Text></View>
      <View style={styles.content}>
        <Text style={styles.name}>{person.fullName}</Text>
        <Text style={styles.meta}>{person.mraNumber}</Text>
        <Text style={styles.meta}>{person.phone || 'Aucun téléphone'}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E3E8F0', borderRadius: 16, borderWidth: 1, flexDirection: 'row', gap: 13, marginBottom: 10, padding: 14 },
  avatar: { alignItems: 'center', backgroundColor: '#EEF4FF', borderRadius: 24, height: 48, justifyContent: 'center', width: 48 },
  initials: { color: '#1F4B8F', fontSize: 15, fontWeight: '800' },
  content: { flex: 1 },
  name: { color: '#17213B', fontSize: 16, fontWeight: '800' },
  meta: { color: '#64748B', fontSize: 13, marginTop: 3 },
  arrow: { color: '#9A6B13', fontSize: 28 },
});
