import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { logger, sendSuccess, sendMessage, sendError } from '~/utils';
import { status } from '~/constants';
import { UserSchema } from '~/schemas/User';
import { OtpsSchema } from '~/schemas/Otps';

export const resetPassword = async (request, response) => {
	//  Codes that we might return coming from status
	const { UNAUTHROIZED } = status;

	//  Destructuring otp, password from body
	const { password, otp } = request.body;

	try {
		//  Making sure the otp exists
		const existingOtp = await OtpsSchema.findOne({
			otp,
		});

		if (!existingOtp)
			return sendMessage('Invalid Code', response, UNAUTHROIZED);

		//  Verifying that the otp is not manually expired
		if (existingOtp.status === 'expired')
			return sendMessage('Code Expired', response, UNAUTHROIZED);

		//  Verifying that the otp is not expired
		if (
			(new Date().valueOf() -
				existingOtp.otp_expiration_timestamp.valueOf()) /
				1000 /
				60 /
				60 >
			1
		)
			return sendMessage('Code Expired', response, UNAUTHROIZED);

		//  Expiring the current otp
		await OtpsSchema.updateOne(
			{
				otp,
			},
			{ $set: { status: 'expired' } },
		);

		//  Generating the hash of password
		const passHash = await bcrypt.hash(
			password,
			parseInt(process.env.SALT_ROUNDS, 10),
		);

		//  Updating the password
		await UserSchema.updateOne(
			{
				_id: new mongoose.Types.ObjectId(existingOtp.user_id),
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
