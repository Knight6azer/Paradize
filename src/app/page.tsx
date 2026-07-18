"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  BookOpenText,
  Users,
  Brain,
  ChartLineUp,
  ChatTeardropDots,
  Trophy,
  ArrowRight,
  BookBookmark,
  Sparkle,
  Compass,
  Heart,
  Lightning,
  Star,
  MapPin,
  GithubLogo,
  TwitterLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";
import styles from "./page.module.css";

/* ─── Animation Variants ───────────────────────────── */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Features Data ────────────────────────────────── */
const features = [
  {
    icon: <BookOpenText size={28} weight="duotone" />,
    iconClass: "sage",
    title: "Smart Book Library",
    description:
      "Discover your next transformative read. AI-powered recommendations based on your growth goals, not just genres.",
  },
  {
    icon: <ChatTeardropDots size={28} weight="duotone" />,
    iconClass: "amber",
    title: "Meaningful Discussions",
    description:
      "Go beyond reviews. Structured conversations that reward depth, evidence, and respectful disagreement.",
  },
  {
    icon: <Users size={28} weight="duotone" />,
    iconClass: "teal",
    title: "Reading Groups",
    description:
      "Join intimate groups of 5-20 readers. Shared schedules, chapter discussions, and accountability partners.",
  },
  {
    icon: <Brain size={28} weight="duotone" />,
    iconClass: "info",
    title: "Reflection Journal",
    description:
      "Private, encrypted space to process what you read. AI-prompted reflections turn books into lasting wisdom.",
  },
  {
    icon: <ChartLineUp size={28} weight="duotone" />,
    iconClass: "success",
    title: "Growth Dashboard",
    description:
      "Track your transformation — not just books completed, but perspectives explored, skills built, and ideas connected.",
  },
  {
    icon: <Trophy size={28} weight="duotone" />,
    iconClass: "error",
    title: "Verified Achievements",
    description:
      "Earn badges by proving genuine understanding — not just finishing pages. Your insights become your credentials.",
  },
];

/* ─── Values Data ──────────────────────────────────── */
const values = [
  {
    icon: "🔍",
    title: "Curiosity Over Certainty",
    desc: "The best readers ask questions, not just collect answers.",
  },
  {
    icon: "🤝",
    title: "Respect Over Agreement",
    desc: "Disagree with ideas, never with people. Every perspective teaches.",
  },
  {
    icon: "🌱",
    title: "Growth Over Ego",
    desc: "Being wrong is the first step to being right. Celebrate learning.",
  },
  {
    icon: "🏗️",
    title: "Understanding Over Winning",
    desc: "Seek to comprehend, not to convince. Conversations, not competitions.",
  },
];

/* ─── Steps Data ───────────────────────────────────── */
const steps = [
  {
    num: 1,
    title: "Discover",
    desc: "Take our reading personality quiz. Get AI-curated book recommendations tailored to your growth goals.",
  },
  {
    num: 2,
    title: "Read & Reflect",
    desc: "Track your reading. Journal your thoughts. Connect ideas across books with your personal Knowledge Map.",
  },
  {
    num: 3,
    title: "Discuss & Grow",
    desc: "Join reading groups. Engage in meaningful discussions. Earn reputation through quality, not quantity.",
  },
];

