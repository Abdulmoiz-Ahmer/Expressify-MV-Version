import testRoutes from './test.route';
import authRoutes from './auth.route';

const publicRoutes = [
  {
    path: '/test',
    route: testRoutes,
  },
  {
    path:'/auth',
    route: authRoutes
  }
];

module.exports = publicRoutes;
