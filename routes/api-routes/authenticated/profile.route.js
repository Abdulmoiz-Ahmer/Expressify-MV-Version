import express from 'express';
import { profile } from '~/controllers';
import { validate as validation } from '~/middlewares';

const router = express.Router();

//Patch route to password change
//Validation middleware will validate old_password,new_password,confirm_password field before proceeding further
router.patch(
  '/change-password',
  (req, res, next) => {
    validation(
      req,
      res,
      next,
      {
        old_password: req.body.old_password,
        new_password: req.body.new_password,
        confirm_password: req.body.confirm_password,
      },
      {
        old_password: 'required|string',
        new_password:
          'required|string|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/',
        confirm_password: 'required|same:new_password',
      },
    );
  },
  profile.changePassword,
);

module.exports = router;
