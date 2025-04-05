import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { idParamsSchema } from "../../../../shared/schemas/requestSchemas";
import { errorResponseSchema } from "../../../../shared/schemas/responseSchemas";

import {
  addUpdateVaultBodySchema,
  addVaultResponseSchema,
  deleteVaultResponseSchema,
  getVaultsResponseSchema,
  updateVaultResponseSchema,
} from "../schemas/vaultSchema";
import { container } from "tsyringe";
import { VaultController } from "../controllers/vault.controller";

export default async (fastify: FastifyInstance) => {
  const vaultController = container.resolve(VaultController);
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      tags: ["Vaults"],
      summary: "Get vaults",
      description: "Get vaults",
      security: [{ jwtAuth: [] }],
      response: {
        "200": getVaultsResponseSchema,
        "4xx": errorResponseSchema,
        "5xx": errorResponseSchema,
      },
    },
    preHandler: [fastify.authenticate],
    handler: vaultController.getVaults,
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      tags: ["Vaults"],
      summary: "Add vault",
      description: "Add vault",
      security: [{ jwtAuth: [] }],
      body: addUpdateVaultBodySchema,
      response: {
        "200": addVaultResponseSchema,
        "4xx": errorResponseSchema,
        "5xx": errorResponseSchema,
      },
    },
    preHandler: [fastify.authenticate],
    handler: vaultController.addVault,
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "PUT",
    url: "/:id",
    schema: {
      tags: ["Vaults"],
      summary: "Update vault",
      description: "Update vault",
      security: [{ jwtAuth: [] }],
      params: idParamsSchema,
      body: addUpdateVaultBodySchema,
      response: {
        "200": updateVaultResponseSchema,
        "4xx": errorResponseSchema,
        "5xx": errorResponseSchema,
      },
    },
    preHandler: [fastify.authenticate],
    handler: vaultController.updateVault,
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/:id",
    schema: {
      tags: ["Vaults"],
      summary: "Add vault",
      description: "Add vault",
      security: [{ jwtAuth: [] }],
      params: idParamsSchema,
      response: {
        "200": deleteVaultResponseSchema,
        "4xx": errorResponseSchema,
        "5xx": errorResponseSchema,
      },
    },
    preHandler: [fastify.authenticate],
    handler: vaultController.deleteVault,
  });
};
