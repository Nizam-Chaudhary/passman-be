import { defineConfig } from "drizzle-kit";
import env from "./src/lib/env";

export default defineConfig({
    schema: "./src/db/schema/schema.ts",
    out: "./src/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: env.DB_URL,
    },
    verbose: env.NODE_ENV === "development",
    strict: true,
});
