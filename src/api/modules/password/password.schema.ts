import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';
import { passwords } from '../../../db/schema/password';
import { idParamsSchema, responseSchema } from '../../../utils/basicSchema';

const baseSchema = createInsertSchema(passwords, {
  username: (schema) => schema.username.optional().nullable(),
  email: (schema) => schema.email.email('invalid email').optional().nullable(),
  password: (schema) => schema.password.min(1, 'Password cannot be empty'),
  appName: (schema) => schema.appName.optional().nullable(),
  baseUrl: (schema) => schema.baseUrl.url('invalid url').optional().nullable(),
  specificUrl: (schema) =>
    schema.specificUrl.url('invalid url').optional().nullable(),
  faviconUrl: (schema) =>
    schema.specificUrl.url('invalid url').optional().nullable(),
  notes: (schema) => schema.notes.optional().nullable(),
});

export const addPasswordSchema = z.object({
  username: baseSchema.shape.username,
  email: baseSchema.shape.email,
  password: baseSchema.shape.password,
  appName: baseSchema.shape.appName,
  baseUrl: baseSchema.shape.baseUrl,
  specificUrl: baseSchema.shape.specificUrl,
  faviconUrl: baseSchema.shape.faviconUrl,
  notes: baseSchema.shape.notes,
});

export type AddPasswordInput = z.infer<typeof addPasswordSchema>;

export const importPasswordsSchema = z.array(addPasswordSchema);

export type ImportPasswordsInput = z.infer<typeof importPasswordsSchema>;

export const updatePasswordSchema = z.object({
  username: baseSchema.shape.username,
  email: baseSchema.shape.email,
  password: baseSchema.shape.password,
  appName: baseSchema.shape.appName,
  baseUrl: baseSchema.shape.baseUrl,
  specificUrl: baseSchema.shape.specificUrl,
  faviconUrl: baseSchema.shape.faviconUrl,
  notes: baseSchema.shape.notes,
});

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

const selectPasswordsModel = createSelectSchema(passwords);

export type SelectPasswordsModel = z.infer<typeof selectPasswordsModel>;

export const getPasswordsResponseSchema = z.object({
  status: z.string(),
  data: z.array(selectPasswordsModel),
});

export const getPasswordResponseSchema = z.object({
  status: z.string(),
  data: selectPasswordsModel,
});
export const { schemas: passwordSchemas, $ref } = buildJsonSchemas({
  addPasswordSchema,
  updatePasswordSchema,
  getPasswordsResponseSchema,
  getPasswordResponseSchema,
  responseSchema,
  idParamsSchema,
  importPasswordsSchema,
});
