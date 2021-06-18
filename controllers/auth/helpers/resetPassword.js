import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { logger } from '~/utils';
import { status } from '~/constants';
import { UserSchema } from '~/schemas/User';
import { OtpsSchema } from '~/schemas/Otps';

dotenv.config();

export const resetPassword = async (req, res) => {
  
  //Codes that we might return coming from status
  const { OK, SERVER_ERROR, UNAUTHROIZED } = status;

  //Destructuring otp, password from body
  const { password, otp } = req.body;

  try {
    //Making sure the otp exists
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

    //Verifying that the otp is not manually expired
    if (existingOtp.status === 'expired')
      return res.json({
        success: false,
        error: {
          code: UNAUTHROIZED,
          message: 'Code Expired',
        },
      });

    //Verifying that the otp is not expired
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

    //Expiring the current otp
    await OtpsSchema.updateOne(
      {
        otp: otp,
      },
      { $set: { status: 'expired' } },
    );

    //Generating the hash of password
    const passHash = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS, 10),
    );

    //Updating the password
    await UserSchema.updateOne(
      {
        _id: new mongoose.Types.ObjectId(existingOtp.user_id),
      },
      { $set: { password: passHash } },
    );

    //Sending response in case everything went well!
    return res.json({
      success: true,
      data: {
        code: OK,
        message: 'Password Changed Successfully',
      },
    });
  } catch (e) {
    //Log in case of any abnormal crash
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
