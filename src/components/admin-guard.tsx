"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function AdminGuard({ children, allowedRoles = ["admin", "editor"] }: Props) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.role && allowedRoles.includes(data.role)) {
          setAuthorized(true);
        } else {
          router.replace("/");
        }
        setLoading(false);
      })
      .catch(() => {
        router.replace("/login");
        setLoading(false);
      });
  }, [allowedRoles, router]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "16rem" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--mute)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Loading...
        </span>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
