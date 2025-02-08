import { FastifyReply, FastifyRequest } from "fastify";
import AppError from "../lib/appError";
import {
  CreateMasterKeyBody,
  JwtUserData,
  RefreshTokenBody,
  SignInUserInput,
  SignUpUserInput,
  VerifyMasterPasswordBody,
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
    const tokenPayload = req.jwt.verify<JwtUserData>(refresh_token);

    if (!tokenPayload) {
      throw new AppError("UNAUTORIZED", "Refresh token is invalid", 401);
    }

    const userData = await userService.refreshToken(tokenPayload.id);

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

  async createMasterKey(
    req: FastifyRequest<{ Body: CreateMasterKeyBody }>,
    reply: FastifyReply
  ) {
    const id = req.user.id;

    const response = await userService.createMasterKey(id, req.body);

    reply.code(200).send(response);
  }

  async verifyMasterPassword(
    req: FastifyRequest<{ Body: VerifyMasterPasswordBody }>,
    reply: FastifyReply
  ) {
    const id = req.user.id;

    const response = await userService.verifyMasterPassword(id, req.body);

    reply.code(200).send(response);
  }
}

export default new UserController();
