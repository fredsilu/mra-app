import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';

interface Props {
  isEditing: boolean;
  isSaving: boolean;
  isArchiving: boolean;
  disabled?: boolean;
  onSave: () => void;
  onArchive: () => void;
}

export function FormActions({
  isEditing,
  isSaving,
  isArchiving,
  disabled,
  onSave,
  onArchive,
}: Props) {
  return (
    <View style={styles.root}>
      {!disabled ? (
        <AppButton
          title={isSaving ? 'Enregistrement...' : isEditing ? 'Enregistrer les modifications' : 'Créer la personne'}
          onPress={onSave}
        />
      ) : null}

      {isEditing && !disabled ? (
        <View style={styles.archiveBox}>
          <Text style={styles.archiveText}>
            L’archivage retire la personne de la liste active sans supprimer son historique.
          </Text>
          <TouchableOpacity
            disabled={isArchiving || isSaving}
            onPress={onArchive}
            style={styles.archiveButton}
          >
            <Text style={styles.archiveLabel}>
              {isArchiving ? 'Archivage...' : 'Archiver la personne'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 16, marginTop: 18 },
  archiveBox: { borderTopColor: '#E3E8F0', borderTopWidth: 1, gap: 12, paddingTop: 18 },
  archiveText: { color: '#64748B', lineHeight: 20 },
  archiveButton: { alignItems: 'center', borderColor: '#C62828', borderRadius: 12, borderWidth: 1, paddingVertical: 14 },
  archiveLabel: { color: '#C62828', fontWeight: '800' },
});
