import { z } from 'zod';

export const schema = {
  env: z.object({
    PORT: z.coerce.number().int().positive(),
    CLIENT_URL: z.string().url(),
    AT_SECRET: z.string().min(1),
    AT_EXPIRATION: z.string().min(1),
    RT_EXPIRATION: z.string().min(1),
    SALT_ROUNDS: z.coerce.number().int().positive(),
    TEST_PASSWORD: z.string().min(6),
  }),

  signup: z.object({
    body: z.object({
      email: z
        .string({ required_error: 'Email is required' })
        .email('Email should be valid'),
      name: z
        .string({ required_error: 'Name is required' })
        .min(1, 'Name must be at least 1 character long'),
      password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Passworld should be at least 6 characters long')
        .regex(
          /^[a-z\d!@#$%^&*]+$/i,
          'Password should contain alphanumeric characters or symbols: !@#$%^&*',
        ),
    }),
  }),

  login: z.object({
    body: z.object({
      email: z.string({ required_error: 'Email is required' }),
      password: z.string({ required_error: 'Password is required' }),
    }),
  }),
};

export type SignupCredentials = z.infer<typeof schema.signup>['body'];
export type LoginCredentials = z.infer<typeof schema.login>['body'];
