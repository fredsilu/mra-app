export type Gender = "male" | "female";

export type ChurchStatus =
  "visitor" | "new" | "member" | "former_member" | "external";

export type PersonOrigin =
  | "service"
  | "family"
  | "evangelism"
  | "recommendation"
  | "social_media"
  | "website"
  | "other";

export type ContactChannel =
  "whatsapp" | "phone" | "in_person" | "email" | "website" | "other";

export type MaritalStatus =
  | "single"
  | "married"
  | "divorced"
  | "widowed"
  | "separated"
  | "engaged"
  | "other";

export interface Person {
  id: string;
  mraNumber: string;
  fullName: string;
  gender: Gender;
  birthDate?: Date;

  phone?: string;
  email?: string;
  address?: string;

  maritalStatus?: MaritalStatus;
  ministry?: string;
  ministryRole?: string;
  family?: string;
  churchSince?: string;

  churchStatus: ChurchStatus;
  origin: PersonOrigin;
  contactChannel: ContactChannel;

  counselorIds?: string[];

  isArchived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PersonFormValues = Pick<
  Person,
  | "fullName"
  | "gender"
  | "phone"
  | "email"
  | "address"
  | "maritalStatus"
  | "ministry"
  | "ministryRole"
  | "family"
  | "churchSince"
  | "churchStatus"
  | "origin"
  | "contactChannel"
>;

export type PersonFormState = Omit<
  PersonFormValues,
  "gender" | "churchStatus" | "origin" | "contactChannel"
> & {
  gender?: Gender;
  churchStatus?: ChurchStatus;
  origin?: PersonOrigin;
  contactChannel?: ContactChannel;
};

export type PersonFormErrors = Partial<Record<keyof PersonFormState, string>>;
