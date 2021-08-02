import { logger, sendSuccess, sendError } from '~/utils';

export const getTestData = (_, response) => {
	try {
		return sendSuccess({ message: 'Working' }, response);
	} catch (exception) {
		logger('error', 'Error:', exception.message);
		return sendError('Internal Server Error', response, exception);
	}
};
