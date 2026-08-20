import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../features/home/pages/HomePage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import { AppShell } from '../components/layout/AppShell';

import { ListingDetailPage } from '../features/listings/pages/ListingDetailPage';
import { BookingRequestPage } from '../features/bookings/pages/BookingRequestPage';
import MyBookingsPage from '../features/bookings/pages/MyBookingsPage';
import BookingDetailPage from '../features/bookings/pages/BookingDetailPage';
import { ProfilePage } from '../features/profile/pages/ProfilePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <AppShell />,
    children: [
      {
        path: '/bookings',
        element: <MyBookingsPage />,
      },
      {
        path: '/bookings/:bookingId',
        element: <BookingDetailPage />,
      },
      {
        path: '/listings/:listingId',
        element: <ListingDetailPage />,
      },
      {
        path: '/listings/:listingId/book',
        element: <BookingRequestPage />,
      },
      {
         path: '/profile',
         element: <ProfilePage />,
       },
    ],
  },
]);

export default router;