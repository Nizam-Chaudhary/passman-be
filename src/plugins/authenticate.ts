import { FastifyJWT } from "@fastify/jwt";
import {
    FastifyInstance,
    FastifyPluginOptions,
    FastifyReply,
    FastifyRequest,
} from "fastify";
import fastifyPlugin from "fastify-plugin";
import AppError from "../lib/appError";

export default fastifyPlugin(
    (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) => {
        fastify.decorate(
            "authenticate",
            async (req: FastifyRequest, _reply: FastifyReply) => {
                const token = req.headers.authorization?.replace("Bearer ", "");
                console.log("token", token);

                if (!token) {
                    throw new AppError(
                        "UNAUTHORIZED",
                        "please sign in first",
                        401
                    );
                }

                try {
                    const decoded = req.jwt.verify<FastifyJWT["user"]>(token);
                    req.user = decoded;
                } catch (error: any) {
                    console.log("error", error);
                }
            }
        );

        done();
    }
);
