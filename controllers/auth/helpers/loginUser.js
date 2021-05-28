import dotenv from 'dotenv';
import { logger } from '~/utils';
import { status } from '~/constants';
import { UserSchema } from '~/schemas/User';
import { LoginSessionSchema } from '~/schemas/LoginSession';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();
export const loginUser = async (req, res) => {
  const { OK, SERVER_ERROR, UNAUTHROIZED } = status;
  const { email, password } = req.body;
  let { remember_me } = req.body;
  try {
    const isExisting = await UserSchema.findOne(
      { email },
      { _id: 1, password },
    );

    if (!isExisting) {
      return res.json({
        success: false,
        status: UNAUTHROIZED,
        message: 'Wrong Credentials',
      });
    }

    const passValidation = await bcrypt.compare(password, isExisting.password);

    if (!passValidation) {
      return res.json({
        success: false,
        status: UNAUTHROIZED,
        message: 'Wrong Credentials',
      });
    }

    const hash = await bcrypt.hash(
      process.env.JWT_SECRET,
      parseInt(process.env.SALT_ROUNDS, 10),
    );

    const access_token = jwt.sign(
      {
        user: {
          user_id: isExisting._id,
          email: email,
        },
      },
      hash,
      {
        expiresIn: '7d',
      },
    );

    const refresh_token = jwt.sign(
      {
        user: {
          user_id: isExisting._id,
        },
      },
      hash,
      {
        expiresIn: '7d',
      },
    );

    const expirationDate = new Date(
      new Date().setDate(new Date().getDate() + 7),
    );

    const access_token_expiration_timestamp = expirationDate.getTime();
    const refresh_token_expiration_timestamp =
      access_token_expiration_timestamp;

    const newSessionObj = {
      access_token_expiration_timestamp,
      refresh_token_expiration_timestamp,
      access_token,
      refresh_token,
      user_id: isExisting._id,
    };

    if (remember_me) newSessionObj.remember_me = remember_me;
    else remember_me = false;

    const newLoginSession = new LoginSessionSchema(newSessionObj);

    await newLoginSession.save();

    return res.json({
      success: true,
      data: {
        access_token_expiration_timestamp,
        refresh_token_expiration_timestamp,
        access_token,
        refresh_token,
        remember_me,
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
