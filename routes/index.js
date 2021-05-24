import express from 'express';
import { auth } from '../middlewares/auth';
import publicRoutes from './api-routes/public';
import authenticatedRoutes from './api-routes/authenticated';

const router = express.Router();
const prefix = '/api';
const v1 = `${prefix}/v1`;

publicRoutes.forEach((route) => {
  router.use(v1 + route.path, route.route);
});

authenticatedRoutes.forEach((route) => {
  router.use(v1 + route.path, auth, route.route);
});

module.exports = router;
