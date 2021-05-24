import { logger } from '~/utils';
import { status } from '~/constants';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserSchema } from '~/schemas/User';
import { LoginSessionSchema } from '~/schemas/LoginSession';

export const registerUser = async (req, res) => {
  const { OK, SERVER_ERROR, CONFLICT } = status;
  const { email, password } = req.body;
  try {
    const isExisting = await UserSchema.findOne({ email }, { _id: 1 });

    if (isExisting) {
      return res.json({
        success: true,
        message: 'This email is already associated with an account',
        status: CONFLICT,
      });
    }

    const passHash = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS, 10),
    );

    const newUser = new UserSchema({
      email,
      password: passHash,
    });

    await newUser.save();

    const hash = await bcrypt.hash(
      process.env.JWT_SECRET,
      parseInt(process.env.SALT_ROUNDS, 10),
    );

    const access_token = jwt.sign({ user_id: newUser._id }, hash, {
      expiresIn: '7d',
    });

    const refresh_token = jwt.sign({ user_id: newUser._id }, hash, {
      expiresIn: '7d',
    });

    const expirationDate = new Date(
      new Date().setDate(new Date().getDate() + 7),
    );

    const access_token_expiration_timestamp = expirationDate.getTime();
    const refresh_token_expiration_timestamp =
      access_token_expiration_timestamp;

    const newLoginSession = new LoginSessionSchema({
      access_token_expiration_timestamp,
      refresh_token_expiration_timestamp,
      access_token,
      refresh_token,
      user_id: newUser._id,
    });

    await newLoginSession.save();

    return res.json({
      success: true,
      access_token_expiration_timestamp,
      refresh_token_expiration_timestamp,
      access_token,
      refresh_token,
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
