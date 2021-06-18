import testRoutes from './test.route';
import authRoutes from './auth.route';

//General endpoints registering in list
//List is iteratively registered in main index file
//This file has public routes only
const publicRoutes = [
  {
    path: '/test',
    route: testRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
];

module.exports = publicRoutes;
