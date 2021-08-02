import express from 'express';
import { profile } from '~/controllers';
import { validate as validation } from '~/middlewares';

const router = express.Router();

//  Patch route to password change
//  Validation middleware will validate old_password,new_password,confirm_password field before proceeding further
/**
 * @swagger
 * /profile-settings/change-password:
 *   patch:
 *     summary: Api call for the logged in user to change password.
 *     tags:
 *      - Authenticated Routes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The user's previous password.
 *                 example: Password@88
 *               newPassword:
 *                 type: string
 *                 description: The user's new password.
 *                 example: Password@8
 *               confirmPassword:
 *                 type: string
 *                 description: The user's new password again.
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
	'/change-password',
	(request, response, next) => {
		validation(
			request,
			response,
			next,
			{
				oldPassword: request.body.oldPassword,
				newPassword: request.body.newPassword,
				confirmPassword: request.body.confirmPassword,
			},
			{
				oldPassword: 'required|string',
				newPassword:
					'required|string|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/',
				confirmPassword: 'required|same:newPassword',
			},
		);
	},
	profile.changePassword,
);

module.exports = router;
