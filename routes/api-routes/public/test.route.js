import express from 'express';
import { test } from '~/controllers';

const router = express.Router();
router.get('/', test.getTestData);

module.exports = router;
