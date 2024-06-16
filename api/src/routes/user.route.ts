import { Router } from 'express';

import { userController } from '~/controllers/user.controller';
import { authenticate, validate, checkBan } from '~/middleware';
import { schema } from '~/schemas';

export const userRouter = Router();

userRouter.get('/all', authenticate, checkBan, userController.getAll);

userRouter.delete(
  '/:id',
  validate(schema.user),
  authenticate,
  checkBan,
  userController.delete,
);

userRouter.patch(
  '/:id/ban',
  validate(schema.user),
  authenticate,
  checkBan,
  userController.ban,
);

userRouter.patch(
  '/:id/unban',
  validate(schema.user),
  authenticate,
  checkBan,
  userController.unban,
);
