import { injectable, inject } from "tsyringe";
import { VaultRepository } from "../../domain/repositories/vaultRepository";
import { Vault } from "../../types/vault";

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
