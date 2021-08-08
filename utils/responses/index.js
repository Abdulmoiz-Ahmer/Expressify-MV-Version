import { status } from '~/constants';
import { logger } from '../logger/index';

const isProduction = process.env.NODE_ENV === 'production';

export const sendResponse = (
	data,
	response,
	code = status.OK,
	key = 'results',
) => {
	const message = {};
	message[key] = data;
	return response.status(code).json(message);
};

export const sendError = (message, response, exception) => {
	const returnData = {
		message,
		error: 'Internal server error',
	};

	if (!isProduction) {
		returnData.error =
			(exception.name ? `${exception.name} : ` : '') + exception.message;
	}
	logger('warning', 'message:', exception);

	return response.status(status.SERVER_ERROR).json(returnData);
};

export const sendSuccess = (data, response) => sendResponse(data, response);

export const sendMessage = (data, response, code = status.OK) =>
	sendResponse(data, response, code, 'message');

export const sendNotFound = (message, response) =>
	sendMessage(message, response, status.NOT_FOUND);
