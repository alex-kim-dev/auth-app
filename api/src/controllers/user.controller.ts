import type { Response, Request } from 'express';
import HttpError from 'http-errors';
import asyncHandler from 'express-async-handler';
import type { UserReqParams } from '~/schemas';

const getAll = async (req: Request, res: Response) => {
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
    orderBy: { name: 'asc' },
  });

  res.status(200).send(users);
};

const _delete = async (req: Request<UserReqParams>, res: Response) => {
  const { prisma } = req;
  const { id } = req.params;
  if (!prisma) throw new Error("Can't access prisma middleware");

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new HttpError.NotFound('User not found');

  await prisma.user.delete({ where: { id: req.params.id } });

  res.status(200).send({ message: 'User deleted successfully' });
};

const setBan =
  (ban: boolean) => async (req: Request<UserReqParams>, res: Response) => {
    const { prisma } = req;
    const { id } = req.params;
    if (!prisma) throw new Error("Can't access prisma middleware");

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new HttpError.NotFound('User not found');

    if (user.isBanned === ban)
      throw new HttpError.BadRequest(
        `User is already ${ban ? '' : 'un'}banned`,
      );

    await prisma.user.update({ data: { isBanned: ban }, where: { id } });

    res
      .status(200)
      .send({ message: `User ${ban ? '' : 'un'}banned successfully` });
  };

export const userController = {
  getAll: asyncHandler(getAll),
  delete: asyncHandler(_delete),
  ban: asyncHandler(setBan(true)),
  unban: asyncHandler(setBan(false)),
};
