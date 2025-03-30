import { NotFoundError } from "../../../../shared/lib/httpError.js";
import { VaultRepository } from "../../domain/repositories/vaultRepository.js";
import { Vault } from "../../types/vault.js";
import { MESSAGES } from "../../domain/constants/messages.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class DeleteVaultUseCase {
  constructor(
    @inject("VaultRepository")
    private readonly vaultRepository: VaultRepository
  ) {
    console.log("DeleteVaultUseCase initialized");
  }

  async execute(id: number, userId: number): Promise<Vault> {
    const vault = await this.vaultRepository.deleteVault(id, userId);

    if (!vault) {
      throw new NotFoundError(MESSAGES.VAULT_NOT_FOUND);
    }

    return vault;
  }
}
