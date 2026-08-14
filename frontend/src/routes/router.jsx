import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../features/home/pages/HomePage';
import LoginPage from '../features/auth/pages/LoginPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

export default router;