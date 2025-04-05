import { Transaction } from "./transaction";

export interface TransactionManager {
  run<T>(operation: (tx: Transaction) => Promise<T>): Promise<T>;
}
