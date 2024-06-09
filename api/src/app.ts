import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from '~/env';
import { prisma } from '~/middleware';

const app = express();

app.use(cors({ origin: env.CLIENT_URL }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(prisma);

app.get('/status', (req, res) => res.send({ up: true }));

app.listen(env.PORT, () => {
  console.log(`Express app is listening at port ${env.PORT}`);
});
