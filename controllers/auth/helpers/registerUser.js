
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { logger } from '~/utils';
import { status } from '~/constants';
import { UserSchema } from '~/schemas/User';
import { LoginSessionSchema } from '~/schemas/LoginSession';

export const registerUser = async (req, res) => {
  
  //Codes that we might return coming from status
  const { OK, SERVER_ERROR, CONFLICT } = status;

  //Destructuring email & password from body
  const { email, password } = req.body;
  try {
    //Making sure that the user exists
    const isExisting = await UserSchema.findOne({ email }, { _id: 1 });

    if (isExisting) {
      return res.json({
        success: false,
        error: {
          code: CONFLICT,
          message: 'This email is already associated with an account',
        },
      });
    }

    //Generating the hash of the password
    const passHash = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS, 10),
    );

    //Registering the user
    const newUser = new UserSchema({
      email,
      password: passHash,
    });
    await newUser.save();

    //Generating hash for the tokens secret
    const hash = await bcrypt.hash(
      process.env.JWT_SECRET,
      parseInt(process.env.SALT_ROUNDS, 10),
    );

    //Generating the access token
    const access_token = jwt.sign(
      {
        user: {
          user_id: newUser._id,
          email: newUser.email,
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
          user_id: newUser._id,
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
    const newLoginSession = new LoginSessionSchema({
      access_token_expiration_timestamp,
      refresh_token_expiration_timestamp,
      access_token,
      refresh_token,
      user_id: newUser._id,
    });
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
