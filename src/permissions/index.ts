// src/permissions/index.ts

import type { UserProfile } from "@/features/users/user.types";

export function isResponsable(profile: UserProfile | null): boolean {
  return profile?.role === "responsable";
}

export function isAdjoint(profile: UserProfile | null): boolean {
  return profile?.role === "adjoint";
}

export function isSecretaire(profile: UserProfile | null): boolean {
  return profile?.role === "secretaire";
}

export function isConseiller(profile: UserProfile | null): boolean {
  return profile?.role === "conseiller";
}

export function canManageUsers(profile: UserProfile | null): boolean {
  return isResponsable(profile) || isAdjoint(profile);
}

export function hasGlobalAccess(profile: UserProfile | null): boolean {
  return isResponsable(profile) || isAdjoint(profile);
}

export function canManageAssignments(profile: UserProfile | null): boolean {
  return isResponsable(profile) || isAdjoint(profile);
}

export function canManageAgenda(profile: UserProfile | null): boolean {
  return (
    isResponsable(profile) ||
    isAdjoint(profile) ||
    isSecretaire(profile)
  );
}

export function canActAsCounselor(profile: UserProfile | null): boolean {
  return (
    isResponsable(profile) ||
    isAdjoint(profile) ||
    isConseiller(profile)
  );
}

/**
 * Permissions temporaires conservées pendant la migration
 * des anciens modules appointments/interviews.
 */
export function canConfirmAppointment(
  profile: UserProfile | null,
  assignedCounselorId: string,
): boolean {
  if (!profile) {
    return false;
  }

  return (
    profile.uid === assignedCounselorId ||
    isSecretaire(profile) ||
    isResponsable(profile) ||
    isAdjoint(profile)
  );
}

export function canViewPrivateInterview(
  profile: UserProfile | null,
): boolean {
  return canActAsCounselor(profile);
}

/**
 * Compatibilité temporaire : le rôle Logistique n'existe plus.
 * Ces fonctions pourront être supprimées avec l'ancien module.
 */
export function isLogistique(_profile: UserProfile | null): boolean {
  return false;
}

export function canAccessLogistics(profile: UserProfile | null): boolean {
  return hasGlobalAccess(profile);
}
