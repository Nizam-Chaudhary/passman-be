import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { passwords } from "../db/schema/password";
import { responseSchema, statusSchema } from "../utils/basicSchema";

const baseSchema = createInsertSchema(passwords, {
    username: (schema) =>
        schema.username
            .optional()
            .nullable()
            .describe("Username for the account"),
    email: (schema) =>
        schema.email
            .email("invalid email")
            .optional()
            .nullable()
            .describe("Email address for the account"),
    password: (schema) =>
        schema.password
            .min(1, "Password cannot be empty")
            .describe("Password for the account"),
    appName: (schema) =>
        schema.appName
            .optional()
            .nullable()
            .describe("Name of the application or service"),
    baseUrl: (schema) =>
        schema.baseUrl
            .url("invalid url")
            .optional()
            .nullable()
            .describe("Base URL of the service"),
    specificUrl: (schema) =>
        schema.specificUrl
            .url("invalid url")
            .optional()
            .nullable()
            .describe("Specific login URL for the service"),
    faviconUrl: (schema) =>
        schema.specificUrl
            .url("invalid url")
            .optional()
            .nullable()
            .describe("URL of the service favicon"),
    notes: (schema) =>
        schema.notes
            .optional()
            .nullable()
            .describe("Additional notes about the account"),
});

export const addPasswordSchema = z
    .object({
        username: baseSchema.shape.username,
        email: baseSchema.shape.email,
        iv: baseSchema.shape.iv,
        password: baseSchema.shape.password,
        appName: baseSchema.shape.appName,
        baseUrl: baseSchema.shape.baseUrl,
        specificUrl: baseSchema.shape.specificUrl,
        faviconUrl: baseSchema.shape.faviconUrl,
        notes: baseSchema.shape.notes,
    })
    .refine((data) => data.username != null || data.email != null, {
        message: "Either username or email must be provided",
    });

export type AddPasswordInput = z.infer<typeof addPasswordSchema>;

export const importPasswordsSchema = z.array(addPasswordSchema);

export type ImportPasswordsInput = z.infer<typeof importPasswordsSchema>;

export const updatePasswordSchema = z.object({
    username: baseSchema.shape.username.describe("Username for the account"),
    email: baseSchema.shape.email.describe("Email address for the account"),
    password: baseSchema.shape.password
        .min(1, "Password cannot be empty")
        .optional()
        .describe("Password for the account"),
    appName: baseSchema.shape.appName.describe(
        "Name of the application or service"
    ),
    baseUrl: baseSchema.shape.baseUrl.describe("Base URL of the service"),
    specificUrl: baseSchema.shape.specificUrl.describe(
        "Specific login URL for the service"
    ),
    faviconUrl: baseSchema.shape.faviconUrl.describe(
        "URL of the service favicon"
    ),
    notes: baseSchema.shape.notes.describe(
        "Additional notes about the account"
    ),
});

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

const selectPasswordsModel = createSelectSchema(passwords, {
    id: (schema) =>
        schema.id.describe("Unique identifier for the password record"),
    userId: (schema) => schema.userId.describe("User id"),
    username: (schema) => schema.username.describe("Username for the account"),
    email: (schema) => schema.email.describe("Email address for the account"),
    password: (schema) => schema.password.describe("Password for the account"),
    appName: (schema) =>
        schema.appName.describe("Name of the application or service"),
    baseUrl: (schema) => schema.baseUrl.describe("Base URL of the service"),
    specificUrl: (schema) =>
        schema.specificUrl.describe("Specific login URL for the service"),
    faviconUrl: (schema) =>
        schema.faviconUrl.describe("URL of the service favicon"),
    notes: (schema) =>
        schema.notes.describe("Additional notes about the account"),
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
