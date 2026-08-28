import { Sidebar } from "@/components/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full overflow-hidden flex" style={{ background: "var(--paper)" }}>
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto" style={{ padding: "var(--s6) var(--pad)" }}>
          <div style={{ maxWidth: 1100 }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
