"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpenText,
  Users,
  ChatCircleDots,
  CalendarBlank,
  MapPin,
  Play,
  ArrowRight,
  X,
  EnvelopeSimple,
  UsersThree,
  TrendUp,
  CalendarCheck,
  Coffee,
  CheckCircle,
  List,
  InstagramLogo,
  TwitterLogo,
  LinkedinLogo,
  YoutubeLogo,
  Sparkle
} from "@phosphor-icons/react";
import styles from "./page.module.css";

/* ─── 6 Horizontal Feature Pills ───────────────────── */
const featurePills = [
  {
    icon: <ChatCircleDots size={22} weight="duotone" />,
    title: "Thoughtful Discussions",
    desc: "Dive deep into curated discussions that challenge your thinking."
  },
  {
    icon: <UsersThree size={22} weight="duotone" />,
    title: "Multiple Perspectives",
    desc: "Explore every idea from different lenses and backgrounds."
  },
  {
    icon: <BookOpenText size={22} weight="duotone" />,
    title: "Diverse Genres",
    desc: "From fiction to philosophy, science to history—read what expands you."
  },
  {
    icon: <TrendUp size={22} weight="duotone" />,
    title: "Personal Growth",
    desc: "Track your journey, reflect on insights, and become your best self."
  },
  {
    icon: <CalendarCheck size={22} weight="duotone" />,
    title: "Events & Meetups",
    desc: "Join live sessions online and offline. Connect. Learn. Belong."
  },
  {
    icon: <Coffee size={22} weight="duotone" />,
    title: "Offline Cafés",
    desc: "Real conversations. Great coffee. Lifelong connections."
  }
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [eventJoined, setEventJoined] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterMsg, setNewsletterMsg] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setNewsletterStatus("error");
      setNewsletterMsg("Please enter a valid email address.");
      return;
    }
    setNewsletterStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterStatus("success");
        setNewsletterMsg(data.message || "You're subscribed! Welcome to Paradize reads.");
        setNewsletterEmail("");
      } else {
        setNewsletterStatus("error");
        setNewsletterMsg(data.error || "Subscription failed. Please try again.");
      }
    } catch {
      setNewsletterStatus("error");
      setNewsletterMsg("Failed to connect. Please try again.");
    }
  };

  return (
    <div className={styles.page}>
      {/* ─── Navigation ─────────────────────────────── */}
      <header className={styles.nav}>
        <div className={styles.nav__inner}>
          <Link href="/" className={styles.nav__brand} aria-label="Paradize Home">
            <div className={styles.nav__logo_icon}>
              <BookOpenText size={32} weight="duotone" />
            </div>
            <div className={styles.nav__brand_text}>
              <span className={styles.nav__brand_name}>Paradize</span>
              <span className={styles.nav__brand_tagline}>Read. Reflect. Grow. Together.</span>
            </div>
          </Link>

          <nav className={styles.nav__links} aria-label="Main Navigation">
            <Link href="/" className={`${styles.nav__link} ${styles["nav__link--active"]}`}>Home</Link>
            <Link href="/groups" className={styles.nav__link}>Community</Link>
            <Link href="/discussions" className={styles.nav__link}>Discussions</Link>
            <Link href="/groups" className={styles.nav__link}>Events</Link>
            <Link href="/discover" className={styles.nav__link}>Resources</Link>
            <button
              onClick={() => setHowItWorksOpen(true)}
              className={styles.nav__link}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              About Us
            </button>
          </nav>

          <div className={styles.nav__actions}>
            <Link href="/login" className={styles.nav__btn_login}>
              Log In
            </Link>
            <Link href="/register" className={styles.nav__btn_join}>
              Join Now
            </Link>
            <button
              className={styles.nav__mobile_toggle}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{
            padding: "1rem 2rem 1.5rem",
            background: "var(--bg-card)",
            borderBottom: "1px solid var(--border-light)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}>
            <Link href="/" className={styles.nav__link} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/groups" className={styles.nav__link} onClick={() => setMobileMenuOpen(false)}>Community</Link>
            <Link href="/discussions" className={styles.nav__link} onClick={() => setMobileMenuOpen(false)}>Discussions</Link>
            <Link href="/groups" className={styles.nav__link} onClick={() => setMobileMenuOpen(false)}>Events</Link>
            <Link href="/discover" className={styles.nav__link} onClick={() => setMobileMenuOpen(false)}>Resources</Link>
            <button
              onClick={() => { setMobileMenuOpen(false); setHowItWorksOpen(true); }}
              className={styles.nav__link}
              style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
            >
              About Us
            </button>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <Link href="/login" className={styles.nav__btn_login} style={{ flex: 1, textAlign: "center" }}>Log In</Link>
              <Link href="/register" className={styles.nav__btn_join} style={{ flex: 1, textAlign: "center" }}>Join Now</Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── Hero Section ───────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.hero__container}>
          {/* Left Column: Headline, Copy, CTAs, Stats */}
          <div className={styles.hero__content}>
            <div className={styles.hero__badge}>
              <Users size={16} weight="bold" />
              <span>A COMMUNITY FOR CURIOUS MINDS</span>
            </div>

            <h1 className={styles.hero__title}>
              Read to Understand.<br />
              Discuss to <span className={styles.hero__title_accent}>Grow.</span>
            </h1>

            <p className={styles.hero__subtitle}>
              A virtual ground for readers to explore ideas, share perspectives, and grow together.
              Different books. Multiple viewpoints. One journey of constant growth.
            </p>

            <div className={styles.hero__actions}>
              <Link href="/register" className={styles.btn__hero_primary}>
                Join the Community
              </Link>
              <button
                type="button"
                className={styles.btn__hero_secondary}
                onClick={() => setHowItWorksOpen(true)}
              >
                <Play size={16} weight="fill" />
                How It Works
              </button>
            </div>

            <div className={styles.hero__stats}>
              <div className={styles.hero__stat_item}>
                <div className={styles.hero__stat_icon}>
                  <Users size={22} weight="duotone" />
                </div>
                <div>
                  <div className={styles.hero__stat_number}>10K+</div>
                  <div className={styles.hero__stat_label}>Members</div>
                </div>
              </div>

              <div className={styles.hero__stat_item}>
                <div className={styles.hero__stat_icon}>
                  <ChatCircleDots size={22} weight="duotone" />
                </div>
                <div>
                  <div className={styles.hero__stat_number}>250+</div>
                  <div className={styles.hero__stat_label}>Active Discussions</div>
                </div>
              </div>

              <div className={styles.hero__stat_item}>
                <div className={styles.hero__stat_icon}>
                  <CalendarBlank size={22} weight="duotone" />
                </div>
                <div>
                  <div className={styles.hero__stat_number}>50+</div>
                  <div className={styles.hero__stat_label}>Monthly Events</div>
                </div>
              </div>

              <div className={styles.hero__stat_item}>
                <div className={styles.hero__stat_icon}>
                  <MapPin size={22} weight="duotone" />
                </div>
                <div>
                  <div className={styles.hero__stat_number}>25+</div>
                  <div className={styles.hero__stat_label}>Cities (Offline)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Photograph & Overlaid Quote Card */}
          <div className={styles.hero__visual}>
            <Image
              src="/images/hero-readers.jpg"
              alt="Readers enjoying books and warm conversation in an inviting library cafe"
              width={720}
              height={540}
              priority
              className={styles.hero__image}
            />
            <div className={styles.hero__quote_card}>
              <div className={styles.hero__quote_icon}>&ldquo;</div>
              <div className={styles.hero__quote_text}>
                We don&apos;t read to agree.<br />
                We read to understand.
              </div>
              <div className={styles.hero__quote_author}>
                — Paradize Community
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6 Horizontal Feature Pills ─────────────── */}
      <section className={styles.features_bar} aria-label="Community Pillars">
        <div className={styles.features_grid}>
          {featurePills.map((feat) => (
            <div key={feat.title} className={styles.feature_pill}>
              <div className={styles.feature_pill__icon_wrap}>
                {feat.icon}
              </div>
              <h2 className={styles.feature_pill__title}>{feat.title}</h2>
              <p className={styles.feature_pill__desc}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4-Card Lower Grid (Community Showcase) ─── */}
      <section className={styles.showcase} aria-label="Community Showcase">
        <div className={styles.showcase_grid}>
          {/* Card 1: Currently Reading Together */}
          <div className={styles.card_widget}>
            <div className={styles.card_widget__header}>
              <span className={styles.card_widget__title}>Currently Reading Together</span>
              <Link href="/groups" className={styles.card_widget__link}>
                View all <ArrowRight size={13} weight="bold" />
              </Link>
            </div>

            <div className={styles.reading_item}>
              <Image
                src="/images/sapiens-cover.jpg"
                alt="Sapiens book cover"
                width={76}
                height={108}
                className={styles.book_thumb}
              />
              <div className={styles.book_info}>
                <h3 className={styles.book_title}>Sapiens</h3>
                <div className={styles.book_subtitle}>A Brief History of Humankind</div>
                <div className={styles.book_author}>Yuval Noah Harari</div>
                <div className={styles.progress_row}>
                  <span>Chapter 6 of 20</span>
                  <span className={styles.progress_pct}>30%</span>
                </div>
                <div className={styles.progress_bar}>
                  <div className={styles.progress_fill} style={{ width: "30%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Upcoming Event */}
          <div className={styles.card_widget}>
            <div className={styles.card_widget__header}>
              <span className={styles.card_widget__title}>Upcoming Event</span>
              <Link href="/groups" className={styles.card_widget__link}>
                View all <ArrowRight size={13} weight="bold" />
              </Link>
            </div>

            <div className={styles.event_wrap}>
              <div className={styles.event_thumb_box}>
                <Image
                  src="/images/event-discussion.jpg"
                  alt="Thoughtful conversation event"
                  width={300}
                  height={120}
                  className={styles.event_thumb}
                />
                <span className={styles.event_badge}>LIVE DISCUSSION</span>
              </div>
              <h3 className={styles.event_title}>The Psychology of Decision Making</h3>
              <div className={styles.event_date}>Sat, 1 June 2024 &bull; 7:00 PM IST</div>
              <div className={styles.event_footer}>
                <div className={styles.attendees_row}>
                  <div className={styles.avatar_stack}>
                    <div className={styles.stack_avatar}>U</div>
                    <div className={styles.stack_avatar}>A</div>
                    <div className={styles.stack_avatar}>R</div>
                  </div>
                  <span className={styles.attendees_count}>+120 going</span>
                </div>
                <button
                  type="button"
                  className={styles.btn__join_event}
                  onClick={() => setEventJoined(true)}
                >
                  {eventJoined ? "Joined!" : "Join Event"}
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: What Members Are Saying */}
          <div className={styles.card_widget}>
            <div className={styles.card_widget__header}>
              <span className={styles.card_widget__title}>What Members Are Saying</span>
              <Link href="/discussions" className={styles.card_widget__link}>
                View all <ArrowRight size={13} weight="bold" />
              </Link>
            </div>

            <div className={styles.testimonial_wrap}>
              <div className={styles.quote_mark}>&ldquo;</div>
              <blockquote className={styles.testimonial_quote}>
                Paradize has completely changed the way I read and think. The discussions are insightful, respectful, and truly inspiring.
              </blockquote>
              <div className={styles.member_row}>
                <Image
                  src="/images/ananya-avatar.jpg"
                  alt="Ananya P. profile"
                  width={38}
                  height={38}
                  className={styles.member_avatar}
                />
                <div>
                  <div className={styles.member_name}>Ananya P.</div>
                  <div className={styles.member_joined}>Member since 2023</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Your Journey */}
          <div className={styles.card_widget}>
            <div className={styles.card_widget__header}>
              <span className={styles.card_widget__title}>Your Journey</span>
            </div>

            <div className={styles.journey_wrap}>
              <div className={styles.journey_top}>
                <div className={styles.journey_ring_box}>
                  <svg className={styles.journey_ring_svg} viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      strokeWidth="7"
                      className={styles.journey_ring_bg}
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      strokeWidth="7"
                      strokeLinecap="round"
                      className={styles.journey_ring_val}
                    />
                  </svg>
                  <span className={styles.journey_pct_text}>72%</span>
                </div>

                <div className={styles.journey_metrics}>
                  <div className={styles.metric_item}>
                    <span className={styles.metric_label}>Books Read</span>
                    <span className={styles.metric_val}>12</span>
                  </div>
                  <div className={styles.metric_item}>
                    <span className={styles.metric_label}>Discussions Joined</span>
                    <span className={styles.metric_val}>45</span>
                  </div>
                  <div className={styles.metric_item}>
                    <span className={styles.metric_label}>Insights Shared</span>
                    <span className={styles.metric_val}>23</span>
                  </div>
                  <div className={styles.metric_item}>
                    <span className={styles.metric_label}>Growth Streak</span>
                    <span className={styles.metric_val}>18 weeks</span>
                  </div>
                </div>
              </div>

              <Link href="/dashboard" className={styles.btn__journey}>
                Continue Your Journey
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Newsletter Bar ─────────────────────────── */}
      <section className={styles.newsletter_section} aria-label="Newsletter">
        <div className={styles.newsletter_card}>
          <div className={styles.newsletter_left}>
            <div className={styles.newsletter_icon_box}>
              <EnvelopeSimple size={26} weight="duotone" />
            </div>
            <div>
              <h2 className={styles.newsletter_heading}>Ideas in your inbox. Growth in your life.</h2>
              <p className={styles.newsletter_subheading}>Weekly reads, discussion highlights, and exclusive invites.</p>
            </div>
          </div>

          <form onSubmit={handleNewsletterSubmit} className={styles.newsletter_form}>
            {newsletterStatus === "success" ? (
              <div className={styles.newsletter_success}>
                <CheckCircle size={20} weight="fill" style={{ marginRight: 6, verticalAlign: "middle" }} />
                {newsletterMsg}
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className={styles.newsletter_input}
                  required
                  disabled={newsletterStatus === "loading"}
                />
                <button
                  type="submit"
                  className={styles.newsletter_btn}
                  disabled={newsletterStatus === "loading"}
                >
                  {newsletterStatus === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
              </>
            )}
          </form>
        </div>
        {newsletterStatus === "error" && (
          <p style={{ color: "var(--error)", fontSize: "0.85rem", marginTop: "0.5rem", paddingLeft: "1rem" }}>
            {newsletterMsg}
          </p>
        )}
      </section>

      {/* ─── Footer ─────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footer_inner}>
          <div className={styles.footer_top}>
            <div className={styles.footer_brand}>
              <div className={styles.footer_logo_row}>
                <BookOpenText size={24} weight="duotone" color="var(--forest-sage)" />
                <span>Paradize</span>
              </div>
              <div className={styles.footer_copyright}>
                &copy; {new Date().getFullYear()} Paradize Community. All rights reserved.
              </div>
            </div>

            <div className={styles.footer_nav_group}>
              <span className={styles.footer_group_title}>Quick Links</span>
              <nav className={styles.footer_nav_links} aria-label="Footer Quick Links">
                <Link href="/groups" className={styles.footer_link}>Community</Link>
                <Link href="/groups" className={styles.footer_link}>Events</Link>
                <Link href="/discover" className={styles.footer_link}>Resources</Link>
                <button
                  onClick={() => setFaqOpen(true)}
                  className={styles.footer_link}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  FAQ
                </button>
                <a href="mailto:support@paradize.club" className={styles.footer_link}>Contact Us</a>
              </nav>
            </div>

            <div className={styles.footer_socials_wrap}>
              <div className={styles.footer_socials}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.footer_social_icon} aria-label="Instagram">
                  <InstagramLogo size={20} weight="fill" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.footer_social_icon} aria-label="Twitter">
                  <TwitterLogo size={20} weight="fill" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.footer_social_icon} aria-label="LinkedIn">
                  <LinkedinLogo size={20} weight="fill" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.footer_social_icon} aria-label="YouTube">
                  <YoutubeLogo size={20} weight="fill" />
                </a>
              </div>
              <div className={styles.footer_motto}>
                <span>Built for readers. Driven by conversations.</span>
                <span>🌿</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── How It Works Modal ─────────────────────── */}
      {howItWorksOpen && (
        <div className={styles.modal_overlay} onClick={() => setHowItWorksOpen(false)}>
          <div className={styles.modal_card} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modal_close}
              onClick={() => setHowItWorksOpen(false)}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
            <h2 className={styles.modal_title}>How Paradize Works</h2>
            <p className={styles.modal_body}>
              Paradize is built around a simple, powerful cycle designed to turn pages into enduring understanding.
            </p>

            <div className={styles.modal_steps}>
              <div className={styles.modal_step}>
                <div className={styles.modal_step_num}>1</div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>
                    Discover What Matters
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                    Find books aligned with your intellectual curiosity and growth goals—curated by readers, not algorithms trying to sell.
                  </p>
                </div>
              </div>

              <div className={styles.modal_step}>
                <div className={styles.modal_step_num}>2</div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>
                    Read & Reflect Privately
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                    Capture chapter notes and insights in your private Reflection Journal with guided prompts designed for long-term retention.
                  </p>
                </div>
              </div>

              <div className={styles.modal_step}>
                <div className={styles.modal_step_num}>3</div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>
                    Discuss & Grow Together
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                    Join cohort reading groups and local cafe meetups in Mumbai. Engage in structured, respectful discussions where depth is celebrated.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <Link
                href="/register"
                className={styles.btn__hero_primary}
                style={{ flex: 1, textAlign: "center" }}
                onClick={() => setHowItWorksOpen(false)}
              >
                Join the Community — It&apos;s Free
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── FAQ Modal ──────────────────────────────── */}
      {faqOpen && (
        <div className={styles.modal_overlay} onClick={() => setFaqOpen(false)}>
          <div className={styles.modal_card} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modal_close}
              onClick={() => setFaqOpen(false)}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
            <h2 className={styles.modal_title}>Frequently Asked Questions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              <div>
                <h4 style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem" }}>Is Paradize free to join?</h4>
                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  Yes, Paradize is 100% free for readers. Our community is open to everyone passionate about books and ideas.
                </p>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem" }}>Where are offline meetups held?</h4>
                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  We host weekend reading cafes across Mumbai (Bandra, Colaba, Powai) with additional chapters launching in Pune and Bangalore.
                </p>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem" }}>How do reading groups work?</h4>
                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  Groups read 2–3 chapters per week, sharing weekly reflections and meeting virtually or in-person for chapter deep-dives.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Event Joined Confirmation Toast ────────── */}
      {eventJoined && (
        <div style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          backgroundColor: "var(--forest-sage)",
          color: "#ffffff",
          padding: "0.85rem 1.35rem",
          borderRadius: "var(--radius-full)",
          boxShadow: "var(--shadow-lg)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          fontSize: "0.88rem",
          fontWeight: 600,
          animation: "fadeInUp 0.3s ease"
        }}>
          <CheckCircle size={20} weight="fill" />
          <span>You&apos;re registered for &ldquo;The Psychology of Decision Making&rdquo;!</span>
          <button
            onClick={() => setEventJoined(false)}
            style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", marginLeft: "0.5rem" }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
