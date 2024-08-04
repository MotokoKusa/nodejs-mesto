import { constants } from 'http2';

export default class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_NOT_FOUND;
  }
}
