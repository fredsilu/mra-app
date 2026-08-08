//src/navigation/roleRoutes.ts
import type { Href } from "expo-router";

import type { UserProfile } from "@/features/users/user.types";

export function getHomeRoute(profile: UserProfile | null): Href {
  switch (profile?.role) {
    case "responsable":
    case "adjoint":
    case "secretaire":
      return "/dashboard";

    case "conseiller":
      return "/counselors";

    default:
      return "/dashboard";
  }
}
