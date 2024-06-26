import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import HttpError from 'http-errors';
import { env } from '~/env';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization ?? '';
  const accessToken = authHeader.match(/^Bearer (.+)$/)?.[1];

  if (!accessToken) throw new HttpError.Unauthorized('Not authenticated');

  jwt.verify(accessToken, env.AT_SECRET, (error, payload) => {
    if (error || !payload || typeof payload === 'string')
      throw new HttpError.Unauthorized('Invalid access token');

    req.user = { id: payload.userId as string };
    next();
  });
};
