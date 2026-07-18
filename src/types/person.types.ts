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

/**
 * Ancien type conservé temporairement pour permettre
 * la lecture des anciennes fiches Firestore.
 *
 * Les nouvelles fiches doivent utiliser :
 * - origin
 * - contactChannel
 */
export type LegacyPersonSource =
  | 'church'
  | 'service'
  | 'family'
  | 'recommendation'
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

  /**
   * Origine de la personne :
   * culte, famille, évangélisation, recommandation, etc.
   */
  origin?: PersonOrigin;

  /**
   * Canal par lequel la personne a contacté le MRA :
   * WhatsApp, téléphone, présentiel, etc.
   */
  contactChannel?: ContactChannel;

  /**
   * Ancien champ Firestore.
   * À ne plus utiliser pour les nouvelles fiches.
   */
  source?: LegacyPersonSource;

  assignedCounselorIds: string[];

  isArchived: boolean;

  createdAt?: Date;

  updatedAt?: Date;
}