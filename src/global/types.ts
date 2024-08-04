import { Request } from 'express';

export interface ICustomError extends Error {
  statusCode: number;
}

export interface IAuthRequest extends Request {
  user?: {
    _id: string
  }
}
