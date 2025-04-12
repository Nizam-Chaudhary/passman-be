import type { FastifyReply, FastifyRequest } from "fastify";

import { RESPONSE_STATUS } from "src/shared/lib/constants";
import { injectable } from "tsyringe";
import { CreateUserUseCase } from "../../application/useCases/createUserUseCase";
import { GetUserByIdUserUseCase } from "../../application/useCases/getUserByIdUseCase";
import { UpdateUserByIdUseCase } from "../../application/useCases/updateUserUseCase";
import { MESSAGES } from "../../domain/constants/messages";
import { CreateUser, UpdateUser } from "../../types/user";

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
    const data = await this.createUserUseCase.execute(req.body);
    const response = {
      status: RESPONSE_STATUS.SUCCESS,
      message: MESSAGES.USER_REGISTERED_SUCCESSFULLY,
      data,
    };
    await reply.code(200).send(response);
  }

  async updateUser(
    req: FastifyRequest<{ Body: UpdateUser }>,
    reply: FastifyReply
  ) {
    const data = await this.updateUserUseCase.execute(req.user.id, req.body);

    const response = {
      status: RESPONSE_STATUS.SUCCESS,
      message: MESSAGES.USER_UPDATED_SUCCESSFULLY,
      data,
    };

    reply.code(200).send(response);
  }

  async getUser(req: FastifyRequest, reply: FastifyReply) {
    const id = req.user.id;

    const response = await this.getUserUseCase.execute(id);

    reply.code(200).send(response);
  }
}
