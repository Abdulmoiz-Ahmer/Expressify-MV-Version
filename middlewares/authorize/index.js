import dotenv from 'dotenv';
import { logger, sendMessage, sendError } from '~/utils';
import { status } from '~/constants';

dotenv.config();

// eslint-disable-next-line consistent-return
export const authorize = (request, response, next) => {
	//  Codes that we might return coming from status
	const { FORBIDDEN } = status;

	try {
		// Expecting api key field in header
		if (
			!request.headers['x-api-key'] ||
			request.headers['x-api-key'] !== process.env.API_KEY
		)
			return sendMessage('Access Denied!', response, FORBIDDEN);

		next();
	} catch (exception) {
		//  Log in case of any abnormal crash
		logger('error', 'Error:', exception.message);
		return sendError('Internal Server Error', response, exception);
	}
};
