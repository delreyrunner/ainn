"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Camera, CheckCircle2, Pencil, KeyRound, Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [role, setRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Email change
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setName(data.name || "");
          setAuthEmail(data.email || "");
          setRole(data.role || "");
          setAvatarUrl(data.avatarUrl || "");
          setNameInput(data.name || "");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload-avatar", { method: "POST", body: formData });
      if (res.ok) { const data = await res.json(); setAvatarUrl(data.url); showSaved(); }
    } catch { /* silently fail */ } finally { setUploading(false); }
  }

  async function handleSaveName() {
    if (!nameInput.trim() || nameInput.trim() === name) { setEditingName(false); return; }
    setSavingName(true);
    try {
      const res = await fetch("/api/me/update", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: nameInput.trim() }) });
      if (res.ok) { setName(nameInput.trim()); setEditingName(false); showSaved(); }
    } catch { /* silently fail */ } finally { setSavingName(false); }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) { setPasswordError("Passwords don't match"); return; }
    if (newPassword.length < 8) { setPasswordError("Password must be at least 8 characters"); return; }

    setPasswordLoading(true);
    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
      });
      if (result.error) {
        setPasswordError(result.error.message || "Failed to change password");
      } else {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(false), 5000);
      }
    } catch {
      setPasswordError("Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleEmailChange(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess(false);

    if (!newEmail.trim() || !newEmail.includes("@")) { setEmailError("Enter a valid email"); return; }
    if (!emailPassword) { setEmailError("Enter your current password to confirm"); return; }

    setEmailLoading(true);
    try {
      const result = await authClient.changeEmail({
        newEmail: newEmail.trim(),
        callbackURL: "/profile",
      });
      if (result.error) {
        setEmailError(result.error.message || "Failed to change email");
      } else {
        setEmailSuccess(true);
        setNewEmail("");
        setEmailPassword("");
      }
    } catch {
      setEmailError("Something went wrong");
    } finally {
      setEmailLoading(false);
    }
  }

  function showSaved() { setSaved(true); setTimeout(() => setSaved(false), 3000); }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-neutral-400" /></div>;
  }

  const roleLabel = role === "super_admin" ? "Super Admin" : role === "admin" ? "Admin" : role === "team_member" ? "Team Member" : "Customer";

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">Profile</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Manage your account settings.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white/50 dark:bg-neutral-800/50 border border-neutral-200/40 dark:border-neutral-700/40 rounded-2xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] backdrop-blur-md space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-white/60 shadow-sm" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-neutral-200 dark:bg-neutral-700 border-2 border-white/60 dark:border-neutral-600/60 shadow-sm flex items-center justify-center text-2xl font-semibold text-neutral-600 dark:text-neutral-300">
                {name ? name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all cursor-pointer">
              {uploading ? <Loader2 className="h-5 w-5 text-white animate-spin" /> : <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">{name || "No name set"}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Click photo to change avatar</p>
          </div>
          {saved && <CheckCircle2 className="h-5 w-5 text-emerald-500 ml-auto" />}
        </div>

        {/* Info */}
        <div className="space-y-5 pt-4 border-t border-neutral-200/40 dark:border-neutral-700/40">
          {/* Name */}
          <div>
            <label className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1.5">Name</label>
            {editingName ? (
              <div className="flex gap-2">
                <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} autoFocus className="flex-1 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/60 dark:bg-neutral-800/60 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-neutral-100/10 focus:bg-white/90 dark:focus:bg-neutral-800/90 transition-all" onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setEditingName(false); }} />
                <button onClick={handleSaveName} disabled={savingName} className="rounded-xl bg-neutral-900 dark:bg-white px-4 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all disabled:opacity-50">
                  {savingName ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-sm text-neutral-900 dark:text-white">{name || "—"}</p>
                <button onClick={() => { setNameInput(name); setEditingName(true); }} className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1.5">Email</label>
            <p className="text-sm text-neutral-900 dark:text-white">{authEmail}</p>
          </div>

          {/* Role */}
          <div>
            <label className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1.5">Role</label>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">{roleLabel}</span>
          </div>
        </div>
      </div>

      {/* Change Email */}
      <div className="bg-white/50 dark:bg-neutral-800/50 border border-neutral-200/40 dark:border-neutral-700/40 rounded-2xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Change Email</h3>
        </div>

        {emailSuccess && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-3 mb-4">
            <p className="text-xs text-emerald-700 dark:text-emerald-400">A verification link has been sent to your new email. Click the link to confirm the change.</p>
          </div>
        )}

        <form onSubmit={handleEmailChange} className="space-y-3">
          {emailError && (
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 p-3">
              <p className="text-xs text-rose-700 dark:text-rose-400">{emailError}</p>
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1.5">New Email</label>
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="new@example.com" className="w-full rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/60 dark:bg-neutral-800/60 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-neutral-100/10 focus:bg-white/90 dark:focus:bg-neutral-800/90 transition-all" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1.5">Current Password (to confirm)</label>
            <input type="password" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/60 dark:bg-neutral-800/60 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-neutral-100/10 focus:bg-white/90 dark:focus:bg-neutral-800/90 transition-all" />
          </div>
          <button type="submit" disabled={emailLoading} className="rounded-xl bg-neutral-900 dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all disabled:opacity-50 flex items-center gap-2">
            {emailLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {emailLoading ? "Sending..." : "Change Email"}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white/50 dark:bg-neutral-800/50 border border-neutral-200/40 dark:border-neutral-700/40 rounded-2xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Change Password</h3>
        </div>

        {passwordSuccess && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-3 mb-4">
            <p className="text-xs text-emerald-700 dark:text-emerald-400">Password changed successfully.</p>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-3">
          {passwordError && (
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 p-3">
              <p className="text-xs text-rose-700 dark:text-rose-400">{passwordError}</p>
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1.5">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/60 dark:bg-neutral-800/60 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-neutral-100/10 focus:bg-white/90 dark:focus:bg-neutral-800/90 transition-all" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1.5">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 characters" className="w-full rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/60 dark:bg-neutral-800/60 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-neutral-100/10 focus:bg-white/90 dark:focus:bg-neutral-800/90 transition-all" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1.5">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" className="w-full rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/60 dark:bg-neutral-800/60 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-neutral-100/10 focus:bg-white/90 dark:focus:bg-neutral-800/90 transition-all" />
          </div>
          <button type="submit" disabled={passwordLoading} className="rounded-xl bg-neutral-900 dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all disabled:opacity-50 flex items-center gap-2">
            {passwordLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {passwordLoading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
