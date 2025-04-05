import { Transaction } from "../../domain/repositories/transaction";
import { PgTransaction } from "drizzle-orm/pg-core";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import * as schema from "../../../db/schema/schema";
import { ExtractTablesWithRelations } from "drizzle-orm";

export class DrizzleTransaction implements Transaction {
  constructor(
    private readonly drizzleTx: PgTransaction<
      NodePgQueryResultHKT,
      typeof schema,
      ExtractTablesWithRelations<typeof schema>
    >
  ) {}

  async commit(): Promise<void> {}

  async rollback(): Promise<void> {
    this.drizzleTx.rollback();
  }

  async release(): Promise<void> {}
}
