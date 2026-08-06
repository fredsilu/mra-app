// src/features/users/user.types.ts

export type UserRole =
  | "responsable"
  | "adjoint"
  | "secretaire"
  | "conseiller";

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
};
