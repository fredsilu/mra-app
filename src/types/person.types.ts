//src/types/person.types.ts
export type Gender = 'male' | 'female';

export type ChurchStatus =
    | 'visitor'
    | 'new'
    | 'member'
    | 'former_member'
    | 'external';

export type PersonSource =
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

    source: PersonSource;

    assignedCounselorIds: string[];

    isArchived: boolean;

    createdAt?: Date;
updatedAt?: Date;
}