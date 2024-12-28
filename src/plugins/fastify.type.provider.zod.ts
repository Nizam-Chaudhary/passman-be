import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import {
    serializerCompiler,
    validatorCompiler,
} from "fastify-type-provider-zod";

export default fastifyPlugin(
    (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) => {
        fastify.setValidatorCompiler(validatorCompiler);
        fastify.setSerializerCompiler(serializerCompiler);

        done();
    }
);
