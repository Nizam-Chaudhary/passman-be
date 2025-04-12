import { Database } from "src/db";
import { injectable } from "tsyringe";
import { TransactionManager } from "../../domain/repositories/transactionManager";

@injectable()
export class DrizzleTransactionManager implements TransactionManager {
  constructor(private readonly db: Database) {}
  run<T>(operation: (tx: any) => Promise<T>): Promise<T> {
    return this.db.connection.transaction(async (tx) => {
      return await operation(tx);
    });
  }
}
