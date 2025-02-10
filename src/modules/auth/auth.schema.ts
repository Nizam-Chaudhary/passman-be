import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "../../db/schema/users";
import { masterKeySchema, responseSchema } from "../../utils/basicSchema";

export const ecryptedValueSchema = z.object({
  iv: z.string().min(1, "iv is required"),
  encrypted: z.string().min(1, "key is required"),
});

const passwordSchema = z
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
  .refine((value) => /[$@$!%*?&_]/.test(value), {
    message: "Password must contain at least one special character",
  })
  .describe("Password for the account");

const baseSchema = createInsertSchema(users, {
  userName: (schema) =>
    schema.userName
      .min(2, "User name must be at least 4 characters")
      .describe("Username for the account"),
  email: (schema) =>
    schema.email
      .email("Invalid email format")
      .describe("Email address for the account"),
  password: passwordSchema,
  masterKey: () => ecryptedValueSchema,
  recoveryKey: () => ecryptedValueSchema,
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

const selectUserModel = createSelectSchema(users, {
  masterKey: () => masterKeySchema,
})
  .pick({
    id: true,
    userName: true,
    email: true,
    masterKey: true,
    createdAt: true,
    updatedAt: true,
  })
  .describe("User model with selected fields for responses");

export const signUpUserResponseSchema = responseSchema.and(
  z.object({ data: selectUserModel })
);

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

const masterPasswordSchema = z
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
  .describe("Master password for the account");

export const createMasterKeyBodySchema = z.object({
  masterPassword: masterPasswordSchema,
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

export const resendOtpBodySchema = z.object({
  email: z.string().email("Please provide valid email"),
});

export const sendResetPasswordEmailBodySchema = resendOtpBodySchema;

export type ResetPasswordJwtTokenPayload = {
  email: string;
  exp: number;
  iat: number;
};

export const resetPasswordBodySchema = z.object({
  token: z.string().jwt(),
  password: passwordSchema,
});

export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>;

export const updateMasterPasswordBodySchema = z.object({
  masterPassword: masterPasswordSchema,
  masterKey: masterKeySchema,
  recoveryKey: masterKeySchema,
});

export type UpdateMasterPasswordBody = z.infer<
  typeof updateMasterPasswordBodySchema
>;
