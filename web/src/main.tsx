import 'react-toastify/dist/ReactToastify.css';
import '~/styles/reset.css';
import '@fontsource/m-plus-1p/400.css';
import '@fontsource/m-plus-1p/500.css';
import '~/styles/main.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App } from '~/App';
import {
  MainLayout,
  AuthLayout,
  ErrorPage,
  LoginPage,
  SignupPage,
  UsersPage,
} from '~/views';
import { ProtectedRoute } from '~/components';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <ProtectedRoute scope='not_authenticated' />,
        children: [
          {
            element: <AuthLayout />,
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
        ],
      },
      {
        element: <ProtectedRoute scope='authenticated' />,
        children: [
          {
            element: <MainLayout />,
            children: [
              {
                path: '/users',
                element: <UsersPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
