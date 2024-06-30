import type { Request, Response, NextFunction } from 'express';
import HttpError from 'http-errors';
import asyncHandler from 'express-async-handler';

export const checkBan = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.prisma) throw new Error("Can't access prisma middleware");
    if (!req.user?.id) throw new Error("Can't access user id");

    const user = await req.prisma.user.findUnique({
      select: { id: true, isBanned: true },
      where: { id: req.user.id },
    });

    if (!user) throw new HttpError.Unauthorized('User not found');
    if (user.isBanned) throw new HttpError.Forbidden('User is banned');

    next();
  },
);
