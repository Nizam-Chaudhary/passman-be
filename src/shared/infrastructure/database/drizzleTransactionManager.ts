import { db } from "../../../db/index.js";
import { Transaction } from "../../domain/repositories/transaction.js";
import { TransactionManager } from "../../domain/repositories/transactionManager.js";
import { DrizzleTransaction } from "./drizzleTransaction.js";
import { injectable } from "tsyringe";

@injectable()
export class DrizzleTransactionManager implements TransactionManager {
  run<T>(operation: (tx: Transaction) => Promise<T>): Promise<T> {
    return db.transaction(async (tx) => {
      const transaction = new DrizzleTransaction(tx);
      return await operation(transaction);
    });
  }
}
