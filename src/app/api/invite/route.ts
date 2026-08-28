import { db } from "@/db";
import { invites } from "@/db/schema";
import { getCurrentUser } from "@/lib/get-current-user";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, role } = await request.json();

  if (!email?.trim()) {
    return Response.json({ error: "Email required" }, { status: 400 });
  }

  if (!["admin", "editor", "reader"].includes(role)) {
    return Response.json({ error: "Invalid role" }, { status: 400 });
  }

  await db.insert(invites).values({
    email: email.trim().toLowerCase(),
    role,
    invitedBy: user.id,
  });

  return Response.json({ ok: true, email, role }, { status: 201 });
}
