// app/(app)/people/form.tsx

import { router, useLocalSearchParams } from "expo-router";

import { LoadingView } from "@/components/common/LoadingView";
import { FormCard, FormHeader, FormPage } from "@/components/forms";
import { DuplicateWarnings } from "@/features/people/components/DuplicateWarnings";
import { FormActions } from "@/features/people/components/FormActions";
import { PersonFormSections } from "@/features/people/components/PersonFormSections";
import { usePersonForm } from "@/features/people/hooks/usePersonForm";

export default function PersonFormScreen() {
  const { id } = useLocalSearchParams<{
    id?: string;
  }>();

  const vm = usePersonForm(id);

  if (vm.isLoading) {
    return <LoadingView label="Chargement de la fiche..." />;
  }

  const hasWarning = Boolean(vm.phoneDuplicate || vm.nameDuplicates.length);

  const openPerson = (personId: string) => {
    router.replace({
      pathname: "/people/form",
      params: {
        id: personId,
      },
    });
  };

  return (
    <FormPage>
      <FormHeader
        title={id ? "Modifier la personne" : "Nouvelle personne"}
        description="Chaque fiche est un point de départ pour un accompagnement attentif et respectueux."
      />

      <FormCard
        title="Informations de la personne"
        description="Renseignez l’identité, les coordonnées et les informations d’accueil."
      >
        <PersonFormSections
          values={vm.values}
          errors={vm.errors}
          setField={vm.setField}
        />
      </FormCard>

      <DuplicateWarnings
        phoneDuplicate={vm.phoneDuplicate}
        nameDuplicates={vm.nameDuplicates}
        onOpen={openPerson}
        onClosePhone={() => vm.setPhoneDuplicate(null)}
        onCancelNames={() => vm.setNameDuplicates([])}
        onContinue={vm.saveDespiteDuplicate}
      />

      <FormActions
        isEditing={Boolean(id)}
        isSaving={vm.isSaving}
        isArchiving={vm.isArchiving}
        disabled={hasWarning}
        onSave={() => {
          void vm.save();
        }}
        onArchive={() => {
          void vm.archive();
        }}
      />
    </FormPage>
  );
}
