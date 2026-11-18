<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16 Conventions & Agent Guidelines

This project runs on Next.js 16 (App Router), React 19, TypeScript 5, and Drizzle ORM.
Heed Next.js 16 deprecation notices and breaking changes. Note that route guarding is implemented via `src/proxy.ts`.

## Central Project Documentation
All architectural specifications, database schemas, API contracts, security practices, and installation commands are consolidated in the primary project documentation:
👉 Please refer directly to **[README.md](./README.md)** as the single source of truth.

## Core Operational Rules for AI Agents
1. **Core Philosophy**: Preserve the 4 foundational principles: *Curiosity Over Certainty*, *Respect Over Agreement*, *Growth Over Ego*, *Understanding Over Winning*.
2. **Security & Authorization**: Never trust client-supplied user IDs (`body.authorId`, `body.userId`). Always authorize actions against `session.user.id` using `getServerSession(auth)`.
3. **Input Sanitization**: Always validate inputs with Zod schemas and sanitize rich text with `DOMPurify.sanitize()`.
4. **Cohort Bounds**: Reading groups strictly enforce 5–20 member cohorts.
5. **Quality Verification**: Verify all modifications with `npm test`, `npm run lint`, and `npx tsc --noEmit` before concluding.
<!-- END:nextjs-agent-rules -->
