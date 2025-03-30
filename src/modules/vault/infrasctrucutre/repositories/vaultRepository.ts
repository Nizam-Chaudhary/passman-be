import { Transaction } from "../../../../shared/domain/repositories/transaction.js";
import { VaultRepository } from "../../domain/repositories/vaultRepository.js";
import { Vault } from "../../types/vault.js";
import { DB } from "../../../../db/index.js";
import { DrizzleTx } from "../../../../shared/domain/types/drizzle.js";
import { vaults } from "../../../../db/schema/schema.js";
import { and, eq } from "drizzle-orm";
import { inject, injectable } from "tsyringe";

@injectable()
export class VaultRepositoryImpl implements VaultRepository {
  constructor(@inject(Symbol("Db")) private readonly db: DB) {}

  getConnection(tx?: Transaction) {
    return tx ? (tx as unknown as DrizzleTx) : this.db;
  }

  async createVault(
    vault: {
      userId: number;
      name: string;
    },
    options?: { tx?: Transaction }
  ): Promise<Vault> {
    const connection = this.getConnection(options?.tx);

    const createdVault = (
      await connection.insert(vaults).values(vault).returning()
    )[0];

    return createdVault;
  }

  async updateVault(
    id: number,
    userId: number,
    name: string,
    options?: { tx?: Transaction }
  ): Promise<Vault | undefined> {
    const connection = this.getConnection(options?.tx);

    const updatedVault = (
      await connection
        .update(vaults)
        .set({ name })
        .where(and(eq(vaults.id, id), eq(vaults.userId, userId)))
        .returning()
    )[0];

    if (!updatedVault) return undefined;

    return updatedVault;
  }

  async getVaultsByUserId(
    userId: number,
    options?: { tx?: Transaction }
  ): Promise<Vault[]> {
    const connection = this.getConnection(options?.tx);

    const userVaults = await connection
      .select()
      .from(vaults)
      .where(eq(vaults.userId, userId));

    return userVaults;
  }

  async getVaultById(
    id: number,
    options?: { tx?: Transaction }
  ): Promise<Vault | undefined> {
    const connection = this.getConnection(options?.tx);

    const vault = await connection.query.vaults.findFirst({
      where: eq(vaults.id, id),
    });

    if (!vault) return undefined;

    return vault;
  }

  async deleteVault(
    id: number,
    userId: number,
    options?: { tx?: Transaction }
  ): Promise<Vault | undefined> {
    const connection = this.getConnection(options?.tx);

    const deletedVault = (
      await connection
        .delete(vaults)
        .where(and(eq(vaults.id, id), eq(vaults.userId, userId)))
        .returning()
    )[0];

    if (!deletedVault) return undefined;

    return deletedVault;
  }
}
