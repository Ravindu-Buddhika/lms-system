import { ZodError } from 'zod';

/**
 * Express middleware for validating request shape and types using Zod.
 * Rejects malformed or unexpected data outright.
 *
 * @param {object} schemas - Object containing optional zod schemas for body, query, and/or params
 * @param {import('zod').ZodSchema} [schemas.body] - Schema for req.body
 * @param {import('zod').ZodSchema} [schemas.query] - Schema for req.query
 * @param {import('zod').ZodSchema} [schemas.params] - Schema for req.params
 */
export const validate = (schemas = {}) => {
  return async (req, res, next) => {
    try {
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        }));

        return res.status(400).json({
          error: 'Validation failed',
          details: issues,
        });
      }
      next(err);
    }
  };
};
