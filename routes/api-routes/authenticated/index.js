import testRoutes from './test.route';
import profileRoutes from './profile.route';

const authenticatedRoutes = [
  {
    path: '/authTest',
    route: testRoutes,
  },
  {
    path: '/profile-settings',
    route: profileRoutes,
  },
];

module.exports = authenticatedRoutes;
