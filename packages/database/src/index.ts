import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { fileURLToPath } from "node:url";

// Load a caller's `.env` first (useful in deployments), then the local
// database-package file used by this workspace. `dotenv` does not override
// variables that are already present, so deployment configuration wins.
config({ quiet: true });
config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
  quiet: true,
});

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to connect to the database.");
}

export const db = drizzle(databaseUrl);

export * from "./db/schema";
export * from "drizzle-orm";
