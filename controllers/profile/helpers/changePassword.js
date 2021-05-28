import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { logger } from '~/utils';
import { status } from '~/constants';
import { UserSchema } from '~/schemas/User';



dotenv.config();

export const changePassword = async (req, res) => {
  const { OK, SERVER_ERROR, UNAUTHROIZED } = status;
  const { old_password, new_password } = req.body;
  const { user_id } = req.user;
  try {
    const isExisting = await UserSchema.findById(user_id, { password: 1 });

    if (!isExisting) {
      return res.json({
        success: false,
        status: UNAUTHROIZED,
        message: 'User does not exist',
      });
    }

    const passValidation = await bcrypt.compare(
      old_password,
      isExisting.password,
    );

    if (!passValidation) {
      return res.json({
        success: false,
        status: UNAUTHROIZED,
        message: 'Wrong Credentials',
      });
    }

    const passHash = await bcrypt.hash(
      new_password,
      parseInt(process.env.SALT_ROUNDS, 10),
    );

    await UserSchema.updateOne(
      {
        _id: new mongoose.Types.ObjectId(isExisting._id),
      },
      { $set: { password: passHash } },
    );

    return res.json({
      success: true,
      data: {
        message: 'Password Changed Successfully',
      },
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
