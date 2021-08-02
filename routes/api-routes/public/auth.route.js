import express from 'express';
import { auth } from '~/controllers';
import { validate as validation } from '~/middlewares';

const router = express.Router();

//  Declared routes that does crud on authentication

//  Post route to register user
//  Validation middleware will validate email, password, confirm_password fields before proceeding further
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
 *               confirmPassword:
 *                 type: string
 *                 description: The user's password again.
 *                 example: Password@8
 *               name:
 *                 type: object
 *                 properties:
 *                   first:
 *                     type: string
 *                     description: The user's first name.
 *                     example: Abd Allah
 *                   last:
 *                     type: string
 *                     description: The user's first name.
 *                     example: Quraish
 *     responses:
 *       200:
 *         description: working.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: object
 *                       properties:
 *                         access_token_expiration_timestamp:
 *                           type: number
 *                           description: Current date time in timestamp format.
 *                           example: 1625257866377
 *                         refresh_token_expiration_timestamp:
 *                           type: number
 *                           description: Current date time in timestamp format.
 *                           example: 1625257866377
 *                         access_token:
 *                           type: string
 *                           description: Token to be used for all auth calls.
 *                           example: yJhbGciOiJIUzI1NiIsInR8cCI6IkpXVCJ0.eyJ1c2VyIjp7InVzZXJfaWQiOiI2MGQ4YmFiMDYwY2U2NzJlYWQzYzZiMTIiLCJlbWFpbCI6IndpbGx5d29ua2ExMUBnbWFpbC5jb20ifSwiaWF0IjoxNjI0ODE2MzA1LCJleHAiasd2MjU0MjExMDV9.PxYcR-XcrmYx52heYLi2CFOjkmi8GnkJxGY8ypc2TNA
 *                         refresh_token:
 *                           type: string
 *                           description: Token to be used for refreshing the access token.
 *                           example: yJhbGciOiJIUzI1NiIsInR8cCI6IkpXVCJ0.eyJ1c2VyIjp7InVzZXJfaWQiOiI2MGQ4YmFiMDYwY2U2NzJlYWQzYzZiMTIiLCJlbWFpbCI6IndpbGx5d29ua2ExMUBnbWFpbC5jb20ifSwiaWF0IjoxNjI0ODE2MzA1LCJleHAiasd2MjU0MjExMDV9.PxYcR-XcrmYx52heYLi2CFOjkmi8GnkJxGY8ypc2TNA
 *                     name:
 *                       type: object
 *                       properties:
 *                         first:
 *                           type: string
 *                           description: The user's first name.
 *                           example: Abd Allah
 *                         last:
 *                           type: string
 *                           description: The user's first name.
 *                           example: Quraish
 *
 */
