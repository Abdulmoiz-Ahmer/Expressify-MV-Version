import dotenv from 'dotenv';
import Validator from 'validatorjs';
import { status } from '~/constants';

dotenv.config();

export const validate = (req, res, next, data, rules) => {
  const { UNPROCESSABLE_ENTITY } = status;

  const validation = new Validator(data, rules);
  if (validation.fails()) {
    res.send({
      status: UNPROCESSABLE_ENTITY,
      message: validation.errors.errors,
    });
  }
  next();
};
