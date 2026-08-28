import { db } from "@/db";
import { sql } from "drizzle-orm";
import { getCurrentUser, canManageTeam } from "@/lib/get-current-user";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || !canManageTeam(user.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { role } = await request.json();

  if (!["super_admin", "admin", "team_member", "subscriber"].includes(role)) {
    return Response.json({ error: "Invalid role" }, { status: 400 });
  }

  await db.execute(sql`UPDATE "user" SET role = ${role} WHERE id = ${id}`);
  return Response.json({ ok: true });
}
