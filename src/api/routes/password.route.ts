import { FastifyInstance } from 'fastify';
import passwordController from '../modules/password/password.controller';
import { $ref, passwordSchemas } from '../modules/password/password.schema';

export default async (fastify: FastifyInstance) => {
  for (let schema of [...passwordSchemas]) {
    fastify.addSchema(schema);
  }

  fastify.route({
    method: 'POST',
    url: '/',
    attachValidation: true,
    schema: {
      body: $ref('addPasswordSchema'),
      response: {
        200: $ref('responseSchema'),
      },
    },
    preHandler: [fastify.authenticate],
    handler: passwordController.addPassword,
  });

  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: $ref('getPasswordsResponseSchema'),
      },
    },
    preHandler: [fastify.authenticate],
    handler: passwordController.getPasswords,
  });

  fastify.route({
    method: 'GET',
    url: '/:id',
    attachValidation: true,
    schema: {
      params: $ref('idParamsSchema'),
      response: {
        200: $ref('getPasswordResponseSchema'),
      },
    },
    preHandler: [fastify.authenticate],
    handler: passwordController.getPassword,
  });

  fastify.route({
    method: 'PUT',
    url: '/:id',
    attachValidation: true,
    schema: {
      params: $ref('idParamsSchema'),
      body: $ref('updatePasswordSchema'),
      response: {
        200: $ref('responseSchema'),
      },
    },
    preHandler: [fastify.authenticate],
    handler: passwordController.updatePassword,
  });

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    attachValidation: true,
    schema: {
      params: $ref('idParamsSchema'),
      response: {
        200: $ref('responseSchema'),
      },
    },
    preHandler: [fastify.authenticate],
    handler: passwordController.deletePassword,
  });

  fastify.route({
    method: 'POST',
    url: '/import',
    attachValidation: true,
    schema: {
      body: $ref('importPasswordsSchema'),
      response: {
        200: $ref('responseSchema'),
      },
    },
    preHandler: [fastify.authenticate],
    handler: passwordController.importPasswords,
  });
};
