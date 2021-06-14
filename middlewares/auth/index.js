import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { logger } from '~/utils';
import { status } from '~/constants';
import { LoginSessionSchema } from '~/schemas/LoginSession';

dotenv.config();

export const auth = async (req, res, next) => {
  const { UNAUTHROIZED, PRE_CONDITION_FAILED, BAD_REQUEST, FORBIDDEN } = status;

  if (
    !req.headers.authorization ||
    !req.headers.authorization.toLowerCase().includes('bearer')
  )
    return res.json({
      success: false,
      error: {
        code: UNAUTHROIZED,
        message: 'Access Denied! No Token Provided',
      },
    });

  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    const { payload: payLoad } = jwt.decode(accessToken, { complete: true });

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
      { access_token: accessToken },
      { _id: 1 },
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

    req.user = payLoad.user;
    next();
  } catch (e) {
    logger('error', 'Error:', e.message);
    return res.json({
      success: false,
      error: {
        code: BAD_REQUEST,
        message: 'Invalid Token',
      },
    });
  }
};
