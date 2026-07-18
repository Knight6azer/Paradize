"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth/client";
import { BookBookmark, GoogleLogo } from "@phosphor-icons/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await signIn.email({
      email,
      password,
    });

    if (error) {
      setError(error.message || "Failed to log in");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="card card--glass animate-fade-in-up">
      <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", color: "var(--text-primary)" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, var(--forest-sage), var(--forest-sage-dark))", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <BookBookmark size={20} weight="bold" />
          </div>
          Paradize
        </Link>
        <h1 style={{ fontSize: "var(--text-2xl)", marginTop: "var(--space-6)" }}>Welcome back</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: "var(--space-2)" }}>Continue your reading journey.</p>
      </div>

      {error && (
        <div className="badge badge--error" style={{ display: "flex", width: "100%", padding: "var(--space-3)", marginBottom: "var(--space-4)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)" }}>
          {error}
        </div>
      )}

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="btn btn--secondary"
        style={{ width: "100%", marginBottom: "var(--space-6)", padding: "var(--space-4)" }}
      >
        <GoogleLogo size={20} weight="bold" />
        Continue with Google
      </button>

      <div style={{ display: "flex", alignItems: "center", margin: "var(--space-6) 0", color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>
        <div style={{ flex: 1, height: 1, background: "var(--border-light)" }} />
        <span style={{ padding: "0 var(--space-4)" }}>or sign in with email</span>
        <div style={{ flex: 1, height: 1, background: "var(--border-light)" }} />
      </div>

      <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div className="input-group">
          <label className="input-label" htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn btn--primary"
          style={{ width: "100%", marginTop: "var(--space-2)" }}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in to Paradize"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "var(--space-6)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
        Don&apos;t have an account?{" "}
        <Link href="/register" style={{ color: "var(--forest-sage)", fontWeight: "var(--weight-semibold)" }}>
          Join now
        </Link>
      </p>
    </div>
  );
}
