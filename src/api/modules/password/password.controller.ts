import { FastifyReply, FastifyRequest } from "fastify";
import { idParamsSchema, IdParamsType } from "../../../utils/basicSchema";
import {
  AddPasswordInput,
  addPasswordSchema,
  ImportPasswordsInput,
  importPasswordsSchema,
} from "./password.schema";
import passwordService from "./password.service";

class PasswordController {
  async addPassword(
    req: FastifyRequest<{ Body: AddPasswordInput }>,
    reply: FastifyReply
  ) {
    if (req.validationError) {
      addPasswordSchema.parse(req.body);
    }

    const response = await passwordService.addPassword(
      req.user.id,
      req.body,
      req.user.encryptionKey
    );

    reply.code(201).send(response);
  }

  async getPasswords(req: FastifyRequest, reply: FastifyReply) {
    const response = await passwordService.getPasswords(
      req.user.id,
      req.user.encryptionKey
    );
    reply.code(200).send(response);
  }

  async getPassword(
    req: FastifyRequest<{ Params: IdParamsType }>,
    reply: FastifyReply
  ) {
    if (req.validationError) {
      idParamsSchema.parse(req.params);
    }
    const response = await passwordService.getPassword(
      req.user.id,
      req.user.encryptionKey,
      req.params.id
    );
    reply.code(200).send(response);
  }

  async updatePassword(
    req: FastifyRequest<{ Body: AddPasswordInput; Params: IdParamsType }>,
    reply: FastifyReply
  ) {
    const params = idParamsSchema.parse(req.params);
    const body = addPasswordSchema.parse(req.body);

    const response = await passwordService.updatePassword(
      params.id,
      body,
      req.user.id,
      req.user.encryptionKey
    );

    reply.code(201).send(response);
  }

  async deletePassword(
    req: FastifyRequest<{ Params: IdParamsType }>,
    reply: FastifyReply
  ) {
    const params = idParamsSchema.parse(req.params);

    const response = await passwordService.deletePassword(
      params.id,
      req.user.id
    );

    reply.code(201).send(response);
  }

  async importPasswords(
    req: FastifyRequest<{ Body: ImportPasswordsInput }>,
    reply: FastifyReply
  ) {
    const body = importPasswordsSchema.parse(req.body);

    const response = await passwordService.importPasswords(
      req.user.id,
      body,
      req.user.encryptionKey
    );

    reply.code(201).send(response);
  }
}

export default new PasswordController();
