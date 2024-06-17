import '~/styles/reset.css';
import '@fontsource/m-plus-1p/400.css';
import '@fontsource/m-plus-1p/500.css';
import '~/styles/main.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { MainLayout, ErrorPage } from '~/views';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
  },
]);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
