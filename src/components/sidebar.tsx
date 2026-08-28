"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  FileText,
  Radar,
  Users,
  UserCog,
  LogOut,
  User,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

type UserRole = "super_admin" | "admin" | "team_member" | "subscriber";

interface NavItem {
  href: string;
  icon: typeof LayoutDashboard;
  label: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", roles: ["super_admin", "admin", "team_member"] },
  { href: "/admin/articles", icon: FileText, label: "Articles", roles: ["super_admin", "admin", "team_member"] },
  { href: "/admin/monitoring", icon: Radar, label: "Radar", roles: ["super_admin", "admin", "team_member"] },
  { href: "/admin/subscribers", icon: Users, label: "Subscribers", roles: ["super_admin", "admin"] },
  { href: "/admin/team", icon: UserCog, label: "Team", roles: ["super_admin"] },
  { href: "/profile", icon: User, label: "Profile", roles: ["super_admin", "admin", "team_member", "subscriber"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.role) setRole(data.role as UserRole);
        else setRole("reader");
        if (data?.name) setUserName(data.name);
        if (data?.email) setUserEmail(data.email);
      })
      .catch(() => setRole("reader"));

    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowProfilePopup(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    try {
      await signOut();
    } catch {
      // If signOut API fails, clear cookies manually
    }
    window.location.href = "/login";
  }

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
  }

  const visibleItems = navItems.filter((i) => role && i.roles.includes(role));

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col ${collapsed ? "w-16" : "w-56"} transition-all duration-200`}
        style={{
          borderRight: "1px solid var(--rule)",
          background: "var(--card)",
        }}
      >
        {/* Logo + collapse */}
        <div className={`h-16 flex items-center ${collapsed ? "justify-center px-2" : "justify-between px-5"}`} style={{ borderBottom: "1px solid var(--rule-soft)" }}>
          {!collapsed && (
            <span style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>
              AINN
            </span>
          )}
          {collapsed && (
            <span style={{ fontFamily: "var(--sans)", fontWeight: 800, fontSize: 14 }}>A</span>
          )}
          {!collapsed && (
            <button onClick={toggleCollapsed} style={{ padding: 6, color: "var(--mute)", cursor: "pointer", background: "none", border: "none" }}>
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>

        {collapsed && (
          <div className="px-2 py-2 flex justify-center">
            <button onClick={toggleCollapsed} style={{ padding: 6, color: "var(--mute)", cursor: "pointer", background: "none", border: "none" }}>
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center ${collapsed ? "justify-center px-2" : "gap-3 px-3"} py-2 transition-all`}
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "10.5px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: isActive ? "var(--ink)" : "var(--mute)",
                  background: isActive ? "var(--paper)" : "transparent",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Profile + sign out */}
        <div className="p-3 mt-auto relative" style={{ borderTop: "1px solid var(--rule-soft)" }} ref={popupRef}>
          {showProfilePopup && (
            <div
              className={`absolute bottom-full ${collapsed ? "left-1 right-1" : "left-3 right-3"} mb-2 p-2 space-y-1`}
              style={{ background: "var(--card)", border: "1px solid var(--rule)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            >
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-3 py-2 text-left"
                style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--signal)", background: "none", border: "none", cursor: "pointer" }}
              >
                <LogOut className="h-4 w-4" />
                {!collapsed && "Sign Out"}
              </button>
            </div>
          )}

          <button
            onClick={() => setShowProfilePopup(!showProfilePopup)}
            className={`flex items-center ${collapsed ? "justify-center" : "gap-2"} w-full p-2 text-left`}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                background: "var(--paper)",
                border: "1px solid var(--rule)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--mono)",
                fontSize: "10px",
                fontWeight: 600,
                color: "var(--mute)",
                flexShrink: 0,
              }}
            >
              {userName ? userName.charAt(0).toUpperCase() : "?"}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 overflow-hidden">
                  <p style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--ink)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {userName || "User"}
                  </p>
                </div>
                <ChevronUp className={`h-3 w-3 transition-transform ${showProfilePopup ? "" : "rotate-180"}`} style={{ color: "var(--mute)" }} />
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center py-2 px-1"
        style={{ background: "var(--card)", borderTop: "1px solid var(--rule)" }}
      >
        {[
          { href: "/admin", icon: LayoutDashboard, label: "Home" },
          { href: "/admin/articles", icon: FileText, label: "Articles" },
          { href: "/admin/monitoring", icon: Radar, label: "Radar" },
          { href: "/login", icon: LogOut, label: "Logout" },
        ].map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={item.label === "Logout" ? (e) => { e.preventDefault(); handleSignOut(); } : undefined}
              className="flex flex-col items-center gap-0.5 px-2 py-1"
              style={{
                fontFamily: "var(--mono)",
                fontSize: "9px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: isActive ? "var(--ink)" : "var(--mute)",
              }}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
