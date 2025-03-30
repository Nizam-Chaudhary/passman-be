export default class HttpError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public isOperational = true
  ) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }
}

/** 🛑 400 - Bad Request */
export class BadRequestError extends HttpError {
  constructor(message = "Bad Request", isOperational = true) {
    super(message, 400, isOperational);
  }
}

/** ❌ 401 - Unauthorized */
export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized", isOperational = true) {
    super(message, 401, isOperational);
  }
}

/** ⛔ 403 - Forbidden */
export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden", isOperational = true) {
    super(message, 403, isOperational);
  }
}

/** 🔍 404 - Not Found */
export class NotFoundError extends HttpError {
  constructor(message = "Not Found", isOperational = true) {
    super(message, 404, isOperational);
  }
}

/** 🔄 409 - Conflict (e.g., User already exists) */
export class ConflictError extends HttpError {
  constructor(message = "Conflict", isOperational = true) {
    super(message, 409, isOperational);
  }
}

/** ⏳ 422 - Unprocessable Entity (e.g., Validation failed) */
export class UnprocessableEntityError extends HttpError {
  constructor(message = "Unprocessable Entity", isOperational = true) {
    super(message, 422, isOperational);
  }
}

/** 🔥 500 - Internal Server Error */
export class InternalServerError extends HttpError {
  constructor(message = "Internal Server Error", isOperational = true) {
    super(message, 500, isOperational);
  }
}
