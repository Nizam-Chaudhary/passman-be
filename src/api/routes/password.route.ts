import { FastifyInstance } from 'fastify';
import { $ref } from '../../lib/apiSchema';
import passwordController from '../modules/password/password.controller';

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    url: '/',
    attachValidation: true,
    schema: {
      tags: ['Password'],
      description: 'add password',
      security: [{ cookieAuth: [] }],
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
      tags: ['Password'],
      description: 'fetch passwords',
      security: [{ cookieAuth: [] }],
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
      tags: ['Password'],
      description: 'fetch password',
      security: [{ cookieAuth: [] }],
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
      tags: ['Password'],
      description: 'update password',
      security: [{ cookieAuth: [] }],
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
      tags: ['Password'],
      description: 'delete password',
      security: [{ cookieAuth: [] }],
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
      tags: ['Password'],
      description: 'import passwords',
      security: [{ cookieAuth: [] }],
      body: $ref('importPasswordsSchema'),
      response: {
        200: $ref('responseSchema'),
      },
    },
    preHandler: [fastify.authenticate],
    handler: passwordController.importPasswords,
  });
};
