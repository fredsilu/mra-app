import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Person } from '../person.types';

interface Props { people: Person[]; onOpen: (id: string) => void; }

export function PeopleTable({ people, onOpen }: Props) {
  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, styles.nameCell, styles.headerText]}>Personne</Text>
        <Text style={[styles.cell, styles.headerText]}>Numéro MRA</Text>
        <Text style={[styles.cell, styles.headerText]}>Téléphone</Text>
        <Text style={styles.actionCell} />
      </View>
      {people.map((person) => (
        <TouchableOpacity key={person.id} onPress={() => onOpen(person.id)} style={styles.row}>
          <Text style={[styles.cell, styles.nameCell, styles.name]}>{person.fullName}</Text>
          <Text style={styles.cell}>{person.mraNumber}</Text>
          <Text style={styles.cell}>{person.phone || '—'}</Text>
          <Text style={[styles.actionCell, styles.open]}>Ouvrir</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: { backgroundColor: '#FFFFFF', borderColor: '#E3E8F0', borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  row: { alignItems: 'center', borderBottomColor: '#EDF0F5', borderBottomWidth: 1, flexDirection: 'row', minHeight: 58, paddingHorizontal: 16 },
  header: { backgroundColor: '#F8FAFD', minHeight: 48 },
  cell: { color: '#64748B', flex: 1, fontSize: 14 },
  nameCell: { flex: 1.5 },
  name: { color: '#17213B', fontWeight: '700' },
  headerText: { color: '#475569', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  actionCell: { width: 64 },
  open: { color: '#1F4B8F', fontSize: 13, fontWeight: '800', textAlign: 'right' },
});
