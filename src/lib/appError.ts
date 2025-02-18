import type { FastifyError } from "fastify";
import type {
  FastifySchemaValidationError,
  SchemaErrorDataVar,
} from "fastify/types/schema";

export default class AppError extends Error implements FastifyError {
  name: string;
  statusCode: number;
  code: string;
  isOperational: boolean;
  validationContext?: SchemaErrorDataVar | undefined;
  validation?: FastifySchemaValidationError[] | undefined;
  constructor(
    name: string,
    message: string,
    statusCode: number,
    isOperational: boolean = true,
    code: string = "ERR_INTERNAL_SERVER_ERROR"
  ) {
    super(message);

    this.name = name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
