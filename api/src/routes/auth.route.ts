import { Router } from 'express';

import { authController } from '~/controllers/auth.controller';
import { validate } from '~/middleware';
import { schema } from '~/schemas';

export const authRouter = Router();

authRouter.post('/signup', validate(schema.signup), authController.signup);
authRouter.post('/login', validate(schema.login), authController.login);
authRouter.get('/refresh', validate(schema.refresh), authController.refresh);
