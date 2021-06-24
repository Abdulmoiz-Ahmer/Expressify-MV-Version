import dotenv from 'dotenv';
import { logger } from '~/utils';
import { status } from '~/constants';

dotenv.config();

export const authorize = (req, res, next) => {
  //Codes that we might return coming from status
  const { FORBIDDEN } = status;

  try {
    // Expecting api key field in header
    if (
      !req.headers['x-api-key'] ||
      req.headers['x-api-key'] !== process.env.API_KEY
    )
      return res.json({
        success: false,
        error: {
          code: FORBIDDEN,
          message: 'Access Denied!',
        },
      });
    next();
  } catch (e) {
    //Log in case of any abnormal crash
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
