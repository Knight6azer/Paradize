import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "var(--space-8)",
        background: "var(--bg-primary)",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(45, 95, 62, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "var(--space-8)",
          fontSize: "36px",
        }}
      >
        📖
      </div>

      <h1
        style={{
          fontSize: "var(--text-5xl)",
          fontWeight: "var(--weight-black)",
          fontFamily: "var(--font-heading)",
          marginBottom: "var(--space-4)",
          background: "linear-gradient(135deg, var(--forest-sage), var(--teal-main))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        404
      </h1>

      <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-3)" }}>
        Page not found
      </h2>

      <p
        style={{
          color: "var(--text-secondary)",
          maxWidth: "400px",
          marginBottom: "var(--space-8)",
          lineHeight: "var(--leading-relaxed)",
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>

      <div style={{ display: "flex", gap: "var(--space-4)" }}>
        <Link href="/" className="btn btn--primary">
          Go Home
        </Link>
        <Link href="/discover" className="btn btn--secondary">
          Discover Books
        </Link>
      </div>
    </div>
  );
}
