import dotenv from 'dotenv';
import { logger } from '~/utils';
import { status } from '~/constants';
import { UserSchema } from '~/schemas/User';
import bcrypt from 'bcrypt';

dotenv.config();

export const resetPassword = async (req, res) => {
  const { OK, SERVER_ERROR, UNAUTHROIZED } = status;
  const { password, email } = req.body;
  try {
    const isExisting = await UserSchema.findOne({ email }, { _id: 1 });

    if (!isExisting) {
      return res.json({
        success: false,
        status: UNAUTHROIZED,
        message: 'Email does not exist',
      });
    }

    const passHash = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS, 10),
    );

    await UserSchema.updateOne(
      {
        email,
      },
      { $set: { password: passHash } },
    );

    return res.json({
      success: true,
      data: 'updated',
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
