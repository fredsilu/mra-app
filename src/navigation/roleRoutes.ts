import { Href } from 'expo-router';
import { UserProfile } from '../types/user.types';

export function getHomeRoute(
    profile: UserProfile | null
): Href {
    switch (profile?.role) {
        case 'responsable':
        case 'adjoint':
            return '/dashboard';

        case 'secretaire':
            return '/agenda';

        case 'conseiller':
            return '/conseiller';

        case 'logistique':
            return '/logistique';

        default:
            return '/dashboard';
    }
}