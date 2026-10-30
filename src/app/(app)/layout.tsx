"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./layout.module.css";
import { 
  Books, 
  Compass, 
  Layout,
  ChatsCircle,
  Users,
  Notebook,
  User,
  ArrowRight,
  List,
  X,
  Bell
} from "@phosphor-icons/react";
import { useSession, signOut } from "@/lib/auth/client";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Fallback user if session is loading
  const user = {
    name: session?.user?.name || t("app.reader", "Reader"),
    handle: `@${session?.user?.name?.toLowerCase().replace(/\s+/g, '') || "reader"}`,
    avatar: session?.user?.name?.charAt(0) || "R",
  };

  const getPageTitle = () => {
    if (pathname.includes("/dashboard")) return t("app.dashboard", "Dashboard");
    if (pathname.includes("/library")) return t("app.library", "My Library");
    if (pathname.includes("/discover")) return t("app.discover", "Discover Books");
    if (pathname.includes("/discussions")) return t("app.discussions", "Discussions");
    if (pathname.includes("/groups")) return t("app.groups", "Reading Groups");
    if (pathname.includes("/journal")) return t("app.journal", "Reflection Journal");
    if (pathname.includes("/profile")) return t("app.profile", "Profile");
    if (pathname.includes("/onboarding")) return t("app.onboarding", "Welcome to Paradize");
    return t("nav.brand", "Paradize");
  };

  const closeSidebar = () => setIsMobileSidebarOpen(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className={styles.layout}>
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`${styles.overlay} ${isMobileSidebarOpen ? styles["overlay--open"] : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isMobileSidebarOpen ? styles["sidebar--open"] : ""}`}>
        <div className={styles.sidebar__header}>
          <Link href="/" className={styles.sidebar__logo} onClick={closeSidebar}>
            <Books size={24} weight="duotone" color="var(--forest-sage)" />
            {t("nav.brand", "Paradize")}
          </Link>
          <button 
            className={styles.mobile__toggle} 
            onClick={closeSidebar}
            style={{ display: isMobileSidebarOpen ? "block" : "none" }}
          >
            <X size={24} />
          </button>
        </div>

        <nav className={styles.sidebar__nav}>
          <div className={styles.nav__section}>
            <div className={styles.nav__label}>{t("app.main", "Main")}</div>
            <Link
              href="/dashboard"
              className={`${styles.nav__item} ${pathname === "/dashboard" ? styles["nav__item--active"] : ""}`}
              onClick={closeSidebar}
            >
              <Layout size={20} weight={pathname === "/dashboard" ? "fill" : "regular"} />
              {t("app.dashboard", "Dashboard")}
            </Link>
            <Link
              href="/library"
              className={`${styles.nav__item} ${pathname === "/library" ? styles["nav__item--active"] : ""}`}
              onClick={closeSidebar}
            >
              <Books size={20} weight={pathname === "/library" ? "fill" : "regular"} />
              {t("app.library", "My Library")}
            </Link>
            <Link
              href="/discover"
              className={`${styles.nav__item} ${pathname.includes("/discover") ? styles["nav__item--active"] : ""}`}
              onClick={closeSidebar}
            >
              <Compass size={20} weight={pathname.includes("/discover") ? "fill" : "regular"} />
              {t("app.discover", "Discover")}
            </Link>
          </div>

          <div className={styles.nav__section}>
            <div className={styles.nav__label}>{t("app.community", "Community")}</div>
            <Link
              href="/discussions"
              className={`${styles.nav__item} ${pathname.includes("/discussions") ? styles["nav__item--active"] : ""}`}
              onClick={closeSidebar}
            >
              <ChatsCircle size={20} weight={pathname.includes("/discussions") ? "fill" : "regular"} />
              {t("app.discussions", "Discussions")}
            </Link>
            <Link
              href="/groups"
              className={`${styles.nav__item} ${pathname.includes("/groups") ? styles["nav__item--active"] : ""}`}
              onClick={closeSidebar}
            >
              <Users size={20} weight={pathname.includes("/groups") ? "fill" : "regular"} />
              {t("app.groups", "Reading Groups")}
            </Link>
          </div>

          <div className={styles.nav__section}>
            <div className={styles.nav__label}>{t("app.personal", "Personal")}</div>
            <Link
              href="/journal"
              className={`${styles.nav__item} ${pathname.includes("/journal") ? styles["nav__item--active"] : ""}`}
              onClick={closeSidebar}
            >
              <Notebook size={20} weight={pathname.includes("/journal") ? "fill" : "regular"} />
              {t("app.journal", "Reflection Journal")}
            </Link>
            <Link
              href={`/profile/${session?.user?.name?.toLowerCase().replace(/\s+/g, '') || "me"}`}
              className={`${styles.nav__item} ${pathname.includes("/profile") ? styles["nav__item--active"] : ""}`}
              onClick={closeSidebar}
            >
              <User size={20} weight={pathname.includes("/profile") ? "fill" : "regular"} />
              {t("app.profile", "Profile")}
            </Link>
          </div>
        </nav>

        <div className={styles.sidebar__footer}>
          <div className="avatar avatar--sm">{user.avatar}</div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
              {user.name}
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
              {user.handle}
            </div>
          </div>
          <button className="btn btn--ghost" style={{ padding: "var(--space-2)" }} onClick={handleSignOut} title={t("app.signOut", "Sign Out")}>
            <ArrowRight size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.main}>
        {/* Top Header */}
        <header className={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
            <button 
              className={styles.mobile__toggle} 
              onClick={() => setIsMobileSidebarOpen(true)}
              style={{ display: "block" }} // overridden by media query in CSS
            >
              <List size={24} />
            </button>
            <h1 className={styles.header__title}>{getPageTitle()}</h1>
          </div>
          <div className={styles.header__actions} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <LanguageSwitcher variant="header" />
            <button className="btn btn--ghost" style={{ padding: "var(--space-2)" }} aria-label={t("app.notifications", "Notifications")}>
              <Bell size={20} />
            </button>
            <button 
              className="btn btn--primary btn--sm"
              onClick={() => router.push("/discussions/new")}
            >
              {t("app.newDiscussion", "New Discussion")}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
