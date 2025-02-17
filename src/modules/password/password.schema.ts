import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { passwords } from "../../db/schema/schema";
import { responseSchema, statusSchema } from "../../utils/basicSchema";

const encryptedPasswordSchema = z.object({
  iv: z.string().min(1, "iv is required"),
  encrypted: z.string().min(1, "password is required"),
});

const baseSchema = createInsertSchema(passwords, {
  vaultId: (schema) => schema.min(0, "Vault id is required"),
  username: (schema) =>
    schema.min(1, "Username is required").describe("Username for the account"),
  password: (schema) =>
    encryptedPasswordSchema.describe("Password for the account"),
  site: (schema) =>
    schema
      .min(1, "Site is required")
      .describe("Name of the application or website"),
  faviconUrl: (schema) =>
    schema
      .url("invalid url")
      .optional()
      .nullable()
      .describe("URL of the service favicon"),
  note: (schema) =>
    schema.optional().nullable().describe("Additional notes about the account"),
});

export const addPasswordSchema = z.object({
  vaultId: baseSchema.shape.vaultId,
  username: baseSchema.shape.username,
  password: encryptedPasswordSchema,
  site: baseSchema.shape.site,
  faviconUrl: baseSchema.shape.faviconUrl,
  note: baseSchema.shape.note,
});

export type AddPasswordInput = z.infer<typeof addPasswordSchema>;

export const importPasswordsSchema = z.array(addPasswordSchema);

export type ImportPasswordsInput = z.infer<typeof importPasswordsSchema>;

export const updatePasswordSchema = z.object({
  username: baseSchema.shape.username.describe("Username for the account"),
  password: encryptedPasswordSchema.describe("Password for the account"),
  site: baseSchema.shape.site.describe("Name of the application or website"),
  faviconUrl: baseSchema.shape.faviconUrl.describe(
    "URL of the service favicon"
  ),
  note: baseSchema.shape.note.describe("Additional notes about the account"),
});

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

const selectPasswordsModel = createSelectSchema(passwords, {
  id: (schema) => schema.describe("Unique identifier for the password record"),
  userId: (schema) => schema.describe("User id"),
  username: (schema) => schema.describe("Username for the account"),
  password: (schema) =>
    encryptedPasswordSchema.describe("Password for the account"),
  site: (schema) => schema.describe("Name of the application or website"),
  faviconUrl: (schema) => schema.describe("URL of the service favicon"),
  note: (schema) => schema.describe("Additional notes about the account"),
  createdAt: (schema) =>
    schema.describe("Timestamp when the record was created"),
  updatedAt: (schema) =>
    schema.describe("Timestamp when the record was last updated"),
});

export type SelectPasswordsModel = z.infer<typeof selectPasswordsModel>;

export const getPasswordsResponseSchema = z.object({
  status: statusSchema,
  data: z.array(selectPasswordsModel),
});

export const getPasswordsQueryStringSchema = z.object({
  vaultId: z.coerce.number().min(0, "Please provide vaultId"),
  search: z.string().min(1, "provide atleast one character").optional(),
});

export type getPasswordsQueryOptions = z.infer<
  typeof getPasswordsQueryStringSchema
>;

export const getPasswordResponseSchema = z.object({
  status: statusSchema,
  data: selectPasswordsModel,
});

export const addOrUpdateOrDeletePasswordResponseSchema = responseSchema.and(
  z.object({
    data: selectPasswordsModel,
  })
);

export const importPasswordResponseSchema = responseSchema.and(
  z.object({
    data: selectPasswordsModel,
  })
);
