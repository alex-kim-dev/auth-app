import type { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'node:crypto';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { env } from '~/env';
import type { LoginCredentials, SignupCredentials } from '~/schemas';

const createTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, env.AT_SECRET, {
    expiresIn: env.AT_EXPIRATION,
  });

  const refreshToken = randomBytes(32).toString('base64');
  const hashed = createHash('sha3-256').update(refreshToken).digest('base64');
  const expiresAt = new Date(Date.now() + ms(env.RT_EXPIRATION));

  return {
    accessToken,
    refreshToken: {
      value: refreshToken,
      hashed,
      expiresAt,
    },
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
  req: Request<object, object, SignupCredentials>,
  res: Response,
) => {
  try {
    if (!req.prisma) throw new Error("Can't access prisma middleware");

    const { prisma } = req;
    const { email, name, password } = req.body;

    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .send({ message: 'A user with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, env.SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword },
      select: { id: true, name: true },
    });

    const { accessToken, refreshToken } = createTokens(user.id);

    await prisma.refreshToken.create({
      data: {
        hash: refreshToken.hashed,
        expiresAt: refreshToken.expiresAt,
        user: { connect: { id: user.id } },
      },
    });

    setRefreshTokenCookie(res, refreshToken.value);
    return res.status(201).send({ ...user, accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

const login = async (
  req: Request<object, object, LoginCredentials>,
  res: Response,
) => {
  try {
    if (!req.prisma) throw new Error("Can't access prisma middleware");

    const { prisma } = req;
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({ where: { email } });
    const isCorrectPassword = await bcrypt.compare(
      password,
      user?.password ?? '',
    );

    if (!user || !isCorrectPassword) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = createTokens(user.id);

    await prisma.refreshToken.create({
      data: {
        hash: refreshToken.hashed,
        expiresAt: refreshToken.expiresAt,
        user: { connect: { id: user.id } },
      },
    });

    setRefreshTokenCookie(res, refreshToken.value);
    return res.send({ id: user.id, name: user.name, accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

export const authController = {
  signup,
  login,
};
