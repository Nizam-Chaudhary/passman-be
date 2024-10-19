import { FastifyInstance } from 'fastify';
import userController from '../modules/user/user.controller';
import { $ref, userSchemas } from '../modules/user/user.schema';

export default async (fastify: FastifyInstance) => {
  for (let schema of [...userSchemas]) {
    fastify.addSchema(schema);
  }

  fastify.route({
    method: 'POST',
    url: '/sign-up',
    attachValidation: true,
    schema: {
      body: $ref('signUpUserSchema'),
      response: {
        200: $ref('responseSchema'),
      },
    },
    handler: userController.signUpUser,
  });

  fastify.route({
    method: 'POST',
    url: '/sign-in',
    attachValidation: true,
    schema: {
      body: $ref('signInUserSchema'),
      response: {
        200: $ref('responseSchema'),
      },
    },
    handler: userController.signInUser,
  });

  fastify.route({
    method: 'POST',
    url: '/update',
    attachValidation: true,
    schema: {
      body: $ref('updateUserSchema'),
      response: {
        200: $ref('responseSchema'),
      },
    },
    preHandler: [fastify.authenticate],
    handler: userController.updateUser,
  });

  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: $ref('getUserResponseSchema'),
      },
    },
    preHandler: [fastify.authenticate],
    handler: userController.getUser,
  });

  fastify.route({
    method: 'GET',
    url: '/logout',
    schema: {
      response: {
        200: $ref('responseSchema'),
      },
    },
    handler: userController.logout,
  });
};
