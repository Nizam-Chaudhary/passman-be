import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import AppError from "./appError";
import env from "./env";

export const globalErrorHandler = (
    fastify: FastifyInstance,
    error: any,
    _request: FastifyRequest,
    reply: FastifyReply
): any => {
    fastify.log.error(error);
    if (error.name === "ZodError") {
        error = new AppError(error.name, error.issues[0].message, 400, true);
    }
    if (env.NODE_ENV === "development") {
        return sendErrorDev(error, reply);
    }

    sendErrorProd(error, reply);
};

const sendErrorDev = (error: any, reply: FastifyReply) => {
    const statusCode = error.statusCode || 500;
    const status =
        error.statusCode >= 400 && error.statusCode < 500 ? "fail" : "error";
    const message = error.message || "something went wrong";

    return reply.code(statusCode).send({
        status: status,
        message: message,
        stack: error.stack,
    });
};

const sendErrorProd = (error: any, reply: FastifyReply) => {
    const statusCode = error.statusCode || 500;
    const status =
        error.statusCode >= 400 && error.statusCode < 500 ? "fail" : "error";
    const message = error.message || "something went wrong";

    if (error.isOperational) {
        return reply.code(statusCode).send({
            status: status,
            message: message,
        });
    }

    return reply.code(statusCode).send({
        status: "error",
        message: "something went wrong",
    });
};
