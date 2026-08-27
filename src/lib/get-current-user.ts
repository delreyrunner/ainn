import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export type UserRole = "admin" | "editor" | "reader";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/**
 * Get the current authenticated user with their role.
 * Returns null if no session or user not found.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) return null;

    const result = await db.execute(
      sql`SELECT id, name, email, role FROM "user" WHERE id = ${session.user.id} LIMIT 1`
    );

    const row = result[0] as Record<string, unknown> | undefined;
    if (!row) return null;

    return {
      id: row.id as string,
      name: row.name as string,
      email: row.email as string,
      role: (row.role as UserRole) || "reader",
    };
  } catch {
    return null;
  }
}

/**
 * Same as getCurrentUser but throws if not found.
 */
export async function requireCurrentUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No authenticated user found");
  }
  return user;
}

/**
 * Check if a role has admin-level access.
 */
export function isAdminRole(role: UserRole): boolean {
  return role === "admin";
}

/**
 * Check if a role can edit/publish articles.
 */
export function canEditArticles(role: UserRole): boolean {
  return role === "admin" || role === "editor";
}
