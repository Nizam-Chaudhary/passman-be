import { z } from "zod";
import {
  createUserSchema,
  getUserDataSchema,
  masterKeySchema,
  updateUserSchema,
  userResponseDataSchema,
} from "../presentation/schemas/userSchema.js";

export type User = z.infer<typeof userResponseDataSchema>;

export type UserWithFile = z.infer<typeof getUserDataSchema>;

export type CreateUserBody = z.infer<typeof createUserSchema>;

export type CreateUser = CreateUserBody & {
  otp: string;
  isVerified: boolean;
};

export type UpdateUser = z.infer<typeof updateUserSchema>;

export type EncryptedMasterKey = z.infer<typeof masterKeySchema>;
