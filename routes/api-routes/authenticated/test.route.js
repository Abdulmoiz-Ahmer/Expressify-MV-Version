import express from 'express';
import { test } from '~/controllers';

const router = express.Router();

//  Declared private/Authenticated route of test
/**
 * @swagger
 * /authTest:
 *   get:
 *     summary: Test call to test authentication.
 *     tags:
 *      - Authenticated Routes
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
 *                       description: working.
 *                       example: Working
 *
 */
router.get('/', test.getTestData);

module.exports = router;
