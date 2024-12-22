import { FastifyInstance } from "fastify";
import passwordRoute from "./password";
import userRoute from "./user";

export default async (fastify: FastifyInstance) => {
    fastify.register(userRoute, { prefix: "/api/v1/users" });
    fastify.register(passwordRoute, { prefix: "/api/v1/passwords" });
};
