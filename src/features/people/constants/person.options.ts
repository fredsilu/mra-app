import type {
  ChurchStatus,
  ContactChannel,
  Gender,
  MaritalStatus,
  PersonOrigin,
} from "../person.types";

export const maritalStatusOptions: Array<{
  label: string;
  value: MaritalStatus;
}> = [
  { label: "Célibataire", value: "single" },
  { label: "Marié(e)", value: "married" },
  { label: "Divorcé(e)", value: "divorced" },
  { label: "Veuf / Veuve", value: "widowed" },
  { label: "Séparé(e)", value: "separated" },
  { label: "Fiancé(e)", value: "engaged" },
  { label: "Autre", value: "other" },
];

export const genderOptions: Array<{
  label: string;
  value: Gender;
}> = [
  { label: "Homme", value: "male" },
  { label: "Femme", value: "female" },
];

export const churchStatusOptions: Array<{
  label: string;
  value: ChurchStatus;
}> = [
  { label: "Visiteur", value: "visitor" },
  { label: "Nouveau", value: "new" },
  { label: "Membre", value: "member" },
  { label: "Ancien membre", value: "former_member" },
  { label: "Externe", value: "external" },
];

export const originOptions: Array<{
  label: string;
  value: PersonOrigin;
}> = [
  { label: "Culte", value: "service" },
  { label: "Famille", value: "family" },
  { label: "Évangélisation", value: "evangelism" },
  { label: "Recommandation", value: "recommendation" },
  { label: "Réseaux sociaux", value: "social_media" },
  { label: "Site Internet", value: "website" },
  { label: "Autre", value: "other" },
];

export const contactChannelOptions: Array<{
  label: string;
  value: ContactChannel;
}> = [
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Téléphone", value: "phone" },
  { label: "En présentiel", value: "in_person" },
  { label: "Email", value: "email" },
  { label: "Site Internet", value: "website" },
  { label: "Autre", value: "other" },
];
