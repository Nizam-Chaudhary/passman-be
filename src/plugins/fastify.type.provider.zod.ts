import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import {
    serializerCompiler,
    validatorCompiler,
} from "fastify-type-provider-zod";

export default fastifyPlugin(
    async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
        fastify.setValidatorCompiler(validatorCompiler);
        fastify.setSerializerCompiler(serializerCompiler);
    }
);
