import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { logger } from '~/utils';

dotenv.config();

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .catch((error) => logger('error', 'Mongoose connection Issue:', error));

mongoose.connection.on('connected', () =>
  logger('info', 'Mongoose connection:', 'Connection Established'),
);

mongoose.connection.on('reconnected', () =>
  logger('info', 'Mongoose connection:', 'Connection Reestablished'),
);

mongoose.connection.on('disconnected', () =>
  logger('info', 'Mongoose connection:', 'Connection Disconnected'),
);

mongoose.connection.on('close', () =>
  logger('info', 'Mongoose connection Issue:', 'Connection Closed'),
);

mongoose.connection.on('error', (error) =>
  logger('error', 'Mongoose connection Issue:', error),
);

export const oMongoose = mongoose;
