import type { Response, Request } from 'express';
import type { DeleteUserReqParams } from '~/schemas';

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

const _delete = async (req: Request<DeleteUserReqParams>, res: Response) => {
  try {
    const { prisma } = req;
    const { id } = req.params;
    if (!prisma) throw new Error("Can't access prisma middleware");

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).send({ message: 'User not found' });

    await prisma.user.delete({ where: { id: req.params.id } });

    return res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

export const userController = { getAll, delete: _delete };
