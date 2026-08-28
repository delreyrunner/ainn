import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export type UserRole = "super_admin" | "admin" | "team_member" | "subscriber";

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
      role: (row.role as UserRole) || "subscriber",
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
 * Check if a role has super admin access.
 */
export function isSuperAdmin(role: UserRole): boolean {
  return role === "super_admin";
}

/**
 * Check if a role has admin-level access (super_admin or admin).
 */
export function isAdminRole(role: UserRole): boolean {
  return role === "super_admin" || role === "admin";
}

/**
 * Check if a role can create/edit articles (super_admin, admin, or team_member).
 */
export function canEditArticles(role: UserRole): boolean {
  return role === "super_admin" || role === "admin" || role === "team_member";
}

/**
 * Check if a role can publish articles to live (super_admin or admin only).
 */
export function canPublishArticles(role: UserRole): boolean {
  return role === "super_admin" || role === "admin";
}

/**
 * Check if a role can access the admin panel at all.
 */
export function canAccessAdmin(role: UserRole): boolean {
  return role === "super_admin" || role === "admin" || role === "team_member";
}

/**
 * Check if a role can manage team (invite, change roles, delete users).
 */
export function canManageTeam(role: UserRole): boolean {
  return role === "super_admin";
}
