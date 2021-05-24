import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { logger } from '~/utils';
import { status } from '~/constants';
import { UserSchema } from '~/schemas/User';
import { OtpsSchema } from '~/schemas/Otps';

dotenv.config();

export const confirmCodePasswordRecovery = async (req, res) => {
  const { OK, SERVER_ERROR, UNAUTHROIZED } = status;
  const { email, otp } = req.headers;

  try {
    const isExisting = await UserSchema.findOne({ email }, { _id: 1 });

    if (!isExisting) {
      return res.json({
        success: false,
        status: UNAUTHROIZED,
        message: 'Email does not exist',
      });
    }

    const existingOtp = await OtpsSchema.findOne({
      user_id: new mongoose.Types.ObjectId(isExisting._id),
      otp: otp,
    });

    if (!existingOtp) {
      return res.json({
        success: false,
        status: UNAUTHROIZED,
        message: 'Invalid Code',
      });
    }

    if (existingOtp.status === 'expired')
      return res.json({
        success: false,
        status: UNAUTHROIZED,
        message: 'Code Expired',
      });

    if (
      (new Date().valueOf() - existingOtp.otp_expiration_timestamp.valueOf()) /
        1000 /
        60 /
        60 >
      1
    ) {
      return res.json({
        success: false,
        status: UNAUTHROIZED,
        message: 'Code Expired',
      });
    }

    await OtpsSchema.updateOne(
      {
        otp: otp,
        user_id: new mongoose.Types.ObjectId(isExisting._id),
      },
      { $set: { status: 'expired' } },
    );

    return res.json({
      success: true,
      data: true,
      status: OK,
    });
    
  } catch (e) {
    logger('error', 'Error:', e.message);
    return res.json({
      status: SERVER_ERROR,
      success: false,
      message: 'Internal Server Error',
    });
  }
};
