import { PersonFormErrors, PersonFormState } from '../person.types';

export function validatePerson(values: PersonFormState): PersonFormErrors {
  const errors: PersonFormErrors = {};

  if (!values.fullName.trim()) errors.fullName = 'Le nom complet est obligatoire.';
  if (!values.gender) errors.gender = 'Le sexe est obligatoire.';
  if (!values.churchStatus) {
    errors.churchStatus = 'Le statut dans l’Église est obligatoire.';
  }
  if (!values.origin) errors.origin = 'L’origine est obligatoire.';
  if (!values.contactChannel) {
    errors.contactChannel = 'Le canal de contact est obligatoire.';
  }
  if (values.email && !/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = 'Adresse email invalide.';
  }

  return errors;
}
