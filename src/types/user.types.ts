export type UserRole = 'responsable' | 'adjoint' | 'secretaire' | 'conseiller';

export type AppUser = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};