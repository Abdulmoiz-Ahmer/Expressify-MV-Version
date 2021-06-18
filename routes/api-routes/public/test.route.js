import express from 'express';
import { test } from '~/controllers';

const router = express.Router();

//Declared public route of test
router.get('/', test.getTestData);

module.exports = router;
