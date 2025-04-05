import { inject, singleton } from "tsyringe";
import { LoggerService } from "../../../domain/services/loggerService";
import { FastifyLoggerInstance } from "fastify";

@singleton()
export class PinoLoggerService implements LoggerService {
  constructor(
    @inject("Logger") private readonly logger: FastifyLoggerInstance
  ) {}

  debug(message: unknown, ...args: any[]): void {
    if (typeof message === "string" || typeof message === "object") {
      if (typeof message === "string") {
        this.logger.debug(message, ...args);
      } else {
        const [messageStr, ...restArgs] = args;
        this.logger.debug(message, messageStr, ...restArgs);
      }
    }
  }

  log(message: unknown, ...args: any[]): void {
    if (typeof message === "string" || typeof message === "object") {
      if (typeof message === "string") {
        this.logger.info(message, ...args);
      } else {
        const [messageStr, ...restArgs] = args;
        this.logger.info(message, messageStr, ...restArgs);
      }
    }
  }

  warn(message: unknown, ...args: any[]): void {
    if (typeof message === "string" || typeof message === "object") {
      if (typeof message === "string") {
        this.logger.warn(message, ...args);
      } else {
        const [messageStr, ...restArgs] = args;
        this.logger.warn(message, messageStr, ...restArgs);
      }
    }
  }

  error(message: unknown, ...args: any[]): void {
    if (typeof message === "string" || typeof message === "object") {
      if (typeof message === "string") {
        this.logger.error(message, ...args);
      } else {
        const [messageStr, ...restArgs] = args;
        this.logger.error(message, messageStr, ...restArgs);
      }
    }
  }

  fatal(message: unknown, ...args: any[]): void {
    if (typeof message === "string" || typeof message === "object") {
      if (typeof message === "string") {
        this.logger.fatal(message, ...args);
      } else {
        const [messageStr, ...restArgs] = args;
        this.logger.fatal(message, messageStr, ...restArgs);
      }
    }
  }

  trace(message: unknown, ...args: any[]): void {
    if (typeof message === "string" || typeof message === "object") {
      if (typeof message === "string") {
        this.logger.trace(message, ...args);
      } else {
        const [messageStr, ...restArgs] = args;
        this.logger.trace(message, messageStr, ...restArgs);
      }
    }
  }
}
