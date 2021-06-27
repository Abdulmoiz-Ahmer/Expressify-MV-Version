import express from 'express';
import { test } from '~/controllers';

const router = express.Router();

//Declared private/Authenticated route of test
/**
 * @swagger
 * /authTest:
 *   get:
 *     summary: Test call to test authentication.
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
 *                   type: string
 *                   description: working.
 *                   example: working
 *                 status:
 *                   type: integer
 *                   description: code in case everything went well.
 *                   example: 200
 *
 */
router.get('/', test.getTestData);

module.exports = router;
