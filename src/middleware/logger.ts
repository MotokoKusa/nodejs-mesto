import winston from 'winston';
import expressWinston from 'express-winston';

import 'winston-daily-rotate-file';

const transport = new winston.transports.DailyRotateFile({
  dirname: 'logs',
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: 14,
});

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log', dirname: 'logs' }),
  ],
  format: winston.format.json(),
});

// логер ошибок
export const errorLogger = expressWinston.errorLogger({
  transports: [
    transport,
  ],
  format: winston.format.json(),
});
