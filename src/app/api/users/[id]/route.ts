import { db } from "@/db";
import { sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/get-current-user";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Don't allow deleting yourself
  if (id === user.id) {
    return Response.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  await db.execute(sql`DELETE FROM "session" WHERE "userId" = ${id}`);
  await db.execute(sql`DELETE FROM "account" WHERE "userId" = ${id}`);
  await db.execute(sql`DELETE FROM "user" WHERE id = ${id}`);

  return Response.json({ ok: true });
}
