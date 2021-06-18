import testRoutes from './test.route';
import profileRoutes from './profile.route';


//Private endpoints registered in List 
//List is iteratively registered in main index file
//This file has private/authenticated routes only
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
