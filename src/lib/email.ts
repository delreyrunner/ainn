/**
 * Shared email utility using Resend API.
 */
export async function sendEmail(to: string | string[], subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY is not set!");
    return;
  }

  const recipients = Array.isArray(to) ? to : [to];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "AINN <noreply@ainn.news>",
      to: recipients,
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
