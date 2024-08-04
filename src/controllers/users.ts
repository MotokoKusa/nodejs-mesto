import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import User from '../models/user';
import { IAuthRequest } from '../global/types';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;

    return await User.create({ name, about, avatar })
      .then((user) => res.status(constants.HTTP_STATUS_CREATED).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      }));
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    if (error instanceof Error && error.message.startsWith('E11000')) {
      return next(new ConflictError('Имя уже используется'));
    }

    return next(error);
  }
};

export const getUsers = (_req: Request, res: Response, next: NextFunction) => User.find({})
  .orFail(() => new NotFoundError('Пользователи не найден'))
  .then((users) => res.send(users))
  .catch(next);

// eslint-disable-next-line max-len
export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  return User.findById({ _id: userId })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof MongooseError.CastError) {
        return next(new BadRequestError('Не валидный id'));
      }
      return next(error);
    });
};

export const updateUserAvatar = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    let userId: string | null = null;
    if (req.user) {
      // Костыль из-за запрета использовать _id
      const { _id: id } = req.user;
      userId = id;
    }
    if (!avatar) {
      return next(new BadRequestError('Не передан обязательный параметр'));
    }

    return await User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
      .then((user) => {
        if (!user) {
          return new NotFoundError('Пользователь не найден');
        }
        return res.send(user);
      });
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    if (error instanceof Error && error.message.startsWith('E11000')) {
      return next(new ConflictError('Имя уже используется'));
    }
    return next(error);
  }
};

export const updateUserProfile = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;
    let userId: string | null = null;
    if (req.user) {
      // Костыль из-за запрета использовать _id
      const { _id: id } = req.user;
      userId = id;
    }
    // eslint-disable-next-line max-len
    return await User.findByIdAndUpdate(userId, { name, about, avatar }, { new: true, runValidators: true })
      .then((user) => {
        if (!user) {
          return new NotFoundError('Пользователь не найден');
        }
        return res.send(user);
      });
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    if (error instanceof Error && error.message.startsWith('E11000')) {
      return next(new ConflictError('Имя уже используется'));
    }
    return next(error);
  }
};
