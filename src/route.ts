import type { FastifyInstance } from "fastify";

import authRoute from "./modules/auth/auth.route.js";
import fileRoute from "./modules/file/file.route.js";
import healthRoute from "./modules/health/health.route.js";
import passwordRoute from "./modules/password/password.route.js";
import userRoute from "./modules/user/user.route.js";
import vaultRoute from "./modules/vault/vault.route.js";

export default (fastify: FastifyInstance) => {
  fastify.register(authRoute, { prefix: "api/v1/auth" });
  fastify.register(fileRoute, { prefix: "api/v1/files" });
  fastify.register(healthRoute, { prefix: "health" });
  fastify.register(passwordRoute, { prefix: "api/v1/passwords" });
  fastify.register(userRoute, { prefix: "api/v1/users" });
  fastify.register(vaultRoute, { prefix: "api/v1/vaults" });
};
