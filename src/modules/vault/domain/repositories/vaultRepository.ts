import { Transaction } from "../../../../shared/domain/repositories/transaction";
import { Vault } from "../../types/vault";

/**
 * Repository interface for managing vault operations
 */
export interface VaultRepository {
  /**
   * Creates a new vault
   * @param name - The name of the vault to create
   * @param options - Options object containing transaction
   * @param options.tx - The transaction to use for the operation
   * @returns A promise that resolves to the created Vault
   */
  createVault(
    vault: {
      userId: number;
      name: string;
    },
    options?: {
      tx?: Transaction;
    }
  ): Promise<Vault>;

  /**
   * Updates an existing vault
   * @param id - The ID of the vault to update
   * @param name - The new name for the vault
   * @param options - Options object containing transaction
   * @param options.tx - The transaction to use for the operation
   * @returns A promise that resolves to the updated Vault
   */
  updateVault(
    id: number,
    userId: number,
    name: string,
    options?: {
      tx?: Transaction;
    }
  ): Promise<Vault | undefined>;

  /**
   * Retrieves a vault by its ID
   * @param id - The ID of the vault to retrieve
   * @param options - Options object containing transaction
   * @param options.tx - The transaction to use for the operation
   * @returns A promise that resolves to the found Vault
   */
  getVaultById(
    id: number,
    options?: {
      tx?: Transaction;
    }
  ): Promise<Vault | undefined>;

  /**
   * Retrieves all vaults belonging to a specific user
   * @param userId - The ID of the user whose vaults to retrieve
   * @param options - Options object containing transaction
   * @param options.tx - The transaction to use for the operation
   * @returns A promise that resolves to an array of Vaults
   */
  getVaultsByUserId(
    userId: number,
    options?: {
      tx?: Transaction;
    }
  ): Promise<Vault[]>;

  /**
   * Deletes a vault
   * @param id - The ID of the vault to delete
   * @param options - Options object containing transaction
   * @param options.tx - The transaction to use for the operation
   * @returns A promise that resolves to the deleted Vault
   */
  deleteVault(
    id: number,
    userId: number,
    options?: {
      tx?: Transaction;
    }
  ): Promise<Vault | undefined>;
}
