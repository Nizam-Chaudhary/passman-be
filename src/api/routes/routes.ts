import { FastifyJWT } from '@fastify/jwt';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { FastifyReply } from 'fastify/types/reply';
import AppError from '../../lib/appError';
import passwordRoute from './password.route';
import userRoute from './user.route';

export default async (fastify: FastifyInstance) => {
  fastify.decorate(
    'authenticate',
    async (req: FastifyRequest, _reply: FastifyReply) => {
      const token = req.session.get('access_token');

      if (!token) {
        throw new AppError('UNAUTHORIZED', 'please sign in first', 401);
      }

      const decoded = req.jwt.verify<FastifyJWT['user']>(token);
      req.user = decoded;
    }
  );

  fastify.register(userRoute, { prefix: '/api/v1/users' });
  fastify.register(passwordRoute, { prefix: '/api/v1/passwords' });
};
