import type { PrismaClient } from '@prisma/client';

declare module 'express' {
  export interface Request {
    prisma?: PrismaClient;
  }
}
