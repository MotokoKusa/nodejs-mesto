import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import Card from '../models/card';
import { IAuthRequest } from '../global/types';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({}).populate('owner').populate('likes')
    .orFail(() => new NotFoundError('Карточки не найдены'))
    .then((cards) => res.send(cards))
    .catch(next);
};

export const createCard = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  let userId: string | null = null;
  if (req.user) {
    // Костыль из-за запрета использовать _id
    const { _id: id } = req.user;
    userId = id;
  }

  try {
    const { name, link } = req.body;

    return Card.create({
      name, link, owner: userId, likes: [],
    }).then((card) => res.status(constants.HTTP_STATUS_CREATED).send({
      name: card.name,
      link: card.link,
      owner: card.owner,
      likes: card.likes,
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

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  try {
    return Card.findByIdAndDelete(cardId).then((card) => {
      if (!card) {
        return new NotFoundError('Карточка с таким id не найдена');
      }
      return res.status(constants.HTTP_STATUS_OK).send({ message: 'Карточка успешно удалена' });
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

export const updateCardLikes = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    let userId: string | null = null;
    if (req.user) {
      // Костыль из-за запрета использовать _id
      const { _id: id } = req.user;
      userId = id;
    }

    return await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    ).then((card) => {
      if (!card) {
        return new NotFoundError('Карточка с таким id не найдена');
      }

      return res.send(card);
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

export const deleteCardLike = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    let userId: string | null = null;
    if (req.user) {
      // Костыль из-за запрета использовать _id
      const { _id: id } = req.user;
      userId = id;
    }

    return await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    ).then((card) => {
      if (!card) {
        return new NotFoundError('Карточка с таким id не найдена');
      }

      return res.send(card);
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
