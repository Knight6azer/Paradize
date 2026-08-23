"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/client";
import { ArrowRight, ArrowLeft, Sparkle } from "@phosphor-icons/react";
import styles from "./page.module.css";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const GENRES = [
  "Fiction", "Non-Fiction", "Science Fiction", "Fantasy", 
  "Mystery", "Biography", "History", "Philosophy", 
  "Psychology", "Business", "Self-Help", "Poetry"
];

const READING_SPEEDS = [
  { value: "slow", title: "1-2 books", desc: "Taking my time" },
  { value: "medium", title: "3-5 books", desc: "Steady reader" },
  { value: "fast", title: "6+ books", desc: "Devouring pages" },
];

const STYLES = [
  { value: "solo", emoji: "🧘", title: "Solo Reflector", desc: "I prefer to read and journal privately" },
  { value: "community", emoji: "🤝", title: "Community Builder", desc: "I love discussing books with others" },
];

const CHALLENGES = [
  "Finding time to read",
  "Choosing the right book",
  "Remembering what I read",
  "Finishing books I start",
  "Finding a community to discuss with"
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [genres, setGenres] = useState<string[]>([]);
  const [speed, setSpeed] = useState("");
  const [style, setStyle] = useState("");
  const [challenge, setChallenge] = useState("");
  const [goal, setGoal] = useState("");

  if (isPending) return <LoadingSpinner label="Loading your profile..." />;
  if (!session) {
    router.push("/login");
    return null;
  }

  const toggleGenre = (genre: string) => {
    setGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : prev.length < 5 ? [...prev, genre] : prev
    );
  };

  const handleComplete = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/users/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          favoriteGenres: genres,
          booksPerMonth: speed,
          readingStyle: style,
          biggestChallenge: challenge,
          growthGoal: goal
        })
      });

      if (!res.ok) throw new Error("Failed to save preferences");
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "What do you love to read?",
      isValid: genres.length > 0,
      content: (
        <>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "var(--space-8)" }}>
            Select up to 5 genres ({genres.length}/5)
          </p>
          <div className={styles.grid}>
            {GENRES.map(g => (
              <button
                key={g}
                className={`${styles.chip} ${genres.includes(g) ? styles["chip--active"] : ""}`}
                onClick={() => toggleGenre(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </>
      )
    },
    {
      title: "How many books do you read in a month?",
      isValid: speed !== "",
      content: (
        <div className={styles.options}>
          {READING_SPEEDS.map(s => (
            <button
              key={s.value}
              className={`${styles.option} ${speed === s.value ? styles["option--active"] : ""}`}
              onClick={() => setSpeed(s.value)}
            >
              <div className={styles.option__content}>
                <div className={styles.option__title}>{s.title}</div>
                <div className={styles.option__desc}>{s.desc}</div>
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "What's your reading style?",
      isValid: style !== "" && challenge !== "",
      content: (
        <>
          <div className={styles.options} style={{ marginBottom: "var(--space-8)" }}>
            {STYLES.map(s => (
              <button
                key={s.value}
                className={`${styles.option} ${style === s.value ? styles["option--active"] : ""}`}
                onClick={() => setStyle(s.value)}
              >
                <div className={styles.option__icon}>{s.emoji}</div>
                <div className={styles.option__content}>
                  <div className={styles.option__title}>{s.title}</div>
                  <div className={styles.option__desc}>{s.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <p style={{ fontWeight: "var(--weight-semibold)", marginBottom: "var(--space-4)" }}>
            What is your biggest reading challenge?
          </p>
          <div className={styles.options}>
            {CHALLENGES.map(c => (
              <button
                key={c}
                className={`${styles.option} ${challenge === c ? styles["option--active"] : ""}`}
                onClick={() => setChallenge(c)}
              >
                <div className={styles.option__content}>
                  <div className={styles.option__title}>{c}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )
    },
    {
      title: "Set an intention",
      isValid: true, // optional
      content: (
        <>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "var(--space-8)" }}>
            What do you hope to gain from your time on Paradize? (Optional)
          </p>
          <textarea
            className={styles.textarea}
            placeholder="I want to read more diversely and finally tackle that intimidating philosophy book..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </>
      )
    }
  ];

  const currentStep = steps[step];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome to Paradize</h1>
        <p className={styles.subtitle}>Let's set up your reading profile</p>
      </div>

      <div className={styles.progress}>
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`${styles.progress__dot} ${i === step ? styles["progress__dot--active"] : ""} ${i < step ? styles["progress__dot--completed"] : ""}`} 
          />
        ))}
      </div>

      <div className={styles.step} key={step}>
        <h2 className={styles.step__title}>{currentStep.title}</h2>
        {currentStep.content}
        
        {error && (
          <div style={{ color: "var(--error-main)", textAlign: "center", marginBottom: "var(--space-4)" }}>
            {error}
          </div>
        )}

        <div className={styles.actions}>
          {step > 0 ? (
            <button 
              className="btn btn--secondary" 
              onClick={() => setStep(s => s - 1)}
              disabled={loading}
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : <div />}

          {step < steps.length - 1 ? (
            <button 
              className="btn btn--primary"
              disabled={!currentStep.isValid}
              onClick={() => setStep(s => s + 1)}
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button 
              className="btn btn--primary"
              disabled={loading}
              onClick={handleComplete}
            >
              {loading ? "Saving..." : (
                <>Complete Profile <Sparkle size={16} weight="fill" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
