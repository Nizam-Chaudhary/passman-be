import { FastifyInstance } from "fastify";
import authRoute from "./modules/auth/auth.route";
import healthRoute from "./modules/health/health.route";
import passwordRoute from "./modules/password/password.route";
import userRoute from "./modules/user/user.route";
import vaultRoute from "./modules/vault/vault.route";

export default async (fastify: FastifyInstance) => {
  fastify.register(healthRoute, { prefix: "health" });
  fastify.register(authRoute, { prefix: "api/v1/auth" });
  fastify.register(userRoute, { prefix: "api/v1/users" });
  fastify.register(passwordRoute, { prefix: "api/v1/passwords" });
  fastify.register(vaultRoute, { prefix: "api/v1/vaults" });
};
