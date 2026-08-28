import { db } from "@/db";
import { sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/get-current-user";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.execute(
    sql`SELECT id, name, email, role FROM "user" ORDER BY "createdAt" DESC`
  );

  return Response.json(result);
}
