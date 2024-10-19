import { FastifyInstance } from 'fastify';
import { $ref } from '../../lib/apiSchema';
import userController from '../modules/user/user.controller';

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    url: '/sign-up',
    attachValidation: true,
    schema: {
      tags: ['User'],
      description: 'Sign up user',
      body: $ref('signUpUserSchema'),
      response: {
        200: $ref('responseSchema'),
      },
      required: ['email'],
    },
    handler: userController.signUpUser,
  });

  fastify.route({
    method: 'POST',
    url: '/sign-in',
    attachValidation: true,
    schema: {
      tags: ['User'],
      description: 'Sign in user',
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
      tags: ['User'],
      description: 'update user details',
      security: [{ cookieAuth: [] }],
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
      security: [{ cookieAuth: [] }],
      tags: ['User'],
      description: 'fetch user details',
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
      tags: ['User'],
      description: 'Log out user',
      response: {
        200: $ref('responseSchema'),
      },
    },
    handler: userController.logout,
  });
};
