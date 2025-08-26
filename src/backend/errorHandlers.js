class ServerError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ForbiddenError extends ServerError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}
