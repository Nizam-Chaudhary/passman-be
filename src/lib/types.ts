import { JWT } from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
  }

  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module '@fastify/secure-session' {
  interface SessionData {
    access_token?: string;
  }
}

type userPayload = {
  id: number;
  email: string;
  userName: string;
  encryptionKey: string;
};

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: userPayload;
  }
}
