import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import {
  MainLayout,
  AuthLayout,
  ErrorPage,
  LoginPage,
  SignupPage,
  UsersPage,
} from '~/views';

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

export const App: React.FC = () => {
  return (
    <>
      <ToastContainer
        bodyClassName='toast__body'
        className='toast__container'
        closeButton={false}
        draggable={false}
        icon={false}
        newestOnTop={false}
        position='top-right'
        toastClassName='toast'
        transition={Slide}
        closeOnClick
        hideProgressBar
        pauseOnFocusLoss
        pauseOnHover
      />
      <RouterProvider router={router} />
    </>
  );
};
