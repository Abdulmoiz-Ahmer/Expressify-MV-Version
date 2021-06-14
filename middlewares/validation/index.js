import dotenv from 'dotenv';
import Validator from 'validatorjs';
import { status } from '~/constants';

dotenv.config();

export const validate = (req, res, next, data, rules, msg = {}) => {
  const { UNPROCESSABLE_ENTITY } = status;

  const validation = new Validator(data, rules, msg);
  if (validation.fails()) {
    res.send({
      status: false,
      error: {
        code: UNPROCESSABLE_ENTITY,
        message: 'Input Error',
        details: validation.errors.errors,
      },
    });
  } else {
    next();
  }
};
