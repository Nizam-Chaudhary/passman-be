import type { FastifyJWT } from "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";

import fastifyPlugin from "fastify-plugin";
import { UnauthorizedError } from "../shared/lib/httpError";

export default fastifyPlugin((fastify, _opts, done) => {
  fastify.decorate(
    "authenticate",
    async (req: FastifyRequest, _reply: FastifyReply) => {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        throw new UnauthorizedError("please provide access token");
      }

      try {
        const decoded = req.jwt.verify<FastifyJWT["user"]>(token);
        req.user = decoded;
        // biome-ignore lint/suspicious/noExplicitAny: error
      } catch (error: any) {
        if (error.code === "FAST_JWT_EXPIRED") {
          throw new UnauthorizedError("Access token expired");
          // biome-ignore lint/style/noUselessElse: better explanation
        } else if (error.code === "FAST_JWT_INVALID_SIGNATURE") {
          throw new UnauthorizedError("access token has invalid signature");
        }
        throw new UnauthorizedError("Unauthorized...");
      }
    }
  );

  done();
});
