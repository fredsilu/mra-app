import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { Person } from '../person.types';

interface Props {
  phoneDuplicate: Person | null;
  nameDuplicates: Person[];
  onOpen: (id: string) => void;
  onClosePhone: () => void;
  onCancelNames: () => void;
  onContinue: () => void;
}

export function DuplicateWarnings({
  phoneDuplicate,
  nameDuplicates,
  onOpen,
  onClosePhone,
  onCancelNames,
  onContinue,
}: Props) {
  if (phoneDuplicate) {
    return (
      <View style={[styles.card, styles.danger]}>
        <Text style={styles.title}>Téléphone déjà utilisé</Text>
        <Text style={styles.text}>
          Ce numéro appartient déjà à {phoneDuplicate.fullName} ({phoneDuplicate.mraNumber}).
        </Text>
        <AppButton title="Ouvrir la fiche existante" onPress={() => onOpen(phoneDuplicate.id)} />
        <TouchableOpacity onPress={onClosePhone}><Text style={styles.link}>Fermer</Text></TouchableOpacity>
      </View>
    );
  }

  if (!nameDuplicates.length) return null;

  return (
    <View style={[styles.card, styles.warning]}>
      <Text style={styles.title}>Nom déjà enregistré</Text>
      <Text style={styles.text}>
        Vérifiez les fiches ci-dessous avant de continuer.
      </Text>
      {nameDuplicates.map((person) => (
        <TouchableOpacity key={person.id} onPress={() => onOpen(person.id)} style={styles.personRow}>
          <View>
            <Text style={styles.personName}>{person.fullName}</Text>
            <Text style={styles.personMeta}>{person.mraNumber}{person.phone ? ` · ${person.phone}` : ''}</Text>
          </View>
          <Text style={styles.link}>Ouvrir</Text>
        </TouchableOpacity>
      ))}
      <AppButton title="Continuer malgré l’avertissement" onPress={onContinue} />
      <TouchableOpacity onPress={onCancelNames}><Text style={styles.link}>Annuler</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, gap: 12, padding: 16 },
  danger: { backgroundColor: '#FFF1F1', borderColor: '#E6A3A3' },
  warning: { backgroundColor: '#FFF8E8', borderColor: '#E9C875' },
  title: { color: '#17213B', fontSize: 16, fontWeight: '800' },
  text: { color: '#475569', lineHeight: 21 },
  personRow: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
  personName: { color: '#17213B', fontWeight: '800' },
  personMeta: { color: '#64748B', fontSize: 13, marginTop: 3 },
  link: { color: '#1F4B8F', fontWeight: '800', textAlign: 'center' },
});
