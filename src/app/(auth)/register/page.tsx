"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "@/lib/auth/client";
import { BookBookmark, GoogleLogo } from "@phosphor-icons/react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signUpError } = await signUp.email({
      email,
      password,
      name,
    });

    if (signUpError) {
      setError(signUpError.message || "Failed to register");
      setLoading(false);
    } else {
      router.push("/onboarding");
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn.social({
      provider: "google",
      callbackURL: "/onboarding",
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
        <h1 style={{ fontSize: "var(--text-2xl)", marginTop: "var(--space-6)" }}>Join the Community</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: "var(--space-2)" }}>Read, reflect, and grow together.</p>
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
        Sign up with Google
      </button>

      <div style={{ display: "flex", alignItems: "center", margin: "var(--space-6) 0", color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>
        <div style={{ flex: 1, height: 1, background: "var(--border-light)" }} />
        <span style={{ padding: "0 var(--space-4)" }}>or sign up with email</span>
        <div style={{ flex: 1, height: 1, background: "var(--border-light)" }} />
      </div>

      <form onSubmit={handleEmailRegister} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div className="input-group">
          <label className="input-label" htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

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
            minLength={8}
          />
        </div>

        <button
          type="submit"
          className="btn btn--primary"
          style={{ width: "100%", marginTop: "var(--space-2)" }}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "var(--space-6)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--forest-sage)", fontWeight: "var(--weight-semibold)" }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
