class ApiError extends Error {
  constructor(message, statusCode, error = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.errors = error;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export default ApiError;
