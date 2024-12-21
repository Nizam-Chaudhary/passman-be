import { FastifyReply, FastifyRequest } from "fastify";
import { idParamsSchema } from "../../../utils/basicSchema";
import {
  SignInUserInput,
  signInUserSchema,
  SignUpUserInput,
  signUpUserSchema,
  UpdateUserInput,
  updateUserSchema,
} from "./user.schema";
import userService from "./user.service";

class UserController {
  async signUpUser(
    req: FastifyRequest<{ Body: SignUpUserInput }>,
    reply: FastifyReply
  ) {
    if (req.validationError) {
      signUpUserSchema.parse(req.body);
    }

    const response = await userService.signUpUser(req.body);
    await reply.code(200).send(response);
  }

  async signInUser(
    req: FastifyRequest<{ Body: SignInUserInput }>,
    reply: FastifyReply
  ) {
    if (req.validationError) {
      signInUserSchema.parse(req.body);
    }

    const response = await userService.signInUser(req.body);
    const token = req.jwt.sign(response);

    req.session.set("access_token", token);
    reply.code(200).send({
      status: "success",
      message: "Used signed in successfully",
    });
  }

  async updateUser(
    req: FastifyRequest<{ Body: UpdateUserInput }>,
    reply: FastifyReply
  ) {
    if (req.validationError) {
      idParamsSchema.parse(req.params);
      updateUserSchema.parse(req.body);
    }

    const response = await userService.updateUser(req.user.id, req.body);

    reply.code(200).send(response);
  }

  async logout(req: FastifyRequest, reply: FastifyReply) {
    req.session.delete();

    return reply.status(200).send({
      status: "success",
      message: "logged out successfully",
    });
  }

  async getUser(req: FastifyRequest, reply: FastifyReply) {
    const id = req.user.id;

    const response = await userService.getUser(id);

    reply.code(200).send(response);
  }
}

export default new UserController();
