import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../global/types';

const checkUserId = (req: IAuthRequest, res: Response, next: NextFunction) => {
  let userID: string | null = null;
  if (req.user) {
    // Костыль из-за запрета использовать _id
    const { _id: id } = req.user;
    userID = id;
  }

  if (!userID) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return next();
};

export default checkUserId;
