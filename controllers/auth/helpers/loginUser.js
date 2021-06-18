import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { logger } from '~/utils';
import { status } from '~/constants';
import { UserSchema } from '~/schemas/User';
import { LoginSessionSchema } from '~/schemas/LoginSession';

dotenv.config();
export const loginUser = async (req, res) => {
  //Codes that we might return coming from status
  const { OK, SERVER_ERROR, UNAUTHROIZED } = status;

  //Destructuring email, remember_me & password from body
  const { email, password } = req.body;
  let { remember_me } = req.body;

  try {
    //Making sure that the user exists
    const isExisting = await UserSchema.findOne(
      { email },
      { _id: 1, password },
    );

    if (!isExisting) {
      return res.json({
        success: false,
        error: {
          code: UNAUTHROIZED,
          message: 'Wrong Credentials',
        },
      });
    }

    //Verifying the password
    const passValidation = await bcrypt.compare(password, isExisting.password);

    if (!passValidation) {
      return res.json({
        success: false,
        error: {
          code: UNAUTHROIZED,
          message: 'Wrong Credentials',
        },
      });
    }

    //Generating hash for the tokens secret
    const hash = await bcrypt.hash(
      process.env.JWT_SECRET,
      parseInt(process.env.SALT_ROUNDS, 10),
    );

    //Generating the access token
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

    //Generating the refresh token
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

    //Generating the expiration date for tokens
    const expirationDate = new Date(
      new Date().setDate(new Date().getDate() + 7),
    );

    //Attaching the timestamps with the tokens
    const access_token_expiration_timestamp = expirationDate.getTime();
    const refresh_token_expiration_timestamp =
      access_token_expiration_timestamp;

    //Data to save in LoginSessions for future use
    const newSessionObj = {
      access_token_expiration_timestamp,
      refresh_token_expiration_timestamp,
      access_token,
      refresh_token,
      user_id: isExisting._id,
    };

    //Setting default or otherwise user sent value to remember_me
    if (remember_me) newSessionObj.remember_me = remember_me;
    else remember_me = false;

    //Saving data in LoginSessions
    const newLoginSession = new LoginSessionSchema(newSessionObj);
    await newLoginSession.save();

    //Sending response in case everything went well!
    return res.json({
      success: true,
      data: {
        code: OK,
        access_token_expiration_timestamp,
        refresh_token_expiration_timestamp,
        access_token,
        refresh_token,
        remember_me,
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
