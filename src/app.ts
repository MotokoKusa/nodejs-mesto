import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import { join } from 'path';
import errorHandler from './middleware/error-handler';
import { requestLogger, errorLogger } from './middleware/logger';
import { IAuthRequest } from './global/types';
import router from './routes';

require('dotenv').config();

const { PORT = '3001', MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());

app.use(express.static(join(__dirname, 'public')));

app.use((req: IAuthRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '66af227b0a434caed1caffde', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errorHandler);

app.use(errors());

const connect = async () => {
  await mongoose.connect(MONGO_URL).then(() => {
    app.listen(PORT);
  });
};

connect();
