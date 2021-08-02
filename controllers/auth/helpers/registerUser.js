import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { logger, sendSuccess, sendMessage, sendError } from '~/utils';
import { status } from '~/constants';
import { UserSchema } from '~/schemas/User';

export const registerUser = async (request, response) => {
	//  Codes that we might return coming from status
	const { UNPROCESSABLE_ENTITY } = status;

	//  Destructuring email & password from body
	const { email, password, name } = request.body;
	try {
		//  Making sure that the user exists
		const isExisting = await UserSchema.findOne({ email }, { _id: 1 });

		if (isExisting) {
			return sendMessage(
				'Email already exists',
				response,
				UNPROCESSABLE_ENTITY,
			);
		}

		//  Generating the hash of the password
		const passHash = await bcrypt.hash(
			password,
			parseInt(process.env.SALT_ROUNDS, 10),
		);

		//  Registering the user
		const newUser = new UserSchema({
			email,
			password: passHash,
			name,
		});
		await newUser.save();

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
					user_id: newUser._id,
					email: newUser.email,
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
					user_id: newUser._id,
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

		const token = {
			access_token_expiration_timestamp: accessTokenExpirationTimestamp,
			refresh_token_expiration_timestamp: refreshTokenExpirationTimestamp,
			access_token: accessToken,
			refresh_token: refreshToken,
		};

		await UserSchema.updateOne(
			// eslint-disable-next-line no-underscore-dangle
			{ _id: newUser._id },
			{ $addToSet: { tokens: token } },
		);

		//  Sending response in case everything went well!
		return sendSuccess({ name, token }, response);
	} catch (exception) {
		//  Log in case of any abnormal crash
		logger('error', 'Error:', exception.message);

		return sendError('Internal Server Error', response, exception);
	}
};
