import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from '~/env';
import { errorHandler, prisma } from '~/middleware';
import { authRouter, userRouter } from '~/routes';

const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(prisma);

app.get('/status', (req, res) => res.send({ up: true }));
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Express app is listening at port ${env.PORT}`);
});
