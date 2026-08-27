import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Get the authenticated user's ID from the current request.
 * Returns null if no valid session exists.
 */
export async function getSessionUserId(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Get the authenticated user's ID, throwing if not authenticated.
 * Use this in protected API routes.
 */
export async function requireUserId(): Promise<string> {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}
