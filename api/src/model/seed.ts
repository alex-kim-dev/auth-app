import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

dotenv.config();
const prisma = new PrismaClient();
const { TEST_PASSWORD } = process.env;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '');

const users: [email: string, name: string, isBanned: boolean][] = [
  ['raccoon@email.com', 'Raccoon', false],
  ['elephant@email.com', 'Elephant', true],
  ['cat@email.com', 'Cat', false],
  ['parrot@email.com', 'Parrot', false],
  ['lion@email.com', 'Lion', true],
  ['mouse@email.com', 'Mouse', false],
];

async function main() {
  if (!TEST_PASSWORD || !SALT_ROUNDS)
    throw new Error('Some of the env variables are not specified');

  await prisma.user.createMany({
    data: users.map(([email, name, isBanned]) => ({
      email,
      name,
      password: bcrypt.hashSync(TEST_PASSWORD, SALT_ROUNDS),
      isBanned,
    })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
