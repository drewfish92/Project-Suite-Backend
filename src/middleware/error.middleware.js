const logger = require('../utils/logger');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  });

  // Prisma errors
  if (err.code === 'P2002') {
    error = new AppError('Duplicate field value entered', 400, 'DUPLICATE_ERROR');
  }
  if (err.code === 'P2025') {
    error = new AppError('Record not found', 404, 'NOT_FOUND');
  }
  if (err.code === 'P2003') {
    error = new AppError('Invalid reference to related record', 400, 'INVALID_REFERENCE');
  }

  // Mongoose/Validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400, 'VALIDATION_ERROR');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401, 'INVALID_TOKEN');
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401, 'TOKEN_EXPIRED');
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new AppError('File too large', 400, 'FILE_TOO_LARGE');
  }

  // Stripe errors
  if (err.type === 'StripeCardError') {
    error = new AppError(err.message, 400, 'PAYMENT_ERROR');
  }
  if (err.type === 'StripeInvalidRequestError') {
    error = new AppError('Invalid payment request', 400, 'INVALID_PAYMENT_REQUEST');
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';

  res.status(statusCode).json({
    error: {
      code: code,
      message: error.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
};

// Async handler wrapper to catch errors in async route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Not found handler
const notFound = (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404, 'NOT_FOUND');
  next(error);
};

module.exports = {
  AppError,
  errorHandler,
  asyncHandler,
  notFound
};

