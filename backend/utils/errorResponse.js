class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// module.exports = errorResponse; // CommonJS
export default ErrorResponse; // ES6 Modules
