import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function health(fastify: FastifyInstance) {
    fastify.route({
        method: "GET",
        url: "/",
        schema: {
            tags: ["Health"],
            description: "Check Server health",
            response: {
                200: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            default: "ok",
                        },
                    },
                    required: ["status"],
                },
            },
        },
        prefixTrailingSlash: "both",
        handler: (_request: FastifyRequest, reply: FastifyReply) => {
            reply.status(200).send({ status: "ok" });
        },
    });
}
