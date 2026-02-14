import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./migrations_sqlite",
    schema: "../shared/schema_sqlite.ts",
    dialect: "sqlite",
    dbCredentials: {
        url: "sqlite.db",
    },
});
