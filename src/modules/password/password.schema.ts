import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { passwords } from "../../db/schema/schema";
import { responseSchema, statusSchema } from "../../utils/basicSchema";

const encryptedPasswordSchema = z
  .object({
    iv: z
      .string()
      .min(1, "iv is required")
      .describe("Initialization vector for encryption"),
    encrypted: z
      .string()
      .min(1, "password is required")
      .describe("Encrypted password string"),
  })
  .describe("Schema for encrypted password data");

const baseSchema = createInsertSchema(passwords, {
  vaultId: (schema) =>
    schema
      .min(0, "Vault id is required")
      .describe("ID of the vault this password belongs to"),
  username: (schema) =>
    schema.min(1, "Username is required").describe("Username for the account"),
  password: () => encryptedPasswordSchema.describe("Password for the account"),
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
}).describe("Base schema for password records");

export const addPasswordSchema = z
  .object({
    vaultId: baseSchema.shape.vaultId,
    username: baseSchema.shape.username,
    password: encryptedPasswordSchema,
    site: baseSchema.shape.site,
    faviconUrl: baseSchema.shape.faviconUrl,
    note: baseSchema.shape.note,
  })
  .describe("Schema for adding a new password");

export type AddPasswordInput = z.infer<typeof addPasswordSchema>;

export const importPasswordsSchema = z
  .array(addPasswordSchema)
  .describe("Schema for importing multiple passwords");

export type ImportPasswordsInput = z.infer<typeof importPasswordsSchema>;

export const updatePasswordSchema = z
  .object({
    username: baseSchema.shape.username.describe("Username for the account"),
    password: encryptedPasswordSchema.describe("Password for the account"),
    site: baseSchema.shape.site.describe("Name of the application or website"),
    faviconUrl: baseSchema.shape.faviconUrl.describe(
      "URL of the service favicon"
    ),
    note: baseSchema.shape.note.describe("Additional notes about the account"),
  })
  .describe("Schema for updating an existing password");

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

const selectPasswordsModel = createSelectSchema(passwords, {
  id: (schema) => schema.describe("Unique identifier for the password record"),
  userId: (schema) => schema.describe("User id"),
  username: (schema) => schema.describe("Username for the account"),
  password: () => encryptedPasswordSchema.describe("Password for the account"),
  site: (schema) => schema.describe("Name of the application or website"),
  faviconUrl: (schema) => schema.describe("URL of the service favicon"),
  note: (schema) => schema.describe("Additional notes about the account"),
  createdAt: (schema) =>
    schema.describe("Timestamp when the record was created"),
  updatedAt: (schema) =>
    schema.describe("Timestamp when the record was last updated"),
}).describe("Schema for selecting password records");

export type SelectPasswordsModel = z.infer<typeof selectPasswordsModel>;

export const getPasswordsResponseSchema = z
  .object({
    status: statusSchema,
    data: z.array(selectPasswordsModel),
  })
  .describe("Schema for get passwords response");

export const getPasswordsQueryStringSchema = z
  .object({
    vaultId: z.coerce
      .number()
      .min(0, "Please provide vaultId")
      .describe("ID of the vault to fetch passwords from"),
    search: z
      .string()
      .min(1, "provide atleast one character")
      .optional()
      .describe("Search string to filter passwords"),
  })
  .describe("Schema for password query parameters");

export type getPasswordsQueryOptions = z.infer<
  typeof getPasswordsQueryStringSchema
>;

export const getPasswordResponseSchema = z
  .object({
    status: statusSchema,
    data: selectPasswordsModel,
  })
  .describe("Schema for single password response");

export const addOrUpdateOrDeletePasswordResponseSchema = responseSchema
  .and(
    z.object({
      data: selectPasswordsModel,
    })
  )
  .describe("Schema for add/update/delete password response");

export const importPasswordResponseSchema = responseSchema
  .and(
    z.object({
      data: selectPasswordsModel,
    })
  )
  .describe("Schema for import password response");
