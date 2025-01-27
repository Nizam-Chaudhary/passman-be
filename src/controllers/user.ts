import { FastifyReply, FastifyRequest } from "fastify";
import AppError from "../lib/appError";
import {
  RefreshTokenBody,
  SignInUserInput,
  SignUpUserInput,
  UpdateUserInput,
  VerifyUserEmailBody,
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
    const userData = await userService.signInUser(req.body);
    const tokenPayload = {
      id: userData.id,
      email: userData.email,
      userName: userData.userName,
      masterKeyCreated: !!userData.masterKey,
    };
    const token = req.jwt.sign(tokenPayload, { expiresIn: "15m" });
    const refreshToken = req.jwt.sign(tokenPayload, { expiresIn: "90d" });

    reply.code(200).send({
      status: "success",
      message: "User signed in successfully",
      data: {
        token,
        refreshToken,
        ...userData,
      },
    });
  }

  async refreshToken(
    req: FastifyRequest<{ Body: RefreshTokenBody }>,
    reply: FastifyReply
  ) {
    const refresh_token = req.body.refreshToken;
    const userData = req.jwt.verify(refresh_token);

    if (!userData) {
      throw new AppError("UNAUTORIZED", "Refresh token is invalid", 401);
    }

    const token = req.jwt.sign(userData, { expiresIn: "15m" });
    const refreshToken = req.jwt.sign(userData, { expiresIn: "90d" });

    reply.code(200).send({
      status: "success",
      message: "Token refreshed successfully",
      data: {
        token,
        refreshToken,
      },
    });
  }

  async verifyUserEmail(
    req: FastifyRequest<{ Body: VerifyUserEmailBody }>,
    reply: FastifyReply
  ) {
    const response = await userService.verifyUserEmail(req.body);
    reply.code(200).send(response);
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
