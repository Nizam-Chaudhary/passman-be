import { NotFoundError } from "../../../../shared/lib/httpError.js";
import { VaultRepository } from "../../domain/repositories/vaultRepository.js";
import { Vault } from "../../types/vault.js";
import { MESSAGES } from "../../domain/constants/messages.js";
import { injectable, inject } from "tsyringe";

@injectable()
export class UpdateVaultUseCase {
  constructor(
    @inject("VaultRepository")
    private readonly vaultRepository: VaultRepository
  ) {}

  async execute(id: number, userId: number, name: string): Promise<Vault> {
    const vault = await this.vaultRepository.updateVault(id, userId, name);

    if (!vault) {
      throw new NotFoundError(MESSAGES.VAULT_NOT_FOUND);
    }

    return vault;
  }
}
