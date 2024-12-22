import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { errorSchema, Schemas } from "../lib/apiSchema";

export default fastifyPlugin(
    (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) => {
        fastify.addSchema(errorSchema);
        for (const schema of Schemas) {
            fastify.addSchema(schema);
        }

        done();
    }
);
