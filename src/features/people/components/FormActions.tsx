//src/features/people/components/FormActions.tsx
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/AppButton";

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
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  return (
    <View style={styles.root}>
      {!disabled ? (
        <View
          style={[
            styles.primaryActions,
            isDesktop && styles.primaryActionsDesktop,
          ]}
        >
          <AppButton
            title={
              isSaving
                ? "Enregistrement..."
                : isEditing
                  ? "Enregistrer les modifications"
                  : "Créer la personne"
            }
            disabled={isSaving || isArchiving}
            onPress={onSave}
            compact
          />
        </View>
      ) : null}

      {isEditing && !disabled ? (
        <View style={styles.archiveBox}>
          <Text style={styles.archiveText}>
            L’archivage retire la personne de la liste active sans supprimer son
            historique.
          </Text>

          <TouchableOpacity
            disabled={isArchiving || isSaving}
            onPress={onArchive}
            style={[
              styles.archiveButton,
              isDesktop && styles.archiveButtonDesktop,
              isArchiving || isSaving ? styles.disabled : null,
            ]}
          >
            <Text style={styles.archiveLabel}>
              {isArchiving ? "Archivage..." : "Archiver la personne"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 16,
    marginTop: 10,
  },

  primaryActions: {
    width: "100%",
  },

  primaryActionsDesktop: {
    alignItems: "flex-end",
  },

  archiveBox: {
    borderTopColor: "#E3E8F0",
    borderTopWidth: 1,
    gap: 10,
    paddingTop: 14,
  },

  archiveText: {
    color: "#64748B",
    lineHeight: 20,
  },

  archiveButton: {
    alignItems: "center",
    borderColor: "#C62828",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  archiveButtonDesktop: {
    alignSelf: "flex-end",
    minWidth: 180,
    maxWidth: 240,
  },

  archiveLabel: {
    color: "#C62828",
    fontWeight: "800",
  },

  disabled: {
    opacity: 0.55,
  },
});
