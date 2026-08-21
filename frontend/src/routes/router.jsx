import { createBrowserRouter } from 'react-router-dom';

import HomePage from '../features/home/pages/HomePage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';

import { AppShell } from '../components/layout/AppShell';

import SearchPage from '../features/search/pages/SearchPage';

import ListingBrowsePage from '../features/listings/pages/ListingBrowsePage';
import { ListingDetailPage } from '../features/listings/pages/ListingDetailPage';
import { ListingCreatePage } from '../features/listings/pages/ListingCreatePage';
import { ListingEditPage } from '../features/listings/pages/ListingEditPage';
import { MyListingsPage } from '../features/listings/pages/MyListingsPage';

import { BookingRequestPage } from '../features/bookings/pages/BookingRequestPage';
import MyBookingsPage from '../features/bookings/pages/MyBookingsPage';
import BookingDetailPage from '../features/bookings/pages/BookingDetailPage';

import { ProfilePage } from '../features/profile/pages/ProfilePage';
import EditProfilePage from '../features/profile/pages/EditProfilePage';

import ChatPage from '../features/messaging/pages/ChatPage';

import NotificationsPage from '../features/notifications/pages/NotificationsPage';

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
        path: '/search',
        element: <SearchPage />,
      },
      {
        path: '/listings',
        element: <ListingBrowsePage />,
      },
      {
        path: '/listings/create',
        element: <ListingCreatePage />,
      },
      {
        path: '/listings/:listingId',
        element: <ListingDetailPage />,
      },
      {
        path: '/listings/:listingId/edit',
        element: <ListingEditPage />,
      },
      {
        path: '/listings/:listingId/book',
        element: <BookingRequestPage />,
      },
      {
        path: '/my-listings',
        element: <MyListingsPage />,
      },
      {
        path: '/bookings',
        element: <MyBookingsPage />,
      },
      {
        path: '/bookings/:bookingId',
        element: <BookingDetailPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/profile/edit',
        element: <EditProfilePage />,
      },
      {
        path: '/messages',
        element: <ChatPage />,
      },
      {
        path: '/messages/:conversationId',
        element: <ChatPage />,
      },
      {
        path: '/notifications',
        element: <NotificationsPage />,
      },
    ],
  },
]);

export default router;
