import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { logger } from '~/utils';
import { status } from '~/constants';

dotenv.config();

export const auth = (req, res, next) => {
  const { UNAUTHROIZED, PRE_CONDITION_FAILED, BAD_REQUEST } = status;
  if (
    !req.headers.authorization ||
    !req.headers.authorization.toLowerCase().includes('bearer')
  )
    res.status(UNAUTHROIZED).send('Access Denied! No Token Provided');

  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    const { payload: payLoad } = jwt.decode(accessToken, { complete: true });

    if (new Date(payLoad.exp * 1000) < new Date(Date.now())) {
      res.json({
        success: true,
        status: PRE_CONDITION_FAILED,
        message: 'Token Expired',
      });
    }

    // const inDataBase = await OAuthUsersModel.findOne(
    //   { access_token: accessToken },
    //   { _id: 1 }
    // );

    // if (!inDataBase || !inDataBase._id) {
    //   return res.json({
    //     success: true,
    //     status: constants.FORBIDDEN,
    //     message: "Invalid Token",
    //   });
    // }

    next();
  } catch (e) {
    logger('error', 'Error:', e.message);
    res.status(BAD_REQUEST).send('Invalid Token');
  }
};
