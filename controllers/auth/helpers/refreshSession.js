import dotenv from 'dotenv';
import { logger } from '~/utils';
import { status } from '~/constants';
import { LoginSessionSchema } from '~/schemas/LoginSession';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();
export const refreshSession = async (req, res) => {
  const { OK, SERVER_ERROR, FORBIDDEN, PRE_CONDITION_FAILED } = status;
  const { refresh_token } = req.headers;
  try {
    const { payload: payLoad } = jwt.decode(refresh_token, {
      complete: true,
    });

    if (new Date(payLoad.exp * 1000) < new Date(Date.now())) {
      return res.json({
        success: false,
        error: {
          code: PRE_CONDITION_FAILED,
          message: 'Token Expired',
        },
      });
    }

    const inDataBase = await LoginSessionSchema.findOne(
      { refresh_token },
      { _id: 1, remember_me: 1, user_id: 1, email: 1 },
    );

    if (!inDataBase || !inDataBase._id) {
      return res.json({
        success: false,
        error: {
          code: FORBIDDEN,
          message: 'Invalid Token',
        },
      });
    }

    const hash = await bcrypt.hash(
      process.env.JWT_SECRET,
      parseInt(process.env.SALT_ROUNDS, 10),
    );

    const access_token = jwt.sign(
      {
        user: {
          user_id: inDataBase.user_id,
          email: inDataBase.email,
        },
      },
      hash,
      {
        expiresIn: '7d',
      },
    );

    const new_refresh_token = jwt.sign(
      {
        user: {
          user_id: inDataBase.user_id,
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

    await LoginSessionSchema.updateOne(
      { _id: inDataBase._id },
      {
        $set: {
          access_token_expiration_timestamp,
          refresh_token_expiration_timestamp,
          access_token,
          refresh_token: new_refresh_token,
        },
      },
    );

    return res.json({
      success: true,
      data: {
        code: OK,
        access_token_expiration_timestamp,
        refresh_token_expiration_timestamp,
        access_token,
        refresh_token,
        remember_me: inDataBase.remember_me,
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
