import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateUserInput } from "../schemas/user";
import userService from "../services/user";

class UserController {
  async updateUser(
    req: FastifyRequest<{ Body: UpdateUserInput }>,
    reply: FastifyReply
  ) {
    const response = await userService.updateUser(req.user.id, req.body);

    reply.code(200).send(response);
  }

  async getUser(req: FastifyRequest, reply: FastifyReply) {
    const id = req.user.id;

    const response = await userService.getUser(id);

    reply.code(200).send(response);
  }
}

export default new UserController();
