import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | Paradize",
  description: "Join the world's most trusted reading community.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--space-6)",
      background: "var(--bg-secondary)",
      position: "relative",
      overflow: "hidden"
    }}>
      <div className="gradient-orb gradient-orb--sage" style={{ width: 600, height: 600, top: "-10%", left: "-10%" }} />
      <div className="gradient-orb gradient-orb--amber" style={{ width: 500, height: 500, bottom: "-10%", right: "-10%" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "480px" }}>
        {children}
      </div>
    </div>
  );
}
