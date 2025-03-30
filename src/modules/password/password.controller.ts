import type { FastifyReply, FastifyRequest } from "fastify";

import type { IdParams } from "../../shared/schemas/requestSchemas.js";
import type {
  AddPasswordInput,
  getPasswordsQueryOptions,
  ImportPasswordsInput,
} from "./password.schema.js";

import passwordService from "./password.service.js";

class PasswordController {
  async addPassword(
    req: FastifyRequest<{ Body: AddPasswordInput }>,
    reply: FastifyReply
  ) {
    const response = await passwordService.addPassword(req.user.id, req.body);

    reply.code(201).send(response);
  }

  async getPasswords(
    req: FastifyRequest<{ Querystring: getPasswordsQueryOptions }>,
    reply: FastifyReply
  ) {
    const { search, vaultId } = req.query;
    const response = await passwordService.getPasswords(
      req.user.id,
      vaultId,
      search
    );
    reply.code(200).send(response);
  }

  async getPasswordById(
    req: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply
  ) {
    const response = await passwordService.getPassword(
      req.user.id,
      req.params.id
    );
    reply.code(200).send(response);
  }

  async updatePassword(
    req: FastifyRequest<{ Body: AddPasswordInput; Params: IdParams }>,
    reply: FastifyReply
  ) {
    const response = await passwordService.updatePassword(
      req.params.id,
      req.body,
      req.user.id
    );

    reply.code(201).send(response);
  }

  async deletePassword(
    req: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply
  ) {
    const response = await passwordService.deletePassword(
      req.params.id,
      req.user.id
    );

    reply.code(201).send(response);
  }

  async importPasswords(
    req: FastifyRequest<{ Body: ImportPasswordsInput }>,
    reply: FastifyReply
  ) {
    const response = await passwordService.importPasswords(
      req.user.id,
      req.body
    );

    reply.code(201).send(response);
  }
}

export default new PasswordController();
