import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { logger } from '~/utils';
import { status } from '~/constants';
import { UserSchema } from '~/schemas/User';

dotenv.config();

export const changePassword = async (req, res) => {
  //Codes that we might return coming from status
  const { OK, SERVER_ERROR, UNAUTHROIZED } = status;

  //Destructuring old_password, new_password from the body
  const { old_password, new_password } = req.body;

  //Destructuring user from the req that we added in auth middleware
  const { user_id } = req.user;

  try {
    //Making sure that the user exists
    const isExisting = await UserSchema.findById(user_id, { password: 1 });

    if (!isExisting) {
      return res.json({
        success: false,
        error: {
          code: UNAUTHROIZED,
          message: 'Email does not exist',
        },
      });
    }

    //Verifying the old password
    const passValidation = await bcrypt.compare(
      old_password,
      isExisting.password,
    );

    if (!passValidation) {
      return res.json({
        success: false,
        error: {
          code: UNAUTHROIZED,
          message: 'Wrong Credentials',
        },
      });
    }

    //Generating hash of the new password

    const passHash = await bcrypt.hash(
      new_password,
      parseInt(process.env.SALT_ROUNDS, 10),
    );

    //Updating the password
    await UserSchema.updateOne(
      {
        _id: new mongoose.Types.ObjectId(isExisting._id),
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
