import Validator from 'validatorjs';
import { status } from '~/constants';
import { sendResponse } from '~/utils';


export const validate = (request, response, next, data, rules, msg = {}) => {
	const { BAD_REQUEST } = request;

	//  Accepting 3 params as argument data, rules and msg and making sure that data conforms to the rules
	const validation = new Validator(data, rules, msg);

	//  In case rules are violated
	if (validation.fails()) {
		sendResponse(
			validation.errors.errors,
			response,
			BAD_REQUEST,
			'errors',
		);
	} else {
		next();
	}
};
