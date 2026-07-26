//src/navigation/roleRoutes.ts


import { Href } from 'expo-router';

import { UserProfile } from '@/features/users/user.types';

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
      return '/counselors';

    case 'logistique':
      return '/logistics';

    default:
      return '/dashboard';
  }
}