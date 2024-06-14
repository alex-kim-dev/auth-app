import type { Response, Request } from 'express';

const getAll = async (req: Request, res: Response) => {
  try {
    if (!req.prisma) throw new Error("Can't access prisma middleware");

    const users = await req.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        lastLogin: true,
        createdAt: true,
        isBanned: true,
      },
    });

    return res.status(200).send(users);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

export const userController = { getAll };
