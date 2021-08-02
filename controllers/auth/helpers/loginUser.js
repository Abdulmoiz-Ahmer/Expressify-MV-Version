import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { logger, sendSuccess, sendMessage, sendError } from '~/utils';
import { status } from '~/constants';
import { UserSchema } from '~/schemas/User';

dotenv.config();
export const loginUser = async (request, response) => {
	//  Codes that we might return coming from status
	const { UNAUTHROIZED } = status;

	//  Destructuring email & password from body
	const { email, password } = request.body;

	let { rememberMe } = request.body;

	try {
		//  Making sure that the user exists
		const isExisting = await UserSchema.findOne(
			{ email },
			{ _id: 1, password: 1, name: 1, remember_me: 1 },
		);
		if (!isExisting)
			return sendMessage('Invalid credentials', response, UNAUTHROIZED);

		//  Verifying the password
		const passValidation = await bcrypt.compare(
			password,
			isExisting.password,
		);

		if (!passValidation)
			return sendMessage('Invalid credentials', response, UNAUTHROIZED);

		//  Generating hash for the tokens secret
		const hash = await bcrypt.hash(
			process.env.JWT_SECRET,
			parseInt(process.env.SALT_ROUNDS, 10),
		);

		//  Generating the access token
		const accessToken = jwt.sign(
			{
				user: {
					// eslint-disable-next-line no-underscore-dangle
					user_id: isExisting._id,
					email,
				},
			},
			hash,
			{
				expiresIn: '7d',
			},
		);

		//  Generating the refresh token
		const refreshToken = jwt.sign(
			{
				user: {
					// eslint-disable-next-line no-underscore-dangle
					user_id: isExisting._id,
				},
			},
			hash,
			{
				expiresIn: '7d',
			},
		);

		//  Generating the expiration date for tokens
		const expirationDate = new Date(
			new Date().setDate(new Date().getDate() + 7),
		);

		//  Attaching the timestamps with the tokens
		const accessTokenExpirationTimestamp = expirationDate.getTime();
		const refreshTokenExpirationTimestamp = accessTokenExpirationTimestamp;

		//  Data to save in LoginSessions for future use
		const token = {
			access_token_expiration_timestamp: accessTokenExpirationTimestamp,
			refresh_token_expiration_timestamp: refreshTokenExpirationTimestamp,
			access_token: accessToken,
			refresh_token: refreshToken,
		};

		//  Setting default or otherwise user sent value to remember_me
		if (!rememberMe) rememberMe = isExisting.remember_me;

		//  Saving data in LoginSessions
		await UserSchema.updateOne(
			// eslint-disable-next-line no-underscore-dangle
			{ _id: isExisting._id },
			{ $addToSet: { tokens: token }, remember_me: rememberMe },
		);

		//  Sending response in case everything went well!
		return sendSuccess(
			{ name: isExisting.name, token, remember_me: rememberMe },
			response,
		);
	} catch (exception) {
		//  Log in case of any abnormal crash
		logger('error', 'Error:', exception.message);
		return sendError('Internal Server Error', response, exception);
	}
};
