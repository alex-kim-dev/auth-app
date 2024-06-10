import type { RequestHandler } from 'express';
import { ZodError, type AnyZodObject } from 'zod';

export const validate =
  (schema: AnyZodObject): RequestHandler =>
  async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body as unknown,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError)
        res
          .status(400)
          .send(error.errors.map(({ path, message }) => ({ path, message })));
      else throw error;
    }
  };
