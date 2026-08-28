import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

async function sendResendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY is not set!");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "AINN <noreply@ainewsnet.com>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[email] Resend API error:", res.status, err);
  } else {
    const data = await res.json();
    console.log("[email] Sent successfully, id:", data.id);
  }
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://ainewsnet.com",
  ],
  database: pool,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResendEmail(
        user.email,
        "Reset your password — AINN",
        `
          <div style="font-family: 'IBM Plex Mono', monospace, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <h2 style="margin: 0 0 16px; font-family: 'Archivo', sans-serif; font-weight: 700;">Reset your password</h2>
            <p style="color: #626C79; margin: 0 0 24px;">Click below to set a new password for your AINN account.</p>
            <a href="${url}" style="display: inline-block; background: #10141A; color: white; padding: 12px 24px; text-decoration: none; font-weight: 600; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;">Reset Password</a>
            <p style="color: #626C79; font-size: 12px; margin-top: 32px;">If you didn't request this, ignore this email. Link expires in 1 hour.</p>
          </div>
        `
      );
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendResendEmail(
        user.email,
        "Verify your email — AINN",
        `
          <div style="font-family: 'IBM Plex Mono', monospace, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <h2 style="margin: 0 0 16px; font-family: 'Archivo', sans-serif; font-weight: 700;">Verify your email</h2>
            <p style="color: #626C79; margin: 0 0 24px;">Click below to verify your email address and activate your AINN account.</p>
            <a href="${url}" style="display: inline-block; background: #10141A; color: white; padding: 12px 24px; text-decoration: none; font-weight: 600; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;">Verify Email</a>
            <p style="color: #626C79; font-size: 12px; margin-top: 32px;">If you didn't create an account, ignore this email.</p>
          </div>
        `
      );
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Check invites table for a matching role assignment
          try {
            const inviteResult = await pool.query(
              `SELECT role FROM invites WHERE email = $1 LIMIT 1`,
              [user.email]
            );

            if (inviteResult.rows.length > 0) {
              const invitedRole = inviteResult.rows[0].role;
              await pool.query(
                `UPDATE "user" SET role = $1 WHERE id = $2`,
                [invitedRole, user.id]
              );
              await pool.query(
                `DELETE FROM invites WHERE email = $1`,
                [user.email]
              );
              console.log("[auth-hook] Applied invited role:", invitedRole, "for:", user.email);
            } else {
              // Default role for uninvited signups (readers who create accounts)
              await pool.query(
                `UPDATE "user" SET role = $1 WHERE id = $2`,
                ["reader", user.id]
              );
              console.log("[auth-hook] Applied default role: reader for:", user.email);
            }
          } catch (e) {
            console.error("[auth-hook] Failed to set user role:", e);
          }
        },
      },
    },
  },
});
