import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "../../db/schema/schema";
import {
  masterKeySchema,
  responseSchema,
  statusSchema,
} from "../../utils/basicSchema";

const baseSchema = createInsertSchema(users, {
  userName: (schema) =>
    schema.userName
      .min(2, "User name must be at least 4 characters")
      .describe("Username for the account"),
});

// Update
export const updateUserSchema = z.object({
  userName: baseSchema.shape.userName,
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

const selectUserModel = createSelectSchema(users, {
  masterKey: masterKeySchema,
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

export const updateUserResponseSchema = responseSchema.and(
  z.object({ data: selectUserModel })
);

export const getUserResponseSchema = z.object({
  status: statusSchema,
  data: selectUserModel,
});
