import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { logger } from '~/utils';

dotenv.config();

const Connection_String =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing'
    ? process.env.CONNECTION_STRING_TESTING
    : process.env.CONNECTION_STRING_PRODUCTION;

//Mongoose connection
mongoose
  .connect(Connection_String, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .catch((error) => logger('error', 'Mongoose connection Issue:', error));

//Connectivity status on connection establishment
mongoose.connection.on('connected', () =>
  logger('info', 'Mongoose connection:', 'Connection Established'),
);

//Connectivity status on connection resetting
mongoose.connection.on('reconnected', () =>
  logger('info', 'Mongoose connection:', 'Connection Reestablished'),
);

//Connectivity status on disconnection
mongoose.connection.on('disconnected', () =>
  logger('info', 'Mongoose connection:', 'Connection Disconnected'),
);

//Connectivity Status  On connection close
mongoose.connection.on('close', () =>
  logger('info', 'Mongoose connection Issue:', 'Connection Closed'),
);

//Connectivity Status  On error
mongoose.connection.on('error', (error) =>
  logger('error', 'Mongoose connection Issue:', error),
);

export const oMongoose = mongoose;
