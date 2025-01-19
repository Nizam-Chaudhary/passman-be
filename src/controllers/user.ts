import { FastifyReply, FastifyRequest } from "fastify";
import AppError from "../lib/appError";
import {
  RefreshTokenBodySchema,
  SignInUserInput,
  SignUpUserInput,
  UpdateUserInput,
} from "../schemas/user";
import userService from "../services/user";

class UserController {
  async signUpUser(
    req: FastifyRequest<{ Body: SignUpUserInput }>,
    reply: FastifyReply
  ) {
    const response = await userService.signUpUser(req.body);
    await reply.code(200).send(response);
  }

  async signInUser(
    req: FastifyRequest<{ Body: SignInUserInput }>,
    reply: FastifyReply
  ) {
    const response = await userService.signInUser(req.body);
    const token = req.jwt.sign(response, { expiresIn: "7d" });
    const refreshToken = req.jwt.sign(response, { expiresIn: "180d" });

    reply.code(200).send({
      status: "success",
      message: "Used signed in successfully",
      data: {
        token,
        refresh_token: refreshToken,
      },
    });
  }

  async refreshToken(
    req: FastifyRequest<{ Body: RefreshTokenBodySchema }>,
    reply: FastifyReply
  ) {
    const userData = req.jwt.verify(req.body.refresh_token);

    if (!userData) {
      throw new AppError("UNAUTORIZED", "Refresh token is invalid", 401);
    }

    const token = req.jwt.sign(userData, { expiresIn: "7d" });
    const refreshToken = req.jwt.sign(userData, { expiresIn: "180d" });

    reply.code(200).send({
      status: "success",
      message: "Used signed in successfully",
      data: {
        token,
        refresh_token: refreshToken,
      },
    });
  }

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
