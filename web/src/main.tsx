import '~/styles/reset.css';
import '@fontsource/m-plus-1p/400.css';
import '@fontsource/m-plus-1p/500.css';
import '~/styles/main.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import {
  MainLayout,
  AuthLayout,
  ErrorPage,
  LoginPage,
  SignupPage,
  UsersPage,
} from '~/views';
import { AuthProvider } from './context/auth';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
    ],
  },
  {
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/users',
        element: <UsersPage />,
      },
    ],
  },
]);

root.render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