router.post(
	'/register',
	(request, response, next) => {
		validation(
			request,
			response,
			next,
			{
				email: request.body.email,
				password: request.body.password,
				confirmPassword: request.body.confirmPassword,
				name: request.body.name,
			},
			{
				name: 'required',
				'name.first': 'required|string',
				'name.last': 'required|string',
				email: 'required|string|email',
				password:
					'required|string|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/',
				confirmPassword: 'required|same:password',
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

//  Post route to login user
//  Validation middleware will validate email, password fields before proceeding further
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
 *               rememberMe:
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
 *                 results:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: object
 *                       properties:
 *                         access_token_expiration_timestamp:
 *                           type: number
 *                           description: Current date time in timestamp format.
 *                           example: 1625257866377
 *                         refresh_token_expiration_timestamp:
 *                           type: number
 *                           description: Current date time in timestamp format.
 *                           example: 1625257866377
 *                         access_token:
 *                           type: string
 *                           description: Token to be used for all auth calls.
 *                           example: yJhbGciOiJIUzI1NiIsInR8cCI6IkpXVCJ0.eyJ1c2VyIjp7InVzZXJfaWQiOiI2MGQ4YmFiMDYwY2U2NzJlYWQzYzZiMTIiLCJlbWFpbCI6IndpbGx5d29ua2ExMUBnbWFpbC5jb20ifSwiaWF0IjoxNjI0ODE2MzA1LCJleHAiasd2MjU0MjExMDV9.PxYcR-XcrmYx52heYLi2CFOjkmi8GnkJxGY8ypc2TNA
 *                         refresh_token:
 *                           type: string
 *                           description: Token to be used for refreshing the access token.
 *                           example: yJhbGciOiJIUzI1NiIsInR8cCI6IkpXVCJ0.eyJ1c2VyIjp7InVzZXJfaWQiOiI2MGQ4YmFiMDYwY2U2NzJlYWQzYzZiMTIiLCJlbWFpbCI6IndpbGx5d29ua2ExMUBnbWFpbC5jb20ifSwiaWF0IjoxNjI0ODE2MzA1LCJleHAiasd2MjU0MjExMDV9.PxYcR-XcrmYx52heYLi2CFOjkmi8GnkJxGY8ypc2TNA
 *                     name:
 *                       type: object
 *                       properties:
 *                         first:
 *                           type: string
 *                           description: The user's first name.
 *                           example: Abd Allah
 *                         last:
 *                           type: string
 *                           description: The user's first name.
 *                           example: Quraish
 *                     remember_me:
 *                       type: boolean
 *                       description: Remember me value.
 *                       example: false
 *
 */
router.post(
	'/login',
	(request, response, next) => {
		validation(
			request,
			response,
			next,
			{
				email: request.body.email,
				password: request.body.password,
			},
			{
				email: 'required|string|email',
				password: 'required|string',
			},
		);
	},
	auth.loginUser,
);

//  Put route to refresh token
//  Validation middleware will validate email, password fields before proceeding further
/**
 * @swagger
 * /auth/refresh-session:
 *   put:
 *     summary: Api call for the user to renew the access token.
 *     tags:
 *       - Authenticated Routes
 *     parameters:
 *       - in: header
 *         name: refreshToken
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
 *                 results:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: object
 *                       properties:
 *                         access_token_expiration_timestamp:
 *                           type: number
 *                           description: Current date time in timestamp format.
 *                           example: 1625257866377
 *                         refresh_token_expiration_timestamp:
 *                           type: number
 *                           description: Current date time in timestamp format.
 *                           example: 1625257866377
 *                         access_token:
 *                           type: string
 *                           description: Token to be used for all auth calls.
 *                           example: yJhbGciOiJIUzI1NiIsInR8cCI6IkpXVCJ0.eyJ1c2VyIjp7InVzZXJfaWQiOiI2MGQ4YmFiMDYwY2U2NzJlYWQzYzZiMTIiLCJlbWFpbCI6IndpbGx5d29ua2ExMUBnbWFpbC5jb20ifSwiaWF0IjoxNjI0ODE2MzA1LCJleHAiasd2MjU0MjExMDV9.PxYcR-XcrmYx52heYLi2CFOjkmi8GnkJxGY8ypc2TNA
 *                         refresh_token:
 *                           type: string
 *                           description: Token to be used for refreshing the access token.
 *                           example: yJhbGciOiJIUzI1NiIsInR8cCI6IkpXVCJ0.eyJ1c2VyIjp7InVzZXJfaWQiOiI2MGQ4YmFiMDYwY2U2NzJlYWQzYzZiMTIiLCJlbWFpbCI6IndpbGx5d29ua2ExMUBnbWFpbC5jb20ifSwiaWF0IjoxNjI0ODE2MzA1LCJleHAiasd2MjU0MjExMDV9.PxYcR-XcrmYx52heYLi2CFOjkmi8GnkJxGY8ypc2TNA
 *                         remember_me:
 *                           type: boolean
 *                           description: Remember me value.
 *                           example: false
 *
 */
router.put(
	'/refresh-session',
	(request, response, next) => {
		validation(
			request,
			response,
			next,
			{
				refreshToken: request.get('refreshToken'),
			},
			{
				refreshToken: 'required|string',
			},
		);
	},
	auth.refreshSession,
);

//  Patch route to password recovery
//  Validation middleware will validate email field before proceeding further
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
 *                 results:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Message stating the status of request.
 *                       example: Otp sent please check your email
 *                     otp:
 *                       type: string
 *                       description: One time password sent to email.
 *                       example: 80b254b7b8af437f789kk234f15b931c938d513d45504a24025548f99cd0c4
 *
 */
router.patch(
	'/forgot-password',
	(request, response, next) => {
		validation(
			request,
			response,
			next,
			{
				email: request.headers.email,
			},
			{
				email: 'required|string|email',
			},
		);
	},
	auth.sendCodePasswordRecovery,
);

//  Patch route to password recovery
//  Validation middleware will validate otp,password,confirm_password field before proceeding further
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
 *               confirmPassword:
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
 *                 results:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Message stating the status of request.
 *                       example: Password Changed Successfully
 *
 */
router.patch(
	'/reset-password',
	(request, response, next) => {
		validation(
			request,
			response,
			next,
			{
				otp: request.body.otp,
				password: request.body.password,
				confirmPassword: request.body.confirmPassword,
			},
			{
				otp: 'required|string',
				password:
					'required|string|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/',
				confirmPassword: 'required|same:password',
			},
		);
	},
	auth.resetPassword,
);

module.exports = router;
