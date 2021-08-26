import mongoose from 'mongoose';
import { logger, sendSuccess, sendMessage, sendError } from '~/utils';
import { status } from '~/constants';
import { UserSchema } from '~/schemas/User';

export const resetPassword = async (request, response) => {
	//  Codes that we might return coming from status
	const { UNAUTHORIZED } = status;

	//  Destructuring otp, password from body
	const { password, otp } = request.body;

	try {
		//  Making sure the otp exists
		const existingOtp = await UserSchema.findOne(
			{
				'otps.code': otp,
			},
			{ 'otps.$': 1 },
		);

		if (!existingOtp.otps.length === 0)
			return sendMessage('Invalid Code', response, UNAUTHORIZED);

		//  Verifying that the otp is not manually expired
		if (existingOtp.otps[0]?.status === 'expired')
			return sendMessage('Code Expired', response, UNAUTHORIZED);

		//  Verifying that the otp is not expired
		if (
			(new Date().valueOf() -
				existingOtp.otps[0].expiration_timestamp.valueOf()) /
				1000 /
				60 /
				60 >
			1
		)
			return sendMessage('Code Expired', response, UNAUTHORIZED);

		//  Updating the password and expiring statuses
		await UserSchema.updateOne(
			{
				// eslint-disable-next-line no-underscore-dangle
				_id: mongoose.Types.ObjectId(existingOtp._id),
				'otps.status': 'sent',
			},
			{ $set: { password, 'otps.$.status': 'expired' } },
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
