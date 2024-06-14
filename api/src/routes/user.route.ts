import { Router } from 'express';

import { userController } from '~/controllers/user.controller';
import { authenticate, validate } from '~/middleware';
import { schema } from '~/schemas';

export const userRouter = Router();

userRouter.get('/all', authenticate, userController.getAll);

userRouter.delete(
  '/:id',
  validate(schema.user),
  authenticate,
  userController.delete,
);

userRouter.patch(
  '/:id/ban',
  validate(schema.user),
  authenticate,
  userController.setBan(true),
);

userRouter.patch(
  '/:id/unban',
  validate(schema.user),
  authenticate,
  userController.setBan(false),
);
