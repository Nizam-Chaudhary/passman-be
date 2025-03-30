import type { FastifyReply, FastifyRequest } from "fastify";

import type { getVaultResourceQueryOptions } from "../schemas/vaultSchema.js";
import { CreateVaultUseCase } from "../../application/useCases/createVaultUseCase.js";
import { DeleteVaultUseCase } from "../../application/useCases/deleteVaultUseCase.js";
import { GetVaultsForUserUseCase } from "../../application/useCases/getVaultsForUserUseCase.js";
import { UpdateVaultUseCase } from "../../application/useCases/updateVaultUseCase.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class VaultController {
  constructor(
    @inject(GetVaultsForUserUseCase)
    private readonly getVaultsForUserUseCase: GetVaultsForUserUseCase,

    @inject(CreateVaultUseCase)
    private readonly createVaultUseCase: CreateVaultUseCase,

    @inject(UpdateVaultUseCase)
    private readonly updateVaultUseCase: UpdateVaultUseCase,

    @inject(DeleteVaultUseCase)
    private readonly deleteVaultUseCase: DeleteVaultUseCase
  ) {}
  async getVaults(
    request: FastifyRequest<{ Querystring: getVaultResourceQueryOptions }>,
    reply: FastifyReply
  ) {
    const response = await this.getVaultsForUserUseCase.execute(
      request.user.id
    );

    reply.status(200).send(response);
  }

  async addVault(
    request: FastifyRequest<{ Body: { name: string } }>,
    reply: FastifyReply
  ) {
    const vault = {
      userId: request.user.id,
      name: request.body.name,
    };
    const response = await this.createVaultUseCase.execute(vault);

    reply.status(210).send(response);
  }

  async updateVault(
    request: FastifyRequest<{
      Params: { id: number };
      Body: { name: string };
    }>,
    reply: FastifyReply
  ) {
    const response = await this.updateVaultUseCase.execute(
      request.params.id,
      request.user.id,
      request.body.name
    );

    reply.status(200).send(response);
  }

  async deleteVault(
    request: FastifyRequest<{
      Params: { id: number };
    }>,
    reply: FastifyReply
  ) {
    const response = await this.deleteVaultUseCase.execute(
      request.params.id,
      request.user.id
    );

    reply.status(200).send(response);
  }
}
