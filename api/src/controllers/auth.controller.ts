import type { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'node:crypto';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import HttpError from 'http-errors';
import asyncHandler from 'express-async-handler';
import { env } from '~/env';
import type { LoginReqBody, SignupReqBody, RefreshReqCookies } from '~/schemas';

const hashToken = (token: string) =>
  createHash('sha3-256').update(token).digest('base64');

const createTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, env.AT_SECRET, {
    expiresIn: env.AT_EXPIRATION,
  });

  const refreshToken = randomBytes(32).toString('base64');
  const hash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + ms(env.RT_EXPIRATION));

  return {
    access: { value: accessToken },
    refresh: { value: refreshToken, hash, expiresAt },
  };
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms(env.RT_EXPIRATION),
    path: '/auth/refresh',
  });
};

const signup = async (
  req: Request<object, object, SignupReqBody>,
  res: Response,
) => {
  if (!req.prisma) throw new Error("Can't access prisma middleware");

  const { prisma } = req;
  const { email, name, password } = req.body;

  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser)
    throw new HttpError.Conflict('A user with this email already exists');

  const hashedPassword = await bcrypt.hash(password, env.SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, name, password: hashedPassword },
    select: { id: true, name: true },
  });

  const tokens = createTokens(user.id);

  await prisma.refreshToken.create({
    data: {
      hash: tokens.refresh.hash,
      expiresAt: tokens.refresh.expiresAt,
      user: { connect: { id: user.id } },
    },
  });

  setRefreshTokenCookie(res, tokens.refresh.value);
  res.status(201).send({ ...user, accessToken: tokens.access.value });
};

const login = async (
  req: Request<object, object, LoginReqBody>,
  res: Response,
) => {
  if (!req.prisma) throw new Error("Can't access prisma middleware");

  const { prisma } = req;
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  const isCorrectPassword = await bcrypt.compare(
    password,
    user?.password ?? '',
  );

  if (user?.isBanned) throw new HttpError.Forbidden('User is banned');
  if (!user || !isCorrectPassword)
    throw new HttpError.Unauthorized('Invalid email or password');

  const tokens = createTokens(user.id);

  await prisma.refreshToken.upsert({
    create: {
      hash: tokens.refresh.hash,
      expiresAt: tokens.refresh.expiresAt,
      user: { connect: { id: user.id } },
    },
    update: {
      hash: tokens.refresh.hash,
      expiresAt: tokens.refresh.expiresAt,
    },
    where: { userId: user.id },
  });
  await prisma.user.update({
    data: { lastLogin: new Date() },
    where: { id: user.id },
  });

  setRefreshTokenCookie(res, tokens.refresh.value);
  res.send({
    id: user.id,
    name: user.name,
    accessToken: tokens.access.value,
  });
};

const refresh = async (req: Request, res: Response) => {
  if (!req.prisma) throw new Error("Can't access prisma middleware");

  const { prisma } = req;
  const { refreshToken } = req.cookies as RefreshReqCookies;
  const hash = hashToken(refreshToken);

  const record = await prisma.refreshToken.findUnique({
    where: { hash },
    include: { user: { select: { id: true, name: true, isBanned: true } } },
  });

  if (record?.user.isBanned) throw new HttpError.Forbidden('User is banned');
  if (!record) throw new HttpError.Forbidden('Access forbidden');

  if (record.expiresAt <= new Date()) {
    await prisma.refreshToken.delete({ where: { hash } });
    res.status(403).send({ message: 'Access forbidden' });
  }

  const { user } = record;
  const tokens = createTokens(user.id);

  await prisma.refreshToken.update({
    data: { hash: tokens.refresh.hash, expiresAt: tokens.refresh.expiresAt },
    where: { userId: user.id },
  });

  setRefreshTokenCookie(res, tokens.refresh.value);
  res.send({
    id: user.id,
    name: user.name,
    accessToken: tokens.access.value,
  });
};

const logout = async (req: Request, res: Response) => {
  const { prisma, user } = req;
  if (!prisma) throw new Error("Can't access prisma middleware");
  if (!user?.id) throw new Error("Can't access user id");

  await prisma.refreshToken.delete({ where: { userId: user.id } });

  res.sendStatus(204);
};

export const authController = {
  signup: asyncHandler(signup),
  login: asyncHandler(login),
  refresh: asyncHandler(refresh),
  logout: asyncHandler(logout),
};
