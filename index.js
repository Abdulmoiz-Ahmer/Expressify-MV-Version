import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { connection } from '~/config';
import { logger } from '~/utils';
import routes from '~/routes';
import { auth } from 'middlewares/auth';

dotenv.config();

const port = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);

const server = http.createServer(app);
server.listen(port, () => {
  logger('info', 'Info:', `Listening on port: ${port}`);
});
