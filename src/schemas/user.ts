import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "../db/schema/user";
import { responseSchema, statusSchema } from "../utils/basicSchema";

export const masterKeySchema = z.object({
    iv: z.string().min(1, "iv is required"),
    encrypted: z.string().min(1, "key is required"),
});

export type Masterkey = z.infer<typeof masterKeySchema>;

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
            .min(10, "Password must be at least 10 characters long")
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
    masterKey: (schema) => masterKeySchema,
    recoveryMasterKey: (schema) => masterKeySchema,
});

// Signup
export const signUpUserSchema = z.object({
    userName: baseSchema.shape.userName,
    email: baseSchema.shape.email,
    password: baseSchema.shape.password,
    masterKey: baseSchema.shape.masterKey,
    recoveryMasterKey: baseSchema.shape.recoveryMasterKey,
});

export type SignUpUserInput = z.infer<typeof signUpUserSchema>;

// SignIn
export const signInUserSchema = z.object({
    email: baseSchema.shape.email,
    password: baseSchema.shape.password,
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

export const signInResponseSchema = z
    .object({
        data: z.object({
            token: z.string().min(1, "token is required"),
            refresh_token: z.string().min(1, "refresh token is required"),
        }),
    })
    .and(responseSchema);

export const refreshTokenBodySchema = z.object({
    refresh_token: z.string().min(1, "Refresh token is required"),
});

export type RefreshTokenBodySchema = z.infer<typeof refreshTokenBodySchema>;
