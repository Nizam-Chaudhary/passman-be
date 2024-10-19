import { buildJsonSchemas } from 'fastify-zod';
import {
  addPasswordSchema,
  getPasswordResponseSchema,
  getPasswordsResponseSchema,
  importPasswordsSchema,
  updatePasswordSchema,
} from '../api/modules/password/password.schema';
import {
  getUserResponseSchema,
  signInUserSchema,
  signUpUserSchema,
  updateUserSchema,
} from '../api/modules/user/user.schema';
import { idParamsSchema, responseSchema } from '../utils/basicSchema';

export const { schemas: Schemas, $ref } = buildJsonSchemas({
  // common
  responseSchema,
  idParamsSchema,

  // user
  signUpUserSchema,
  signInUserSchema,
  updateUserSchema,
  getUserResponseSchema,

  // password
  addPasswordSchema,
  updatePasswordSchema,
  getPasswordsResponseSchema,
  getPasswordResponseSchema,
  importPasswordsSchema,
});
