import type { Timestamp } from "firebase/firestore";

export const ACTIVITY_TYPES = [
  "first_interview",
  "follow_up",
  "phone_call",
  "whatsapp",
  "sms",
  "home_visit",
  "prayer",
  "fasting",
  "meeting",
  "orientation",
  "accompaniment",
  "other",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const ACTIVITY_STATUSES = [
  "planned",
  "completed",
  "cancelled",
] as const;

export type ActivityStatus = (typeof ACTIVITY_STATUSES)[number];

export interface Activity {
  id: string;

  personId: string;
  personName: string;

  caseId?: string | null;

  counselorId: string;
  counselorName: string;

  type: ActivityType;
  status: ActivityStatus;

  scheduledAt?: Timestamp | null;
  completedAt?: Timestamp | null;

  title: string;
  description: string;
  result: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

export interface CreateActivityInput {
  personId: string;
  personName: string;

  caseId?: string | null;

  counselorId: string;
  counselorName: string;

  type: ActivityType;
  status?: ActivityStatus;

  scheduledAt?: Date | null;
  completedAt?: Date | null;

  title: string;
  description?: string;
  result?: string;

  createdBy: string;
}

export type UpdateActivityInput = Partial<
  Omit<CreateActivityInput, "createdBy">
>;
