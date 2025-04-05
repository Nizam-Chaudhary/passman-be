import type { FastifyReply, FastifyRequest } from "fastify";

import type { getVaultResourceQueryOptions } from "../schemas/vaultSchema";
import { CreateVaultUseCase } from "../../application/useCases/createVaultUseCase";
import { DeleteVaultUseCase } from "../../application/useCases/deleteVaultUseCase";
import { GetVaultsForUserUseCase } from "../../application/useCases/getVaultsForUserUseCase";
import { UpdateVaultUseCase } from "../../application/useCases/updateVaultUseCase";
import { injectable } from "tsyringe";

@injectable()
export class VaultController {
  constructor(
    private readonly getVaultsForUserUseCase: GetVaultsForUserUseCase,

    private readonly createVaultUseCase: CreateVaultUseCase,

    private readonly updateVaultUseCase: UpdateVaultUseCase,

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
