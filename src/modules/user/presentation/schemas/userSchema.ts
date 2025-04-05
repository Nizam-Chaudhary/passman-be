import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

import { users } from "../../../../db/schema/schema";
import {
  responseSchema,
  statusSchema,
} from "../../../../shared/schemas/responseSchemas";
import { selectFileSchema } from "../../../file/file.schema";

export const masterKeySchema = z
  .object({
    iv: z.string().min(1, "iv is required"),
    encrypted: z.string().min(1, "key is required"),
    salt: z.string().min(1, "salt is required"),
  })
  .describe("Schema for master key with iv, encrypted key and salt");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .refine((value) => /[A-Z]/.test(value), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((value) => /[a-z]/.test(value), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((value) => /\d/.test(value), {
    message: "Password must contain at least one number",
  })
  .refine((value) => /[$@!%*?&_]/.test(value), {
    message: "Password must contain at least one special character",
  })
  .describe("Password for the account");

const insertBaseSchema = createInsertSchema(users, {
  userName: (schema) =>
    schema
      .min(2, "User name must be at least 4 characters")
      .describe("Username for the account"),
  email: (schema) =>
    schema
      .email("Invalid email format")
      .describe("Email address for the account"),
  password: passwordSchema,
  masterKey: () => masterKeySchema,
  recoveryKey: () => masterKeySchema,
});

// Signup
export const createUserSchema = z
  .object({
    userName: insertBaseSchema.shape.userName,
    email: insertBaseSchema.shape.email,
    password: insertBaseSchema.shape.password,
  })
  .describe("Schema for user signup data");

const updateBaseSchema = createUpdateSchema(users, {
  userName: (schema) =>
    schema
      .min(2, "User name must be at least 4 characters")
      .describe("Username for the account"),
  fileId: (schema) =>
    schema
      .min(1, "File ID must be at least 1")
      .describe("ID of the associated file"),
});

// Update
export const updateUserSchema = z
  .object({
    userName: updateBaseSchema.shape.userName,
    fileId: updateBaseSchema.shape.fileId,
  })
  .describe("Schema for updating user information");

const selectUserBaseSchema = createSelectSchema(users);

export const userResponseDataSchema = selectUserBaseSchema
  .pick({
    id: true,
    userName: true,
    email: true,
    masterKey: true,
    recoveryKey: true,
    createdAt: true,
    updatedAt: true,
  })
  .describe("User model with selected fields for responses");

export const updateUserResponseSchema = responseSchema
  .and(z.object({ data: userResponseDataSchema }))
  .describe("Schema for user update response");

export const getUserDataSchema = userResponseDataSchema.and(
  z.object({
    file: selectFileSchema.nullable(),
  })
);

export const getUserResponseSchema = z
  .object({
    status: statusSchema,
    data: getUserDataSchema,
  })
  .describe("Schema for getting user data response");

export const signUpUserResponseSchema = responseSchema
  .and(z.object({ data: userResponseDataSchema }))
  .describe("Response schema for successful signup");
