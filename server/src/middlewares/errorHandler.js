import { env } from '../config/env.js';

/**
 * 404 handler for unmatched routes.
 */
export const notFoundHandler = (req, res, _next) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Centralized error-handling middleware.
 * Catches malformed JSON payloads and unexpected errors.
 */
export const errorHandler = (err, req, res, _next) => {
  // Handle malformed JSON body from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Malformed JSON payload',
      details: [{ message: err.message }],
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  const response = {
    error: message,
  };

  // Only include stack trace during development if useful
  if (env.isDev && statusCode === 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
