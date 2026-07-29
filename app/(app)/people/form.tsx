import { router, useLocalSearchParams } from 'expo-router';

import { LoadingView } from '@/components/common/LoadingView';
import { Page } from '@/components/layout/Page';
import { PageHeader } from '@/components/layout/PageHeader';
import { DuplicateWarnings } from '@/features/people/components/DuplicateWarnings';
import { FormActions } from '@/features/people/components/FormActions';
import { PersonFormSections } from '@/features/people/components/PersonFormSections';
import { usePersonForm } from '@/features/people/hooks/usePersonForm';

export default function PersonFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const vm = usePersonForm(id);

  if (vm.isLoading) return <LoadingView label="Chargement de la fiche..." />;

  const hasWarning = Boolean(vm.phoneDuplicate || vm.nameDuplicates.length);
  const openPerson = (personId: string) =>
    router.replace({ pathname: '/people/form', params: { id: personId } });

  return (
    <Page>
      <PageHeader
        title={id ? 'Modifier la personne' : 'Nouvelle personne'}
        subtitle="Chaque fiche est un point de départ pour un accompagnement attentif et respectueux."
      />

      <PersonFormSections values={vm.values} errors={vm.errors} setField={vm.setField} />

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
        onSave={() => vm.save()}
        onArchive={vm.archive}
      />
    </Page>
  );
}
