import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { getVaultResourceQueryOptions } from "../schemas/vault";
import userService from "../services/vault";

class VaultController {
  async getVaults(
    request: FastifyRequest<{ Querystring: getVaultResourceQueryOptions }>,
    reply: FastifyReply
  ) {
    const response = await userService.getVaults(request.user.id);

    reply.status(200).send(response);
  }

  async addVault(
    request: FastifyRequest<{ Body: { name: string } }>,
    reply: FastifyReply
  ) {
    const response = await userService.addVault(
      request.body.name,
      request.user.id
    );

    reply.status(200).send(response);
  }

  async updateVault(
    request: FastifyRequest<{
      Params: { id: number };
      Body: { name: string };
    }>,
    reply: FastifyReply
  ) {
    const response = await userService.updateVault(
      request.params.id,
      request.body.name,
      request.user.id
    );

    reply.status(200).send(response);
  }

  async deleteVault(
    request: FastifyRequest<{
      Params: { id: number };
    }>,
    reply: FastifyReply
  ) {
    const response = await userService.deleteVault(
      request.params.id,
      request.user.id
    );

    reply.status(200).send(response);
  }

  // async getVaultsWithPasswords(
  //     request: FastifyRequest<{ Querystring: getVaultResourceQueryOptions }>,
  //     reply: FastifyReply
  // ) {
  //     const response = await userService.getVaultsWithPasswords(
  //         request.user.id,
  //         request.query.vaultId
  //     );

  //     reply.status(200).send(response);
  // }
}

export default new VaultController();
