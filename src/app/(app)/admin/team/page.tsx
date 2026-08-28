"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface User { id: string; name: string; email: string; role: string; }

const ROLES = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "team_member", label: "Team Member" },
  { value: "subscriber", label: "Subscriber" },
];

type Tab = "members" | "invite";

export default function AdminTeamPage() {
  const [tab, setTab] = useState<Tab>("members");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite form
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("team_member");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch("/api/users")
      .then(r => r.ok ? r.json() : [])
      .then(data => { setUsers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setSending(true);
    const res = await fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
    });
    if (res.ok) {
      setInviteEmail(""); setInviteRole("editor");
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }
    setSending(false);
  }

  async function changeRole(id: string, role: string) {
    const res = await fetch(`/api/users/${id}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  }

  async function deleteUser(id: string) {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    setUsers(prev => prev.filter(u => u.id !== id));
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--mute)" }} /></div>;

  return (
    <div>
      <h1 style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 22, letterSpacing: "-0.015em", margin: "0 0 var(--s1)" }}>Team</h1>
      <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--mute)", margin: "0 0 var(--s5)" }}>Manage team members and send invites.</p>

      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--rule)", marginBottom: "var(--s5)" }}>
        {(["members", "invite"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 16px",
              fontFamily: "var(--mono)",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "none",
              border: "none",
              borderBottom: tab === t ? "2px solid var(--ink)" : "2px solid transparent",
              color: tab === t ? "var(--ink)" : "var(--mute)",
              cursor: "pointer",
              fontWeight: tab === t ? 600 : 400,
            }}
          >
            {t === "members" ? "Team Members" : "Invite"}
          </button>
        ))}
      </div>

      {tab === "members" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--s2)" }}>
          {users.map(u => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid var(--rule)", background: "var(--card)", padding: "var(--s3) var(--s4)" }}>
              <div>
                <p style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, margin: 0 }}>{u.name}</p>
                <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--mute)", margin: 0 }}>{u.email}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--s3)" }}>
                <select
                  value={u.role}
                  onChange={e => changeRole(u.id, e.target.value)}
                  style={{ fontFamily: "var(--mono)", fontSize: "10px", padding: "6px 10px", border: "1px solid var(--rule)", background: "#fff", color: "var(--ink)" }}
                >
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                <button onClick={() => deleteUser(u.id)} style={{ color: "var(--signal)", background: "none", border: "none", cursor: "pointer" }}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--mute)", textAlign: "center", padding: "var(--s8) 0" }}>No users yet.</p>
          )}
        </div>
      )}

      {tab === "invite" && (
        <div style={{ border: "1px solid var(--rule)", background: "var(--card)", padding: "var(--s5)" }}>
          <h3 style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 600, margin: "0 0 var(--s3)" }}>Send Invite</h3>
          <form onSubmit={handleInvite} style={{ display: "flex", gap: "var(--s2)", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 200px" }}>
              <label style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mute)", display: "block", marginBottom: "var(--s1)" }}>Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                required
                style={{ width: "100%", fontFamily: "var(--mono)", fontSize: 13, padding: "10px 12px", border: "1px solid var(--rule)", background: "#fff", color: "var(--ink)" }}
              />
            </div>
            <div>
              <label style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mute)", display: "block", marginBottom: "var(--s1)" }}>Role</label>
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value)}
                style={{ fontFamily: "var(--mono)", fontSize: 13, padding: "10px 12px", border: "1px solid var(--rule)", background: "#fff", color: "var(--ink)" }}
              >
                <option value="team_member">Team Member</option>
                <option value="admin">Admin</option>
                <option value="subscriber">Subscriber</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={sending}
              style={{
                fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase",
                padding: "11px 16px", border: "1px solid var(--ink)", background: "var(--ink)", color: "#fff",
                cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.6 : 1,
                display: "inline-flex", alignItems: "center", gap: 6,
              }}
            >
              {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              Send Invite
            </button>
          </form>
          {sent && <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--signal)", marginTop: "var(--s3)" }}>Invite saved. They&apos;ll get the role when they sign up with that email.</p>}
        </div>
      )}
    </div>
  );
}
