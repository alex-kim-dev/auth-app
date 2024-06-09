import { schema } from '~/schemas';
import dotenv from 'dotenv';

dotenv.config();

const { data, error } = schema.env.safeParse(process.env);

if (error) {
  console.error('Error parsing env variables:');
  console.error(error.errors);
  process.exit(1);
}

export const env = data;
