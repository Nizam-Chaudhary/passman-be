import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { vaults } from "../db/schema/schema";
import { statusSchema } from "../utils/basicSchema";

export const selectVaultsSchema = createSelectSchema(vaults);

export const getVaultsResponseSchema = z.object({
    status: statusSchema,
    data: z.array(selectVaultsSchema),
});

export const addUpdateVaultBodySchema = z.object({
    name: z.string().min(1, "Vault name is required"),
});

export const addVaultResponseSchema = z.object({
    status: z.literal("success"),
    message: z.literal("Vault created successfully"),
    data: selectVaultsSchema,
});

export const updateVaultResponseSchema = z.object({
    status: z.literal("success"),
    message: z.literal("Vault updated successfully"),
    data: selectVaultsSchema,
});

export const deleteVaultResponseSchema = z.object({
    status: z.literal("success"),
    message: z.literal("Vault deleted successfully"),
    data: selectVaultsSchema,
});

export const getVaultWithResourceQuerySchema = z.object({
    vaultId: z.coerce.number().min(0, "vaultId cannot be empty").optional(),
});

export type getVaultResourceQueryOptions = z.infer<
    typeof getVaultWithResourceQuerySchema
>;
