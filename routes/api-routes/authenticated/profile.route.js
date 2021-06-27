import express from 'express';
import { profile } from '~/controllers';
import { validate as validation } from '~/middlewares';

const router = express.Router();

//Patch route to password change
//Validation middleware will validate old_password,new_password,confirm_password field before proceeding further
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
 *               old_password:
 *                 type: string
 *                 description: The user's previous password.
 *                 example: Password@88
 *               new_password:
 *                 type: string
 *                 description: The user's new password.
 *                 example: Password@8
 *               confirm_password:
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
