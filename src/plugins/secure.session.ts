import { fastifySecureSession } from "@fastify/secure-session";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import env from "../lib/env";

export default fastifyPlugin(
    (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) => {
        // @ts-ignore
        fastify.register(fastifySecureSession, {
            secret: Buffer.from(env.SESSION_SECRET),
            cookie: {
                path: "/api",
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7, // 1 week
            },
        });

        done();
    }
);
