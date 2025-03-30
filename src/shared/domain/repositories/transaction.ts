export interface Transaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
  release(): Promise<void>;
}
