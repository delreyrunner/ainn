import { db } from "@/db";
import { sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/get-current-user";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { role } = await request.json();

  if (!["admin", "editor", "reader"].includes(role)) {
    return Response.json({ error: "Invalid role" }, { status: 400 });
  }

  await db.execute(sql`UPDATE "user" SET role = ${role} WHERE id = ${id}`);
  return Response.json({ ok: true });
}
