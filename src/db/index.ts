import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import env from "../shared/config/env";
import * as schema from "./schema/schema";
import { singleton } from "tsyringe";

const { Pool } = pg;

@singleton()
export class Database {
  private pool: pg.Pool;
  private drizzleInstance: NodePgDatabase<typeof schema>;

  constructor() {
    this.pool = new Pool({
      connectionString: `postgresql://${env.DB_USERNAME}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}${env.DB_SSL}`,
    });

    this.drizzleInstance = drizzle(this.pool, {
      schema,
      logger: env.NODE_ENV === "development",
    });
  }

  get connection() {
    return this.drizzleInstance;
  }
}
