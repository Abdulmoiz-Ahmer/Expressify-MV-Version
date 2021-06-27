import express from 'express';

import { auth } from '../middlewares/auth';
import publicRoutes from './api-routes/public';
import authenticatedRoutes from './api-routes/authenticated';
import { authorize } from '../middlewares/authorize';

const router = express.Router();

//API version
const version = `/${process.env.BASE_URL}/${process.env.VERSION}`;

//Registering the routes with the router (Public Routes)
publicRoutes.forEach((route) => {
  router.use(version + route.path, authorize, route.route);
});

//Registering the routes with the router (Private Routes)
//Auth Middleware Attached
authenticatedRoutes.forEach((route) => {
  router.use(version + route.path, authorize, auth, route.route);
});

module.exports = router;
