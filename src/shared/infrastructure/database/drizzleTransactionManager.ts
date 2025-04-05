import { Database } from "src/db";
import { Transaction } from "../../domain/repositories/transaction";
import { TransactionManager } from "../../domain/repositories/transactionManager";
import { DrizzleTransaction } from "./drizzleTransaction";
import { injectable } from "tsyringe";

@injectable()
export class DrizzleTransactionManager implements TransactionManager {
  constructor(private readonly db: Database) {}
  run<T>(operation: (tx: Transaction) => Promise<T>): Promise<T> {
    console.log("Starting transaction");
    return this.db.connection.transaction(async (tx) => {
      const transaction = new DrizzleTransaction(tx);
      return await operation(transaction);
    });
  }
}
