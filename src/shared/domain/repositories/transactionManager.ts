import { Transaction } from "./transaction.js";

export interface TransactionManager {
  run<T>(operation: (tx: Transaction) => Promise<T>): Promise<T>;
}
