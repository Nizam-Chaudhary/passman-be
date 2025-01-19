import { FastifyInstance } from "fastify";
import healthRoute from "./health";
import passwordRoute from "./password";
import userRoute from "./user";
import vaultRoute from "./vault";

export default async (fastify: FastifyInstance) => {
  fastify.register(healthRoute, { prefix: "health" });
  fastify.register(userRoute, { prefix: "api/v1/users" });
  fastify.register(passwordRoute, { prefix: "api/v1/passwords" });
  fastify.register(vaultRoute, { prefix: "api/v1/vaults" });
};
