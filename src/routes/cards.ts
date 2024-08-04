import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import {
  createCard, deleteCard, deleteCardLike, getCards, updateCardLikes,
} from '../controllers/cards';

import checkUserId from '../middleware/auth';

const cardRouter = Router();

cardRouter.get('/', getCards);

cardRouter.delete('/:cardId', deleteCard);

cardRouter.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().min(2).max(200).required(),
  }),
}), createCard);

cardRouter.put('/:cardId/likes', checkUserId, updateCardLikes);
cardRouter.delete('/:cardId/likes', checkUserId, deleteCardLike);

export default cardRouter;
