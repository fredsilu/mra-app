//src/types/person.types.ts
export type Gender = 'male' | 'female';

export type ChurchStatus =
  | 'visitor'
  | 'new'
  | 'member'
  | 'former_member'
  | 'external';

export type PersonOrigin =
  | 'service'
  | 'family'
  | 'evangelism'
  | 'recommendation'
  | 'social_media'
  | 'website'
  | 'other';

export type ContactChannel =
  | 'whatsapp'
  | 'phone'
  | 'in_person'
  | 'email'
  | 'website'
  | 'other';

export interface Person {
  id: string;
  mraNumber: string;
  fullName: string;
  gender: Gender;
  birthDate?: Date;
  phone?: string;
  email?: string;
  address?: string;
  churchStatus: ChurchStatus;
  origin: PersonOrigin;
  contactChannel: ContactChannel;
  isArchived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}