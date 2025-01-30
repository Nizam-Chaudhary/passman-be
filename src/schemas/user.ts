import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "../db/schema/users";
import {
  masterKeySchema,
  responseSchema,
  statusSchema,
} from "../utils/basicSchema";

export const ecryptedValueSchema = z.object({
  iv: z.string().min(1, "iv is required"),
  encrypted: z.string().min(1, "key is required"),
});

const baseSchema = createInsertSchema(users, {
  userName: (schema) =>
    schema.userName
      .min(2, "User name must be at least 4 characters")
      .describe("Username for the account"),
  email: (schema) =>
    schema.email
      .email("Invalid email format")
      .describe("Email address for the account"),
  password: (schema) =>
    schema.password
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
      .refine((value) => /[$@$!%*?&_]/.test(value), {
        message: "Password must contain at least one special character",
      })
      .describe("Password for the account"),
  masterKey: (schema) => ecryptedValueSchema,
  recoveryKey: (schema) => ecryptedValueSchema,
});

// Signup
export const signUpUserSchema = z.object({
  userName: baseSchema.shape.userName,
  email: baseSchema.shape.email,
  password: baseSchema.shape.password,
});

export type SignUpUserInput = z.infer<typeof signUpUserSchema>;

// SignIn
export const signInUserSchema = z.object({
  email: baseSchema.shape.email,
  password: z.string().min(8, "At least 8 characters"),
});

export type SignInUserInput = z.infer<typeof signInUserSchema>;

// Update
export const updateUserSchema = z.object({
  userName: baseSchema.shape.userName,
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

const selectUserModel = createSelectSchema(users)
  .pick({
    id: true,
    userName: true,
    email: true,
    masterKey: true,
    createdAt: true,
    updatedAt: true,
  })
  .describe("User model with selected fields for responses");

export type SelectUserModel = z.infer<typeof selectUserModel>;

export const signUpUserResponseSchema = responseSchema.and(
  z.object({ data: selectUserModel })
);

export const updateUserResponseSchema = signUpUserResponseSchema;

export const getUserResponseSchema = z.object({
  status: statusSchema,
  data: selectUserModel,
});

export const signInResponseSchema = responseSchema.and(
  z.object({
    data: z.object({
      token: z.string().min(1, "token is required"),
      refreshToken: z.string().min(1, "refreshToken is required"),
      id: z.number().min(1, "id is required"),
      email: z.string().email(),
      userName: z.string().min(1, "userName is required"),
      masterKey: masterKeySchema.nullable(),
      isVerified: z.boolean(),
    }),
  })
);

export const refreshTokenBodySchema = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenBody = z.infer<typeof refreshTokenBodySchema>;

export const refreshTokenResponseSchema = responseSchema.and(
  z.object({
    data: z.object({
      token: z.string().min(1, "token is required"),
      refreshToken: z.string().min(1, "refreshToken is required"),
    }),
  })
);

export const verifyUserEmailBodySchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  otp: z.string().length(6, "OTP must be 6 characters long"),
});

export type VerifyUserEmailBody = z.infer<typeof verifyUserEmailBodySchema>;

export const createMasterKeyBodySchema = z.object({
  masterPassword: z
    .string()
    .min(10, "Master password must be at least 10 characters")
    .refine((value) => /[A-Z]/.test(value), {
      message: "Master password must contain at least one uppercase letter",
    })
    .refine((value) => /[a-z]/.test(value), {
      message: "Master password must contain at least one lowercase letter",
    })
    .refine((value) => /\d/.test(value), {
      message: "Master password must contain at least one number",
    })
    .refine((value) => /[$@$!%*?&_]/.test(value), {
      message: "Master password must contain at least one special character",
    })
    .describe("Master password for the account"),
  masterKey: masterKeySchema,
  recoveryKey: masterKeySchema,
});

export type CreateMasterKeyBody = z.infer<typeof createMasterKeyBodySchema>;

export type JwtUserData = {
  id: number;
  userName: string;
  email: string;
  masterKeyCreated: boolean;
  exp: number;
  iat: number;
};

export const verifyMasterPasswordBodySchema = z.object({
  masterPassword: z.string().min(1, "Master password is required"),
});

export type VerifyMasterPasswordBody = z.infer<
  typeof verifyMasterPasswordBodySchema
>;

export const verifyMasterPasswordResponseSchema = z.object({
  status: z.literal("success"),
  data: z.object({ masterKey: masterKeySchema }),
});
