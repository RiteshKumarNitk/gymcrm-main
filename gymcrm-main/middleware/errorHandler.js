const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  // Log the error with stack trace in development
  const env = process.env.NODE_ENV || 'development';
  
  const errorResponse = {
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'SERVER_ERROR'
    }
  };
  
  if (env === 'development') {
    errorResponse.error.stack = err.stack;
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    errorResponse.error.message = 'Validation failed';
    errorResponse.error.errors = errors;
    return res.status(400).json(errorResponse);
  }
  
  if (err.name === 'CastError') {
    errorResponse.error.message = `Invalid ${err.path}: ${err.value}`;
    return res.status(400).json(errorResponse);
  }
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    errorResponse.error.message = `Duplicate field value: ${field}. Please use another value`;
    return res.status(400).json(errorResponse);
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    errorResponse.error.message = 'Invalid token. Please log in again!';
    return res.status(401).json(errorResponse);
  }
  
  if (err.name === 'TokenExpiredError') {
    errorResponse.error.message = 'Your token has expired! Please log in again.';
    return res.status(401).json(errorResponse);
  }
  
  // Default to 500 server error
  res.status(err.status || 500).json(errorResponse);
};

module.exports = errorHandler;