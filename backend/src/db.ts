import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL must be set for PostgreSQL usage. Assuming SQLite usage if not set.");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgres://localhost:5432/dummy" });
export const db = drizzle(pool, { schema });
