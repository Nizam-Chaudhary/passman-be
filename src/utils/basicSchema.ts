import { z } from "zod";

export const statusSchema = z.enum(["success", "fail", "error"]);

export const responseSchema = z.object({
  status: statusSchema,
  message: z.string(),
});

export const idParamsSchema = z.object({
  id: z.coerce.number().min(1),
});

export const errorSchema = z.union([
  z.object({
    status: statusSchema.default("error"),
    message: z.string().default("something went wrong"),
    issues: z.any().optional().nullable().default(null),
  }),
  z.object({
    status: statusSchema.default("error"),
    message: z.string().default("something went wrong"),
    stack: z.string().optional().nullable(),
  }),
  z.object({
    status: statusSchema.default("error"),
    message: z.string().default("something went wrong"),
  }),
]);

type errorSchema = z.infer<typeof errorSchema>;

export type IdParamsType = z.infer<typeof idParamsSchema>;

export const encryptedValueSchema = z.object({
  iv: z.string().min(1, "iv is required"),
  encrypted: z.string().min(1, "key is required"),
});

export type EncryptedValueType = z.infer<typeof encryptedValueSchema>;

export const masterKeySchema = z.object({
  iv: z.string().min(1, "iv is required"),
  encrypted: z.string().min(1, "key is required"),
  salt: z.string().min(1, "salt is required"),
});

export type MasterKeyType = z.infer<typeof masterKeySchema>;
