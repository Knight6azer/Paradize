# Paradize 🌿

> Read. Reflect. Grow Together.

Paradize is not just another reading app. It is a global movement built to transform people through reading, meaningful conversations, and lifelong intellectual growth. In an age of mindless scrolling and superficial consumption, Paradize offers a sanctuary for the curious, the thoughtful, and the ambitious.

## 🌟 The Vision

Our mission is to create the world’s most trusted community where books serve as bridges to self-understanding and connection with others. Paradize is built on four core principles:

1. **Curiosity Over Certainty**: The best readers ask questions, not just collect answers.
2. **Respect Over Agreement**: Disagree with ideas, never with people.
3. **Growth Over Ego**: Celebrate the humility of changing your mind.
4. **Understanding Over Winning**: Conversations are for comprehension, not competition.

We aim to replace the isolation of modern life with small, tight-knit reading circles, AI-assisted reflection, and evidence-based discussions that reward depth over virality.

## ✨ Features

- **Smart Book Library**: AI-powered recommendations tailored to your personal growth goals, not just your favorite genres.
- **Meaningful Discussions**: Structured, troll-free conversation spaces that use AI moderation to prioritize depth and respect.
- **Reading Groups**: Intimate groups of 5-20 readers with shared schedules and accountability.
- **Private Reflection Journal**: An encrypted space to process insights with AI-generated prompts that connect books to your real life.
- **Verified Achievements**: Earn reputation by demonstrating genuine understanding through thoughtful insights and community contributions.

## 🛠️ Tech Stack

Paradize is built to be fast, secure, open-source, and highly scalable.

- **Frontend/Framework**: [Next.js 16](https://nextjs.org/) (App Router), React 19, TypeScript
- **Styling**: Vanilla CSS Design System (Custom properties, CSS modules)
- **Database**: [Neon PostgreSQL](https://neon.tech/) (Serverless) + [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://better-auth.com/) (Email + Google OAuth)
- **AI Integration**: Hybrid strategy using **Gemini 2.0 Flash** (Recommendations, Summaries) and **HuggingFace** (Toxicity Detection)
- **Book Metadata**: Google Books API + Open Library API

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have Node.js (v20+) and npm installed.

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Knight6azer/Paradize.git
cd Paradize
npm install
```

### 3. Environment Variables

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the necessary API keys in `.env.local`:
- `DATABASE_URL`: Your Neon PostgreSQL connection string.
- `BETTER_AUTH_SECRET`: A random 32-character string.
- `GOOGLE_CLIENT_ID` / `SECRET`: For Google OAuth.
- `GEMINI_API_KEY`: For AI recommendations.

### 4. Database Setup

Generate the schema and push it to your database:

```bash
npm run db:generate
npm run db:push
```

### 5. Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 License

This project is open-source and available under the MIT License.

---
*Built by Ujjwal & Om in Mumbai, for the world.*
