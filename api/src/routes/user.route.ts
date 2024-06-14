import { Router } from 'express';

import { userController } from '~/controllers/user.controller';
import { authenticate } from '~/middleware';

export const userRouter = Router();

userRouter.get('/all', authenticate, userController.getAll);
