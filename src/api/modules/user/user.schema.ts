import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";
import { users } from "../../../db/schema/user";
import { idParamsSchema, responseSchema } from "../../../utils/basicSchema";

const baseSchema = createInsertSchema(users, {
  userName: (schema) =>
    schema.userName.min(2, "User name must be at least 4 characters"),
  email: (schema) => schema.email.email("Invalid email format"),
  password: (schema) =>
    schema.password
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[$@$!%*?&_]/,
        "Password must contain at least one special character"
      ),
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
  password: baseSchema.shape.password,
});

export type SignInUserInput = z.infer<typeof signInUserSchema>;

// Update
export const updateUserSchema = z.object({
  userName: baseSchema.shape.userName,
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

const selectUserModel = createSelectSchema(users).pick({
  id: true,
  userName: true,
  email: true,
  createdAt: true,
  updatedAt: true,
});

export type SelectUserModel = z.infer<typeof selectUserModel>;

export const getUserResponseSchema = z.object({
  status: z.string(),
  data: selectUserModel,
});