/* ─── Landing Page Component ───────────────────────── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ─── Navbar ────────────────────────────────── */}
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__inner">
          <a href="/" className="navbar__logo">
            <div className="navbar__logo-icon">
              <BookBookmark size={22} weight="bold" />
            </div>
            Paradize
          </a>

          <div className="navbar__links">
            <a href="#features" className="navbar__link">
              Features
            </a>
            <a href="#values" className="navbar__link">
              Values
            </a>
            <a href="#how-it-works" className="navbar__link">
              How It Works
            </a>
          </div>

          <div className="navbar__actions">
            <button className="btn btn--ghost">Sign In</button>
            <button className="btn btn--primary">
              <Sparkle size={16} weight="fill" />
              Join Paradize
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ──────────────────────────── */}
      <motion.section className={styles.hero} style={{ opacity: heroOpacity }}>
        <div className={styles.hero__bg}>
          <div
            className={`gradient-orb gradient-orb--sage ${styles["hero__orb-1"]} animate-float`}
          />
          <div
            className={`gradient-orb gradient-orb--amber ${styles["hero__orb-2"]} animate-float delay-200`}
          />
          <div
            className={`gradient-orb gradient-orb--teal ${styles["hero__orb-3"]} animate-pulse-soft`}
          />
        </div>

        <motion.div
          className={styles.hero__content}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          style={{ scale: heroScale }}
        >
          <motion.div className={styles.hero__badge} variants={fadeInUp} custom={0}>
            <span className={styles["hero__badge-dot"]} />
            Launching in Mumbai — Join the movement
          </motion.div>

          <motion.h1 className={styles.hero__title} variants={fadeInUp} custom={1}>
            Where Readers Become{" "}
            <span className={styles["hero__title-accent"]}>Thinkers</span>
          </motion.h1>

          <motion.p className={styles.hero__subtitle} variants={fadeInUp} custom={2}>
            Paradize is the community where books spark meaningful conversations,
            thoughtful reflection, and genuine personal growth. Read not to be
            smarter than others — but to better understand yourself, others, and
            the world.
          </motion.p>

          <motion.div className={styles.hero__actions} variants={fadeInUp} custom={3}>
            <button className="btn btn--primary btn--lg">
              Start Your Reading Journey
              <ArrowRight size={20} weight="bold" />
            </button>
            <button className="btn btn--secondary btn--lg">
              <Compass size={20} />
              Explore the Community
            </button>
          </motion.div>

          <motion.div className={styles.hero__stats} variants={fadeInUp} custom={4}>
            <div className={styles.hero__stat}>
              <div className={styles["hero__stat-number"]}>1,000+</div>
              <div className={styles["hero__stat-label"]}>Books Discussed</div>
            </div>
            <div className={styles.hero__stat}>
              <div className={styles["hero__stat-number"]}>50+</div>
              <div className={styles["hero__stat-label"]}>Reading Groups</div>
            </div>
            <div className={styles.hero__stat}>
              <div className={styles["hero__stat-number"]}>∞</div>
              <div className={styles["hero__stat-label"]}>Perspectives Shared</div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ─── Features Section ──────────────────────── */}
      <section id="features" className={styles.features}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 className="section-title" variants={fadeInUp} custom={0}>
              Built for Transformation, Not Consumption
            </motion.h2>
            <motion.p className="section-subtitle" variants={fadeInUp} custom={1}>
              Every feature is designed to help you grow — not just scroll.
              Powered by AI that enhances human connection.
            </motion.p>

            <div className={styles.features__grid}>
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  className={styles["feature-card"]}
                  variants={scaleIn}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div
                    className={`${styles["feature-card__icon"]} ${
                      styles[`feature-card__icon--${feature.iconClass}`]
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className={styles["feature-card__title"]}>
                    {feature.title}
                  </h3>
                  <p className={styles["feature-card__description"]}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Values Section ────────────────────────── */}
      <section id="values" className={styles.values}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 className="section-title" variants={fadeInUp} custom={0}>
              Our Guiding Principles
            </motion.h2>
            <motion.p className="section-subtitle" variants={fadeInUp} custom={1}>
              These aren&apos;t just words on a page. They shape every feature,
              every algorithm, every interaction.
            </motion.p>

            <div className={styles.values__grid}>
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  className={styles["value-item"]}
                  variants={fadeInUp}
                  custom={i}
                >
                  <div className={styles["value-item__icon"]}>{value.icon}</div>
                  <div>
                    <h3 className={styles["value-item__title"]}>
                      {value.title}
                    </h3>
                    <p className={styles["value-item__desc"]}>{value.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────── */}
      <section id="how-it-works" className={styles["how-it-works"]}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 className="section-title" variants={fadeInUp} custom={0}>
              Your Journey in Three Steps
            </motion.h2>
            <motion.p className="section-subtitle" variants={fadeInUp} custom={1}>
              From curious reader to confident thinker — we guide every step.
            </motion.p>

            <div className={styles.steps}>
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  className={styles.step}
                  variants={fadeInUp}
                  custom={i + 1}
                  whileHover={{ y: -4 }}
                >
                  <div className={styles.step__number}>{step.num}</div>
                  <h3 className={styles.step__title}>{step.title}</h3>
                  <p className={styles.step__desc}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Quote Section ─────────────────────────── */}
      <section className={styles["quote-section"]}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.p
              className={styles["quote-section__text"]}
              variants={fadeInUp}
              custom={0}
            >
              &ldquo;Reading is not merely about consuming books — it&apos;s
              about becoming wiser, kinder, and more capable of contributing
              positively to society.&rdquo;
            </motion.p>
            <motion.p
              className={styles["quote-section__author"]}
              variants={fadeInUp}
              custom={1}
            >
              — The Paradize Manifesto
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Section ───────────────────────────── */}
      <section className={styles.cta}>
        <div className="container">
          <motion.div
            className={styles.cta__card}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className={styles.cta__title}>
              Ready to Transform Your Reading Life?
            </h2>
            <p className={styles.cta__subtitle}>
              Join hundreds of curious minds in Mumbai who are reading deeper,
              thinking sharper, and growing together.
            </p>
            <button className={styles.cta__btn}>
              Join Paradize — It&apos;s Free
              <ArrowRight size={20} weight="bold" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footer__grid}>
            <div>
              <a href="/" className="navbar__logo">
                <div className="navbar__logo-icon">
                  <BookBookmark size={22} weight="bold" />
                </div>
                Paradize
              </a>
              <p className={styles["footer__brand-desc"]}>
                The world&apos;s most trusted reading community. Where books
                become bridges to understanding.
              </p>
              <div className={styles["mumbai-banner"]}>
                <MapPin size={14} weight="fill" />
                Made with <Heart size={12} weight="fill" color="#E76F51" /> in
                Mumbai
              </div>
            </div>

            <div>
              <h4 className={styles["footer__col-title"]}>Platform</h4>
              <div className={styles.footer__links}>
                <a href="#features" className={styles.footer__link}>
                  Features
                </a>
                <a href="#" className={styles.footer__link}>
                  Book Library
                </a>
                <a href="#" className={styles.footer__link}>
                  Reading Groups
                </a>
                <a href="#" className={styles.footer__link}>
                  Discussions
                </a>
              </div>
            </div>

            <div>
              <h4 className={styles["footer__col-title"]}>Community</h4>
              <div className={styles.footer__links}>
                <a href="#values" className={styles.footer__link}>
                  Our Values
                </a>
                <a href="#" className={styles.footer__link}>
                  Guidelines
                </a>
                <a href="#" className={styles.footer__link}>
                  Mumbai Meetups
                </a>
                <a href="#" className={styles.footer__link}>
                  Blog
                </a>
              </div>
            </div>

            <div>
              <h4 className={styles["footer__col-title"]}>Legal</h4>
              <div className={styles.footer__links}>
                <a href="#" className={styles.footer__link}>
                  Privacy Policy
                </a>
                <a href="#" className={styles.footer__link}>
                  Terms of Service
                </a>
                <a href="#" className={styles.footer__link}>
                  DPDPA Compliance
                </a>
                <a href="#" className={styles.footer__link}>
                  Contact
                </a>
              </div>
            </div>
          </div>

          <div className={styles.footer__bottom}>
            <span>© {new Date().getFullYear()} Paradize LLP. All rights reserved.</span>
            <div className={styles.footer__social}>
              <a href="#" className={styles["footer__social-link"]} aria-label="Twitter">
                <TwitterLogo size={20} weight="fill" />
              </a>
              <a href="#" className={styles["footer__social-link"]} aria-label="LinkedIn">
                <LinkedinLogo size={20} weight="fill" />
              </a>
              <a href="#" className={styles["footer__social-link"]} aria-label="GitHub">
                <GithubLogo size={20} weight="fill" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
