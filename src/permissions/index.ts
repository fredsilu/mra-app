//src/permissions/index.ts
import { UserProfile } from '../types/user.types';

export function isResponsable(profile: UserProfile | null) {
    return profile?.role === 'responsable';
}

export function isAdjoint(profile: UserProfile | null) {
    return profile?.role === 'adjoint';
}

export function isSecretaire(profile: UserProfile | null) {
    return profile?.role === 'secretaire';
}

export function isConseiller(profile: UserProfile | null) {
    return profile?.role === 'conseiller';
}

export function isLogistique(profile: UserProfile | null) {
    return profile?.role === 'logistique';
}

export function canManageUsers(profile: UserProfile | null) {
    return isResponsable(profile) || isAdjoint(profile);
}

export function canViewPrivateInterview(profile: UserProfile | null) {
    return (
        isResponsable(profile) ||
        isAdjoint(profile) ||
        isConseiller(profile)
    );
}

export function canManageAssignments(profile: UserProfile | null) {
    return isResponsable(profile) || isAdjoint(profile);
}

export function canManageAgenda(profile: UserProfile | null) {
    return (
        isResponsable(profile) ||
        isAdjoint(profile) ||
        isSecretaire(profile)
    );
}

export function canAccessLogistics(profile: UserProfile | null) {
    return (
        isResponsable(profile) ||
        isAdjoint(profile) ||
        isLogistique(profile)
    );
}

export function hasGlobalAccess(profile: UserProfile | null) {
    return isResponsable(profile) || isAdjoint(profile);
}