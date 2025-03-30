import { injectable, inject } from "tsyringe";
import { VaultRepository } from "../../domain/repositories/vaultRepository.js";
import { Vault } from "../../types/vault.js";

@injectable()
export class GetVaultsForUserUseCase {
  constructor(
    @inject("VaultRepository")
    private readonly vaultRepository: VaultRepository
  ) {}

  async execute(userId: number): Promise<Vault[]> {
    return this.vaultRepository.getVaultsByUserId(userId);
  }
}
