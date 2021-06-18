import express from 'express';

import { auth } from '../middlewares/auth';
import publicRoutes from './api-routes/public';
import authenticatedRoutes from './api-routes/authenticated';

const router = express.Router();
//Prefix
const prefix = '/api';

//API version
const v1 = `${prefix}/v1`;

//Registering the routes with the router (Public Routes)
publicRoutes.forEach((route) => {
  router.use(v1 + route.path, route.route);
});

//Registering the routes with the router (Private Routes)
//Auth Middleware Attached
authenticatedRoutes.forEach((route) => {
  router.use(v1 + route.path, auth, route.route);
});

module.exports = router;
