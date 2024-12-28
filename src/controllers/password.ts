import { FastifyReply, FastifyRequest } from "fastify";
import { AddPasswordInput, ImportPasswordsInput } from "../schemas/password";
import passwordService from "../services/password";
import { IdParamsType } from "../utils/basicSchema";

class PasswordController {
    async addPassword(
        req: FastifyRequest<{ Body: AddPasswordInput }>,
        reply: FastifyReply
    ) {
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
        const response = await passwordService.updatePassword(
            req.params.id,
            req.body,
            req.user.id,
            req.user.encryptionKey
        );

        reply.code(201).send(response);
    }

    async deletePassword(
        req: FastifyRequest<{ Params: IdParamsType }>,
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
            req.body,
            req.user.encryptionKey
        );

        reply.code(201).send(response);
    }
}

export default new PasswordController();
