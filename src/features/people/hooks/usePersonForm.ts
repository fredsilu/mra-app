import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

import {
  createPerson,
  findPeopleByExactName,
  findPersonByPhone,
  getPersonById,
  updatePerson,
} from "../person.service";
import {
  Person,
  PersonFormErrors,
  PersonFormState,
  PersonFormValues,
} from "../person.types";
import { validatePerson } from "../validation/person.validation";

const initialValues: PersonFormState = {
  fullName: "",
  gender: undefined,
  phone: "",
  email: "",
  address: "",

  maritalStatus: undefined,
  ministry: "",
  ministryRole: "",
  family: "",
  churchSince: "",

  churchStatus: undefined,
  origin: undefined,
  contactChannel: undefined,
};

export function usePersonForm(id?: string) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<PersonFormErrors>({});
  const [phoneDuplicate, setPhoneDuplicate] = useState<Person | null>(null);
  const [nameDuplicates, setNameDuplicates] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [isSaving, setIsSaving] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPersonById(id)
      .then((person) => {
        if (!person) throw new Error("Personne introuvable");
        setValues({
          fullName: person.fullName,
          gender: person.gender,
          phone: person.phone ?? "",
          email: person.email ?? "",
          address: person.address ?? "",

          maritalStatus: person.maritalStatus,
          ministry: person.ministry ?? "",
          ministryRole: person.ministryRole ?? "",
          family: person.family ?? "",
          churchSince: person.churchSince ?? "",

          churchStatus: person.churchStatus,
          origin: person.origin,
          contactChannel: person.contactChannel,
        });
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Erreur", "Impossible de charger cette personne.");
        router.back();
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const setField = useCallback(
    <K extends keyof PersonFormState>(field: K, value: PersonFormState[K]) => {
      setValues((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      if (field === "phone") setPhoneDuplicate(null);
      if (field === "fullName") setNameDuplicates([]);
    },
    [],
  );

  async function persist() {
    const cleanValues = {
      ...values,

      fullName: values.fullName.trim(),
      phone: values.phone?.trim(),
      email: values.email?.trim(),
      address: values.address?.trim(),

      maritalStatus: values.maritalStatus?.trim(),
      ministry: values.ministry?.trim(),
      ministryRole: values.ministryRole?.trim(),
      family: values.family?.trim(),
      churchSince: values.churchSince?.trim(),
    };
    const validValues = cleanValues as PersonFormValues;
    id ? await updatePerson(id, validValues) : await createPerson(validValues);
  }

  async function save(skipNameCheck = false) {
    if (isSaving || isArchiving) return;
    const validationErrors = validatePerson(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setIsSaving(true);
    setPhoneDuplicate(null);
    setNameDuplicates([]);

    try {
      if (values.phone?.trim()) {
        const duplicate = await findPersonByPhone(values.phone);
        if (duplicate && duplicate.id !== id) {
          setPhoneDuplicate(duplicate);
          return;
        }
      }

      if (!skipNameCheck) {
        const duplicates = (
          await findPeopleByExactName(values.fullName)
        ).filter((person) => person.id !== id);
        if (duplicates.length) {
          setNameDuplicates(duplicates);
          return;
        }
      }

      await persist();
      Alert.alert(
        "Succès",
        id ? "La personne a été modifiée." : "La personne a été créée.",
      );
      router.back();
    } catch (error) {
      console.error("Erreur enregistrement personne :", error);
      Alert.alert("Erreur", "Impossible d'enregistrer la personne.");
    } finally {
      setIsSaving(false);
    }
  }

  async function archive() {
    if (!id || isSaving || isArchiving) return;
    const message = `Archiver la fiche de ${values.fullName} ? Elle restera conservée dans la base.`;
    const confirmed =
      Platform.OS === "web"
        ? typeof window !== "undefined" && window.confirm(message)
        : await new Promise<boolean>((resolve) =>
            Alert.alert("Archiver la personne", message, [
              {
                text: "Annuler",
                style: "cancel",
                onPress: () => resolve(false),
              },
              {
                text: "Archiver",
                style: "destructive",
                onPress: () => resolve(true),
              },
            ]),
          );

    if (!confirmed) return;
    setIsArchiving(true);
    try {
      await updatePerson(id, { isArchived: true });
      router.back();
    } catch (error) {
      console.error("Erreur archivage personne :", error);
      Alert.alert("Erreur", "Impossible d'archiver cette personne.");
    } finally {
      setIsArchiving(false);
    }
  }

  return {
    values,
    errors,
    setField,
    phoneDuplicate,
    setPhoneDuplicate,
    nameDuplicates,
    setNameDuplicates,
    isLoading,
    isSaving,
    isArchiving,
    save,
    saveDespiteDuplicate: () => save(true),
    archive,
  };
}
