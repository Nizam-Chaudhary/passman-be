import type { JWT } from "@fastify/jwt";

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }

  export interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

type userPayload = {
  id: number;
  email: string;
  userName: string;
  encryptionKey: string;
};

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: userPayload;
  }
}
