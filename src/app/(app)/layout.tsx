"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BookBookmark, House, Books, ChatTeardropDots, User, SignOut, Plus, Compass } from "@phosphor-icons/react";
import { useSession, signOut } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: House },
    { name: "Library", href: "/library", icon: Books },
    { name: "Discover", href: "/discover", icon: Compass },
    { name: "Discussions", href: "/discussions", icon: ChatTeardropDots },
    { name: "Profile", href: `/profile/${session?.user?.username || ''}`, icon: User },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-secondary)" }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: "280px",
        background: "var(--bg-card)",
        borderRight: "1px solid var(--border-light)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        padding: "var(--space-6)",
      }}>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", color: "var(--text-primary)", marginBottom: "var(--space-10)" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, var(--forest-sage), var(--forest-sage-dark))", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <BookBookmark size={20} weight="bold" />
          </div>
          Paradize
        </Link>

        <nav style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--radius-lg)",
                  fontSize: "var(--text-base)",
                  fontWeight: isActive ? "var(--weight-semibold)" : "var(--weight-medium)",
                  color: isActive ? "var(--forest-sage)" : "var(--text-secondary)",
                  background: isActive ? "rgba(45, 95, 62, 0.08)" : "transparent",
                  transition: "all var(--transition-fast)",
                }}
              >
                <Icon size={24} weight={isActive ? "fill" : "regular"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <button className="btn btn--primary" style={{ width: "100%", padding: "var(--space-4)", marginBottom: "var(--space-6)" }}>
          <Plus size={20} weight="bold" />
          New Discussion
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", paddingTop: "var(--space-6)", borderTop: "1px solid var(--border-light)" }}>
          <div className="avatar">
            {session?.user?.name?.[0] || 'U'}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {session?.user?.name || 'Loading...'}
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
              Level 1 Reader
            </div>
          </div>
          <button onClick={handleSignOut} style={{ color: "var(--text-tertiary)", padding: "var(--space-2)", borderRadius: "var(--radius-md)" }} aria-label="Sign out">
            <SignOut size={20} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "var(--space-8) var(--space-12)", maxWidth: "1200px" }}>
        {children}
      </main>
    </div>
  );
}
