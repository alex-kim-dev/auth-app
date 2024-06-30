import { Router } from 'express';

import { userController } from '~/controllers/user.controller';
import { authenticate, validate, checkBan } from '~/middleware';
import { schema } from '~/schemas';

export const userRouter = Router();

userRouter.get('/all', authenticate, checkBan, userController.getAll);

userRouter.post(
  '/delete',
  validate(schema.usedIds),
  authenticate,
  checkBan,
  userController.delete,
);

userRouter.patch(
  '/ban',
  validate(schema.usedIds),
  authenticate,
  checkBan,
  userController.ban,
);

userRouter.patch(
  '/unban',
  validate(schema.usedIds),
  authenticate,
  checkBan,
  userController.unban,
);
