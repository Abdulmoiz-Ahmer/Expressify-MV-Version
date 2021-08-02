import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { logger, sendSuccess, sendMessage, sendError } from '~/utils';
import { status } from '~/constants';
import { UserSchema } from '~/schemas/User';

dotenv.config();

export const changePassword = async (request, response) => {
	//  Codes that we might return coming from status
	const { UNAUTHROIZED } = status;

	//  Destructuring old_password, new_password from the body
	const { oldPassword, newPassword } = request.body;

	//  Destructuring user from the req that we added in auth middleware
	const { user_id: userId } = request.user;

	try {
		//  Making sure that the user exists
		const isExisting = await UserSchema.findById(userId, { password: 1 });

		if (!isExisting)
			return sendMessage('Wrong Credentials', response, UNAUTHROIZED);

		//  Verifying the old password
		const passValidation = await bcrypt.compare(
			oldPassword,
			isExisting.password,
		);

		if (!passValidation)
			return sendMessage('Wrong Credentials!', response, UNAUTHROIZED);

		//  Generating hash of the new password

		const passHash = await bcrypt.hash(
			newPassword,
			parseInt(process.env.SALT_ROUNDS, 10),
		);

		//  Updating the password
		await UserSchema.updateOne(
			{
				// eslint-disable-next-line no-underscore-dangle
				_id: new mongoose.Types.ObjectId(isExisting._id),
			},
			{ $set: { password: passHash } },
		);

		//  Sending response in case everything went well!
		return sendSuccess(
			{ message: 'Password Changed Successfully' },
			response,
		);
	} catch (exception) {
		//  Log in case of any abnormal crash
		logger('error', 'Error:', exception.message);
		return sendError('Internal Server Error', response, exception);
	}
};
