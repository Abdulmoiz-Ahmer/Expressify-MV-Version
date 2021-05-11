import express from 'express';
// import authMiddleware from '../middlewares/auth';
import publicRoutes from './api-routes/public';

const router = express.Router();
const prefix = '/api';
const v1 = `${prefix}/v1`;

publicRoutes.forEach((route) => {
  router.use(v1 + route.path, route.route);
});

module.exports = router;
