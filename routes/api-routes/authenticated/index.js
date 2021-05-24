import testRoutes from './test.route';

const authenticatedRoutes = [
  {
    path: '/authTest',
    route: testRoutes,
  },
];

module.exports = authenticatedRoutes;
