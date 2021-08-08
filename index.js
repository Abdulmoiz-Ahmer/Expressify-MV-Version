/* eslint-disable import/named */
/* eslint-disable no-unused-vars */
import express from 'express';
import http from 'http';
import cors from 'cors';
import envLoader, { logger } from '~/utils';
import { connection } from '~/config';
import routes from '~/routes';

const port = process.env.PORT ?? 4000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);

if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'staging') {
	// eslint-disable-next-line global-require
	const options = require('~/config/swagger').swagger;
	// eslint-disable-next-line global-require
	const swaggerJsdoc = require('swagger-jsdoc');
	// eslint-disable-next-line global-require
	const swaggerUi = require('swagger-ui-express');

	app.use(
		'/api-docs',
		swaggerUi.serve,
		swaggerUi.setup(swaggerJsdoc(options), { explorer: true }),
	);
}

http.createServer(app);
app.listen(port, () => {
	logger('info', 'Info:', `Listening on port: ${port}`);
});

module.exports = app;
