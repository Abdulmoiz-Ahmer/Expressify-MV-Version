/* eslint-disable import/named */
/* eslint-disable no-unused-vars */
/* eslint-disable import/first */
process.env.NODE_ENV = 'testing';
import server from '../index';

import { test } from './test/index.test';
import { auth } from './auth/index.test';
import { profile } from './profile/index.test';
