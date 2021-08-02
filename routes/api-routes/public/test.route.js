import express from 'express';
import { test } from '~/controllers';

const router = express.Router();

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Test call to test api.
 *     tags:
 *      - Public Routes
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
