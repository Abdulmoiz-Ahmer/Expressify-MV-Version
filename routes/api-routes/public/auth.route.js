import express from 'express';
import { auth } from '~/controllers';
import { validate as validation } from '~/middlewares';

const router = express.Router();

//Declared routes that does crud on authentication

//Post route to register user
//Validation middleware will validate email, password, confirm_password fields before proceeding further
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Api call for registration of the user.
 *     tags:
 *      - Public Routes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: willywonka@gmail.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: Password@8
 *               confirm_password:
 *                 type: string
 *                 description: The user's password again.
 *                 example: Password@8
 *     responses:
 *       200:
 *         description: working.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Either True or False.
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       description: One of the http response codes.
 *                       example: 200
 *                     access_token_expiration_timestamp:
 *                       type: number
 *                       description: Current date time in timestamp format.
 *                       example: 1625257866377
 *                     refresh_token_expiration_timestamp:
 *                       type: number
 *                       description: Current date time in timestamp format.
 *                       example: 1625257866377
 *                     access_token:
 *                       type: string
 *                       description: Token to be used for all auth calls.
 *                       example: yJhbGciOiJIUzI1NiIsInR8cCI6IkpXVCJ0.eyJ1c2VyIjp7InVzZXJfaWQiOiI2MGQ4YmFiMDYwY2U2NzJlYWQzYzZiMTIiLCJlbWFpbCI6IndpbGx5d29ua2ExMUBnbWFpbC5jb20ifSwiaWF0IjoxNjI0ODE2MzA1LCJleHAiasd2MjU0MjExMDV9.PxYcR-XcrmYx52heYLi2CFOjkmi8GnkJxGY8ypc2TNA
 *                     refresh_token:
 *                       type: string
 *                       description: Token to be used for refreshing the access token.
 *                       example: yJhbGciOiJIUzI1NiIsInR8cCI6IkpXVCJ0.eyJ1c2VyIjp7InVzZXJfaWQiOiI2MGQ4YmFiMDYwY2U2NzJlYWQzYzZiMTIiLCJlbWFpbCI6IndpbGx5d29ua2ExMUBnbWFpbC5jb20ifSwiaWF0IjoxNjI0ODE2MzA1LCJleHAiasd2MjU0MjExMDV9.PxYcR-XcrmYx52heYLi2CFOjkmi8GnkJxGY8ypc2TNA
 *
 */
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
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Api call for the user to logged in to the application.
 *     tags:
 *      - Public Routes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: willywonka@gmail.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: Password@8
 *               remember_me:
 *                 type: boolean
 *                 description: Would you want the credentials to be remembered.
 *                 example: false
 *     responses:
 *       200:
 *         description: working.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Either True or False.
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       description: One of the http response codes.
 *                       example: 200
 *                     access_token_expiration_timestamp:
 *                       type: number
 *                       description: Current date time in timestamp format.
 *                       example: 1625257866377
 *                     refresh_token_expiration_timestamp:
 *                       type: number
 *                       description: Current date time in timestamp format.
 *                       example: 1625257866377
 *                     access_token:
 *                       type: string
 *                       description: Token to be used for all auth calls.
 *                       example: yJhbGciOiJIUzI1NiIsInR8cCI6IkpXVCJ0.eyJ1c2VyIjp7InVzZXJfaWQiOiI2MGQ4YmFiMDYwY2U2NzJlYWQzYzZiMTIiLCJlbWFpbCI6IndpbGx5d29ua2ExMUBnbWFpbC5jb20ifSwiaWF0IjoxNjI0ODE2MzA1LCJleHAiasd2MjU0MjExMDV9.PxYcR-XcrmYx52heYLi2CFOjkmi8GnkJxGY8ypc2TNA
 *                     refresh_token:
 *                       type: string
 *                       description: Token to be used for refreshing the access token.
 *                       example: yJhbGciOiJIUzI1NiIsInR8cCI6IkpXVCJ0.eyJ1c2VyIjp7InVzZXJfaWQiOiI2MGQ4YmFiMDYwY2U2NzJlYWQzYzZiMTIiLCJlbWFpbCI6IndpbGx5d29ua2ExMUBnbWFpbC5jb20ifSwiaWF0IjoxNjI0ODE2MzA1LCJleHAiasd2MjU0MjExMDV9.PxYcR-XcrmYx52heYLi2CFOjkmi8GnkJxGY8ypc2TNA
 *                     remember_me:
 *                       type: boolean
 *                       description: Remember me value.
 *                       example: false
 *
 */
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
/**
 * @swagger
 * /auth/refresh-session:
 *   put:
 *     summary: Api call for the user to renew the access token.
 *     tags:
 *       - Authenticated Routes
 *     parameters:
 *       - in: header
 *         name: refresh_token
 *         required: true
 *         description: Refresh Token provided on login, register or previous refresh session.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: working.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Either True or False.
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       description: One of the http response codes.
 *                       example: 200
 *                     access_token_expiration_timestamp:
 *                       type: number
 *                       description: Current date time in timestamp format.
 *                       example: 1625257866377
 *                     refresh_token_expiration_timestamp:
 *                       type: number
 *                       description: Current date time in timestamp format.
 *                       example: 1625257866377
 *                     access_token:
 *                       type: string
 *                       description: Token to be used for all auth calls.
 *                       example: yJhbGciOiJIUzI1NiIsInR8cCI6IkpXVCJ0.eyJ1c2VyIjp7InVzZXJfaWQiOiI2MGQ4YmFiMDYwY2U2NzJlYWQzYzZiMTIiLCJlbWFpbCI6IndpbGx5d29ua2ExMUBnbWFpbC5jb20ifSwiaWF0IjoxNjI0ODE2MzA1LCJleHAiasd2MjU0MjExMDV9.PxYcR-XcrmYx52heYLi2CFOjkmi8GnkJxGY8ypc2TNA
 *                     refresh_token:
 *                       type: string
 *                       description: Token to be used for refreshing the access token.
 *                       example: yJhbGciOiJIUzI1NiIsInR8cCI6IkpXVCJ0.eyJ1c2VyIjp7InVzZXJfaWQiOiI2MGQ4YmFiMDYwY2U2NzJlYWQzYzZiMTIiLCJlbWFpbCI6IndpbGx5d29ua2ExMUBnbWFpbC5jb20ifSwiaWF0IjoxNjI0ODE2MzA1LCJleHAiasd2MjU0MjExMDV9.PxYcR-XcrmYx52heYLi2CFOjkmi8GnkJxGY8ypc2TNA
 *                     remember_me:
 *                       type: boolean
 *                       description: Remember me value.
 *                       example: false
 *
 */
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
/**
 * @swagger
 * /auth/forgot-password:
 *   patch:
 *     summary: Api call of the password recovery request(sent email).
 *     tags:
 *      - Public Routes
 *     parameters:
 *       - in: header
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: working.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Either True or False.
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       description: One of the http response codes.
 *                       example: 200
 *                     message:
 *                       type: string
 *                       description: Message stating the status of request.
 *                       example: Otp sent please check your email
 *
 */
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
/**
 * @swagger
 * /auth/reset-password:
 *   patch:
 *     summary: Api call to reset password using the code sent via email through /forgot-password request.
 *     tags:
 *      - Public Routes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 description: The code sent via email.
 *                 example:
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: Password@8
 *               confirm_password:
 *                 type: string
 *                 description: The user's password.
 *                 example: Password@8
 *     responses:
 *       200:
 *         description: working.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Either True or False.
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       description: One of the http response codes.
 *                       example: 200
 *                     message:
 *                       type: string
 *                       description: Message stating the status of request.
 *                       example: Password Changed Successfully
 *
 */
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
