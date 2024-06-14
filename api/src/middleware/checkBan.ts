import type { Request, Response, NextFunction } from 'express';

export const checkBan = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.prisma) throw new Error("Can't access prisma middleware");
    if (!req.user?.id) throw new Error("Can't access user id");

    const user = await req.prisma.user.findUnique({
      select: { id: true, isBanned: true },
      where: { id: req.user.id },
    });

    if (!user) return res.status(404).send({ message: 'User not found' });

    if (user.isBanned)
      return res.status(403).send({ message: 'User is banned' });

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};
