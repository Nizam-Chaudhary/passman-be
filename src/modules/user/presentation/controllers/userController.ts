import type { FastifyReply, FastifyRequest } from "fastify";

import { CreateUser, UpdateUser } from "../../types/user.js";
import { CreateUserUseCase } from "../../application/useCases/createUserUseCase.js";
import { UpdateUserByIdUseCase } from "../../application/useCases/updateUserUseCase.js";
import { GetUserByIdUserUseCase } from "../../application/useCases/getUserByIdUseCase.js";
import { injectable } from "tsyringe";

@injectable()
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserByIdUseCase,
    private readonly getUserUseCase: GetUserByIdUserUseCase
  ) {
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  async createUser(
    req: FastifyRequest<{ Body: CreateUser }>,
    reply: FastifyReply
  ) {
    const response = await this.createUserUseCase.execute(req.body);
    await reply.code(200).send(response);
  }

  async updateUser(
    req: FastifyRequest<{ Body: UpdateUser }>,
    reply: FastifyReply
  ) {
    const response = await this.updateUserUseCase.execute(
      req.user.id,
      req.body
    );

    reply.code(200).send(response);
  }

  async getUser(req: FastifyRequest, reply: FastifyReply) {
    const id = req.user.id;

    const response = await this.getUserUseCase.execute(id);

    reply.code(200).send(response);
  }
}
