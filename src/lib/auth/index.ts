import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(getDb(), {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.users,
    }
  }),
  user: {
    additionalFields: {
      username: { type: "string", required: false },
      displayName: { type: "string", required: false }
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: (user) => {
          return {
            data: {
              ...user,
              displayName: user.name || "User",
              username: user.email.split("@")[0].toLowerCase() + Math.floor(Math.random() * 10000),
            }
          }
        }
      }
    }
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }
  }
});
