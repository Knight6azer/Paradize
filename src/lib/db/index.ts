import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

/**
 * Paradize Database Client
 *
 * Uses Neon serverless PostgreSQL with Drizzle ORM.
 * Connection is created on-demand (serverless-friendly).
 *
 * For local development without a database:
 * - The app still works (landing page, etc.)
 * - Database operations will fail gracefully
 */

function createDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.warn(
      "⚠️  DATABASE_URL not set. Database operations will not work.\n" +
        "   Set up a Neon database at https://neon.tech and add the URL to .env.local"
    );
    return null;
  }

  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

// Lazy initialization — only create connection when needed
let _db: ReturnType<typeof createDb> | undefined;

export function getDb() {
  if (_db === undefined) {
    _db = createDb();
  }
  if (_db === null) {
    throw new Error(
      "Database not configured. Set DATABASE_URL in .env.local"
    );
  }
  return _db;
}

export type Database = NonNullable<ReturnType<typeof createDb>>;
