//src/features/people/components/PersonFormSections.tsx
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { SectionCard } from "@/components/common/SectionCard";
import { FormField } from "@/components/forms/FormField";
import { AppInput } from "@/components/ui/AppInput";
import { AppSelect } from "@/components/ui/AppSelect";

import {
  churchStatusOptions,
  contactChannelOptions,
  genderOptions,
  maritalStatusOptions,
  originOptions,
} from "../constants/person.options";

import type { PersonFormErrors, PersonFormState } from "../person.types";

interface Props {
  values: PersonFormState;
  errors: PersonFormErrors;
  setField: <K extends keyof PersonFormState>(
    field: K,
    value: PersonFormState[K],
  ) => void;
}

export function PersonFormSections({ values, errors, setField }: Props) {
  const { width } = useWindowDimensions();

  const isTablet = width >= 700;
  const isDesktop = width >= 1000;

  const gridColumns = [
    styles.grid,
    isTablet && styles.gridTablet,
    isDesktop && styles.gridDesktop,
  ];

  return (
    <View style={styles.stack}>
      <SectionCard
        title="Identité"
        subtitle="Les informations principales de la personne."
      >
        <View style={gridColumns}>
          <View style={styles.field}>
            <FormField label="Nom complet" error={errors.fullName}>
              <AppInput
                value={values.fullName}
                onChangeText={(value) => setField("fullName", value)}
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
              onValueChange={(value) => setField("gender", value)}
              required
              error={errors.gender}
            />
          </View>

          <View style={styles.field}>
            <AppSelect
              label="État civil"
              placeholder="Sélectionner"
              value={values.maritalStatus}
              options={maritalStatusOptions}
              onValueChange={(value) => setField("maritalStatus", value)}
            />
          </View>
        </View>
      </SectionCard>

      <SectionCard
        title="Vie dans l’Église"
        subtitle="Ces informations facilitent l’orientation et l’accueil."
      >
        <View style={gridColumns}>
          <View style={styles.field}>
            <AppSelect
              label="Statut dans l’Église"
              placeholder="Sélectionner"
              value={values.churchStatus}
              options={churchStatusOptions}
              onValueChange={(value) => setField("churchStatus", value)}
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
              onValueChange={(value) => setField("origin", value)}
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
              onValueChange={(value) => setField("contactChannel", value)}
              required
              error={errors.contactChannel}
            />
          </View>

          <View style={styles.field}>
            <FormField label="Ministère / Département">
              <AppInput
                value={values.ministry ?? ""}
                onChangeText={(value) => setField("ministry", value)}
                placeholder="Ex. MRA, Protocole, Louange..."
                autoCapitalize="words"
              />
            </FormField>
          </View>

          <View style={styles.field}>
            <FormField label="Fonction dans le ministère">
              <AppInput
                value={values.ministryRole ?? ""}
                onChangeText={(value) => setField("ministryRole", value)}
                placeholder="Ex. Conseiller, membre, responsable..."
                autoCapitalize="words"
              />
            </FormField>
          </View>

          <View style={styles.field}>
            <FormField label="Famille / Groupe">
              <AppInput
                value={values.family ?? ""}
                onChangeText={(value) => setField("family", value)}
                placeholder="Ex. Famille 7"
                autoCapitalize="words"
              />
            </FormField>
          </View>

          <View style={styles.field}>
            <FormField label="À l’église depuis">
              <AppInput
                value={values.churchSince ?? ""}
                onChangeText={(value) => setField("churchSince", value)}
                placeholder="Ex. 2021"
              />
            </FormField>
          </View>
        </View>
      </SectionCard>

      <SectionCard
        title="Coordonnées"
        subtitle="Les moyens permettant de rester en contact avec la personne."
      >
        <View style={gridColumns}>
          <View style={styles.field}>
            <FormField label="Téléphone">
              <AppInput
                value={values.phone ?? ""}
                onChangeText={(value) => setField("phone", value)}
                placeholder="Ex. 081 000 00 00"
                keyboardType="phone-pad"
              />
            </FormField>
          </View>

          <View style={styles.field}>
            <FormField label="Email" error={errors.email}>
              <AppInput
                value={values.email ?? ""}
                onChangeText={(value) => setField("email", value)}
                placeholder="exemple@email.com"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </FormField>
          </View>

          <View style={[styles.field, isDesktop && styles.fieldWideDesktop]}>
            <FormField label="Adresse">
              <AppInput
                value={values.address ?? ""}
                onChangeText={(value) => setField("address", value)}
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
  stack: {
    gap: 14,
  },

  grid: {
    gap: 12,
  },

  gridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  gridDesktop: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  field: {
    flexBasis: 300,
    flexGrow: 1,
  },

  fieldWideDesktop: {
    flexBasis: 620,
    flexGrow: 2,
  },
});
