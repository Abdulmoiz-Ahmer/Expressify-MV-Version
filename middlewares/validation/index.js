import dotenv from 'dotenv';
import Validator from 'validatorjs';
import { status } from '~/constants';

dotenv.config();

export const validate = (req, res, next, data, rules, msg = {}) => {
  const { UNPROCESSABLE_ENTITY } = status;

  //Accepting 3 params as argument data, rules and msg and making sure that data conforms to the rules
  const validation = new Validator(data, rules, msg);

  //In case rules are voilated
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
