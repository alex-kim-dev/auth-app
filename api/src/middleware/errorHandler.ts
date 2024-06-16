import type { ErrorRequestHandler } from 'express';
import HttpError from 'http-errors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (HttpError.isHttpError(error)) {
    const { statusCode, message } = error;
    return res.status(statusCode).send({ message });
  }

  return res.status(500).send({ message: 'Internal server error' });
};
