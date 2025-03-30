import { VaultRepository } from "../../domain/repositories/vaultRepository.js";
import { Vault } from "../../types/vault.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateVaultUseCase {
  constructor(
    @inject("VaultRepository")
    private readonly vaultRepository: VaultRepository
  ) {}

  async execute(vault: { userId: number; name: string }): Promise<Vault> {
    return await this.vaultRepository.createVault(vault);
  }
}
