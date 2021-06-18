import express from 'express';
import { test } from '~/controllers';

const router = express.Router();

//Declared private/Authenticated route of test
router.get('/', test.getTestData);

module.exports = router;
