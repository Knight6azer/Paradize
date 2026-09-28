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
      background: "var(--bg-primary)",
      position: "relative",
    }}>
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "480px" }}>
        {children}
      </div>
    </div>
  );
}
