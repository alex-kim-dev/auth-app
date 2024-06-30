import type { Response, Request } from 'express';
import HttpError from 'http-errors';
import asyncHandler from 'express-async-handler';
import type { UserIdsReqBody } from '~/schemas';

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

const _delete = async (
  req: Request<object, object, UserIdsReqBody>,
  res: Response,
) => {
  const { prisma } = req;
  const ids = req.body;
  if (!prisma) throw new Error("Can't access prisma middleware");

  const users = await prisma.user.findMany({ where: { id: { in: ids } } });
  const foundIds = new Set(users.map(({ id }) => id));
  const missingIds = ids.filter((id) => !foundIds.has(id));

  if (missingIds.length > 0)
    throw new HttpError.NotFound(
      `Users not found (${missingIds.length}): ${missingIds.join(', ')}`,
    );

  await prisma.user.deleteMany({ where: { id: { in: ids } } });

  res.status(200).send({ message: 'Users deleted successfully' });
};

const setBan =
  (ban: boolean) =>
  async (req: Request<object, object, UserIdsReqBody>, res: Response) => {
    const { prisma } = req;
    const ids = req.body;
    if (!prisma) throw new Error("Can't access prisma middleware");

    const users = await prisma.user.findMany({ where: { id: { in: ids } } });
    const foundIds = new Set(users.map(({ id }) => id));
    const missingIds = ids.filter((id) => !foundIds.has(id));

    if (missingIds.length > 0)
      throw new HttpError.NotFound(
        `Users not found (${missingIds.length}): ${missingIds.join(', ')}`,
      );

    await prisma.user.updateMany({
      data: { isBanned: ban },
      where: { id: { in: ids } },
    });

    res
      .status(200)
      .send({ message: `Users ${ban ? '' : 'un'}banned successfully` });
  };

export const userController = {
  getAll: asyncHandler(getAll),
  delete: asyncHandler(_delete),
  ban: asyncHandler(setBan(true)),
  unban: asyncHandler(setBan(false)),
};
