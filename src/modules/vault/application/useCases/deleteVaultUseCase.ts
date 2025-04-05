import { NotFoundError } from "../../../../shared/lib/httpError";
import { VaultRepository } from "../../domain/repositories/vaultRepository";
import { Vault } from "../../types/vault";
import { MESSAGES } from "../../domain/constants/messages";
import { inject, injectable } from "tsyringe";

@injectable()
export class DeleteVaultUseCase {
  constructor(
    @inject("VaultRepository")
    private readonly vaultRepository: VaultRepository
  ) {}

  async execute(id: number, userId: number): Promise<Vault> {
    const vault = await this.vaultRepository.deleteVault(id, userId);

    if (!vault) {
      throw new NotFoundError(MESSAGES.VAULT_NOT_FOUND);
    }

    return vault;
  }
}
