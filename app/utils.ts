import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import { randomUUID } from "crypto";


import type { User, GuestUser } from "~/models/user.server";

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

export function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | null {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return null;
  }
  return data.user;
}

export function useUser(): User | null {
  const maybeUser = useOptionalUser();
  if (!maybeUser){
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}
