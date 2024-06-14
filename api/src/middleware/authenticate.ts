import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '~/env';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization ?? '';
  const accessToken = authHeader.match(/^Bearer (.+)$/)?.[1];

  if (!accessToken)
    return res.status(401).send({ message: 'Not authenticated' });

  jwt.verify(accessToken, env.AT_SECRET, (error, payload) => {
    if (error || !payload || typeof payload === 'string')
      return res.status(403).send({ message: 'Invalid access token' });

    req.user = { id: payload.userId as string };
    next();
  });
};
