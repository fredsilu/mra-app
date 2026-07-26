//src/types/user.types.ts
export type UserRole =
  | 'responsable'
  | 'adjoint'
  | 'secretaire'
  | 'conseiller'
  | 'logistique';

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
};