import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import {
  getUsers, getUserById, createUser, updateUserProfile, updateUserAvatar,
} from '../controllers/users';
import checkUserId from '../middleware/auth';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:userId', getUserById);

userRouter.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
    avatar: Joi.string().required(),
  }),
}), createUser);

userRouter.patch('/me', checkUserId, updateUserProfile);

userRouter.patch('/me/avatar', checkUserId, updateUserAvatar);

export default userRouter;
