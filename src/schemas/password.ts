import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { passwords } from "../db/schema/password";
import { responseSchema, statusSchema } from "../utils/basicSchema";

const encryptedPasswordSchema = z.object({
    iv: z.string().min(1, "iv is required"),
    encrypted: z.string().min(1, "password is required"),
});

const baseSchema = createInsertSchema(passwords, {
    username: (schema) =>
        schema.username
            .min(1, "Username is required")
            .describe("Username for the account"),
    password: (schema) =>
        encryptedPasswordSchema.describe("Password for the account"),
    site: (schema) =>
        schema.site
            .min(1, "Site is required")
            .describe("Name of the application or website"),
    faviconUrl: (schema) =>
        schema.faviconUrl
            .url("invalid url")
            .optional()
            .nullable()
            .describe("URL of the service favicon"),
    note: (schema) =>
        schema.note
            .optional()
            .nullable()
            .describe("Additional notes about the account"),
});

export const addPasswordSchema = z.object({
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
    id: (schema) =>
        schema.id.describe("Unique identifier for the password record"),
    userId: (schema) => schema.userId.describe("User id"),
    username: (schema) => schema.username.describe("Username for the account"),
    password: (schema) =>
        encryptedPasswordSchema.describe("Password for the account"),
    site: (schema) =>
        schema.site.describe("Name of the application or website"),
    faviconUrl: (schema) =>
        schema.faviconUrl.describe("URL of the service favicon"),
    note: (schema) =>
        schema.note.describe("Additional notes about the account"),
    createdAt: (schema) =>
        schema.createdAt.describe("Timestamp when the record was created"),
    updatedAt: (schema) =>
        schema.updatedAt.describe("Timestamp when the record was last updated"),
});

export type SelectPasswordsModel = z.infer<typeof selectPasswordsModel>;

export const getPasswordsResponseSchema = z.object({
    status: statusSchema,
    data: z.array(selectPasswordsModel),
});

export const getPasswordsQueryStringSchema = z.object({
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
