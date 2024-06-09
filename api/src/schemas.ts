import { z } from 'zod';

export const schema = {
  env: z.object({
    PORT: z.coerce.number().int().positive(),
    CLIENT_URL: z.string().url(),
    ACCESS_TOKEN_SECRET: z.string().min(1),
    REFRESH_TOKEN_SECRET: z.string().min(1),
    ACCESS_TOKEN_EXPIRATION: z.string().min(1),
    REFRESH_TOKEN_EXPIRATION: z.string().min(1),
    SALT_ROUNDS: z.coerce.number().int().positive(),
    TEST_PASSWORD: z.string().min(6),
  }),
};
