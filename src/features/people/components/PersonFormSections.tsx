import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppInput } from '@/components/ui/AppInput';
import { AppSelect } from '@/components/ui/AppSelect';
import { FormField } from '@/components/forms/FormField';
import { SectionCard } from '@/components/common/SectionCard';
import {
  churchStatusOptions,
  contactChannelOptions,
  genderOptions,
  originOptions,
} from '../constants/person.options';
import { PersonFormErrors, PersonFormState } from '../person.types';

interface Props {
  values: PersonFormState;
  errors: PersonFormErrors;
  setField: <K extends keyof PersonFormState>(
    field: K,
    value: PersonFormState[K]
  ) => void;
}

export function PersonFormSections({ values, errors, setField }: Props) {
  const { width } = useWindowDimensions();
  const twoColumns = width >= 820;

  return (
    <View style={styles.stack}>
      <SectionCard
        title="Identité"
        subtitle="Les informations essentielles de la personne accompagnée."
      >
        <View style={[styles.grid, twoColumns && styles.gridWide]}>
          <View style={styles.fieldWide}>
            <FormField label="Nom complet" required error={errors.fullName}>
              <AppInput
                value={values.fullName}
                onChangeText={(value) => setField('fullName', value)}
                placeholder="Ex. Marie Kanku"
                autoCapitalize="words"
              />
            </FormField>
          </View>

          <View style={styles.field}>
            <AppSelect
              label="Sexe"
              placeholder="Sélectionner"
              value={values.gender}
              options={genderOptions}
              onValueChange={(value) => setField('gender', value)}
              required
              error={errors.gender}
            />
          </View>
        </View>
      </SectionCard>

      <SectionCard
        title="Vie dans l’Église"
        subtitle="Ces informations facilitent l’orientation et l’accueil."
      >
        <View style={[styles.grid, twoColumns && styles.gridWide]}>
          <View style={styles.field}>
            <AppSelect
              label="Statut dans l’Église"
              placeholder="Sélectionner"
              value={values.churchStatus}
              options={churchStatusOptions}
              onValueChange={(value) => setField('churchStatus', value)}
              required
              error={errors.churchStatus}
            />
          </View>

          <View style={styles.field}>
            <AppSelect
              label="Origine"
              placeholder="Sélectionner"
              value={values.origin}
              options={originOptions}
              onValueChange={(value) => setField('origin', value)}
              required
              error={errors.origin}
            />
          </View>

          <View style={styles.field}>
            <AppSelect
              label="Canal de contact"
              placeholder="Sélectionner"
              value={values.contactChannel}
              options={contactChannelOptions}
              onValueChange={(value) => setField('contactChannel', value)}
              required
              error={errors.contactChannel}
            />
          </View>
        </View>
      </SectionCard>

      <SectionCard
        title="Coordonnées"
        subtitle="Les moyens permettant de rester en contact avec la personne."
      >
        <View style={[styles.grid, twoColumns && styles.gridWide]}>
          <View style={styles.field}>
            <FormField label="Téléphone">
              <AppInput
                value={values.phone ?? ''}
                onChangeText={(value) => setField('phone', value)}
                placeholder="Ex. 081 000 00 00"
                keyboardType="phone-pad"
              />
            </FormField>
          </View>

          <View style={styles.field}>
            <FormField label="Email" error={errors.email}>
              <AppInput
                value={values.email ?? ''}
                onChangeText={(value) => setField('email', value)}
                placeholder="exemple@email.com"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </FormField>
          </View>

          <View style={styles.fieldWide}>
            <FormField label="Adresse">
              <AppInput
                value={values.address ?? ''}
                onChangeText={(value) => setField('address', value)}
                placeholder="Commune, quartier, avenue..."
              />
            </FormField>
          </View>
        </View>
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  grid: { gap: 14 },
  gridWide: { flexDirection: 'row', flexWrap: 'wrap' },
  field: { flexBasis: 320, flexGrow: 1 },
  fieldWide: { flexBasis: 480, flexGrow: 2 },
});
