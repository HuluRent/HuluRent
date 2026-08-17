import { createBrowserRouter } from 'react-router-dom';

import HomePage from '../features/home/pages/HomePage';
import ProfilePage from '../features/profile/pages/ProfilePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
]);

export default router;