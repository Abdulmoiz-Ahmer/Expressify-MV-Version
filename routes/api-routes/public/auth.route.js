import express from 'express';
import { auth } from '~/controllers';
import { validate as validation } from '~/middlewares';

const router = express.Router();

//Declared routes that does crud on authentication

//Post route to register user
//Validation middleware will validate email, password, confirm_password fields before proceeding further
router.post(
  '/register',
  (req, res, next) => {
    validation(
      req,
      res,
      next,
      {
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
      },
      {
        email: 'required|string|email',
        password:
          'required|string|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/',
        confirm_password: 'required|same:password',
      },
      {
        'regex.password': `Password should have:
        At least one upper case 
        At least one lower case
        At least one digit
        At least one special character`,
      },
    );
  },
  auth.registerUser,
);

//Post route to login user
//Validation middleware will validate email, password fields before proceeding further
router.post(
  '/login',
  (req, res, next) => {
    validation(
      req,
      res,
      next,
      {
        email: req.body.email,
        password: req.body.password,
      },
      {
        email: 'required|string|email',
        password: 'required|string',
      },
    );
  },
  auth.loginUser,
);

//Put route to refresh token
//Validation middleware will validate email, password fields before proceeding further
router.put(
  '/refresh-session',
  (req, res, next) => {
    validation(
      req,
      res,
      next,
      {
        refresh_token: req.headers.refresh_token,
      },
      {
        refresh_token: 'required|string',
      },
    );
  },
  auth.refreshSession,
);

//Patch route to password recovery
//Validation middleware will validate email field before proceeding further
router.patch(
  '/forgot-password',
  (req, res, next) => {
    validation(
      req,
      res,
      next,
      {
        email: req.headers.email,
      },
      {
        email: 'required|string|email',
      },
    );
  },
  auth.sendCodePasswordRecovery,
);

//Patch route to password recovery
//Validation middleware will validate otp,password,confirm_password field before proceeding further
router.patch(
  '/reset-password',
  (req, res, next) => {
    validation(
      req,
      res,
      next,
      {
        otp: req.body.otp,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
      },
      {
        otp: 'required|string',
        password:
          'required|string|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/',
        confirm_password: 'required|same:password',
      },
    );
  },
  auth.resetPassword,
);

module.exports = router;
