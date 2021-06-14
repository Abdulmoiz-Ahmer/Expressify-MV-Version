import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { logger } from '~/utils';
import { status } from '~/constants';
import { UserSchema } from '~/schemas/User';
import { OtpsSchema } from '~/schemas/Otps';
import bcrypt from 'bcrypt';

dotenv.config();

export const resetPassword = async (req, res) => {
  const { OK, SERVER_ERROR, UNAUTHROIZED } = status;
  const { password, otp } = req.body;
  try {
    const existingOtp = await OtpsSchema.findOne({
      otp: otp,
    });

    if (!existingOtp) {
      return res.json({
        success: false,
        error: {
          code: UNAUTHROIZED,
          message: 'Invalid Code',
        },
      });
    }

    if (existingOtp.status === 'expired')
      return res.json({
        success: false,
        error: {
          code: UNAUTHROIZED,
          message: 'Code Expired',
        },
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
        error: {
          code: UNAUTHROIZED,
          message: 'Code Expired',
        },
      });
    }

    await OtpsSchema.updateOne(
      {
        otp: otp,
      },
      { $set: { status: 'expired' } },
    );

    const passHash = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS, 10),
    );

    await UserSchema.updateOne(
      {
        _id: new mongoose.Types.ObjectId(existingOtp.user_id),
      },
      { $set: { password: passHash } },
    );

    return res.json({
      success: true,
      data: {
        code: OK,
        message: 'Password Changed Successfully',
      },
    });
  } catch (e) {
    logger('error', 'Error:', e.message);
    return res.json({
      success: false,
      error: {
        code: SERVER_ERROR,
        message: 'Internal Server Error',
      },
    });
  }
};
