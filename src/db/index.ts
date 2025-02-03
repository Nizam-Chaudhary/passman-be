import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "../lib/env";
import * as schema from "./schema/schema";

const pool = new Pool({
  connectionString: `postgresql://${env.DB_USERNAME}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}${env.DB_SSL}`,
});

export const db = drizzle(pool, {
  schema,
  logger: env.NODE_ENV === "development" ? true : false,
});
export type DB = typeof db;
