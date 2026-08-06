import type { ActivityStatus, ActivityType } from "./activity.types";

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  first_interview: "Premier entretien",
  follow_up: "Entretien de suivi",
  phone_call: "Appel téléphonique",
  whatsapp: "WhatsApp",
  sms: "SMS",
  home_visit: "Visite à domicile",
  prayer: "Prière",
  fasting: "Jeûne",
  meeting: "Réunion",
  orientation: "Orientation",
  accompaniment: "Accompagnement",
  other: "Autre",
};

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  planned: "Planifiée",
  completed: "Réalisée",
  cancelled: "Annulée",
};
