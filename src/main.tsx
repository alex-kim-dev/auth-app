import '~/main.scss';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ErrorPage, LoginPage, RegisterPage, UsersPage } from '~/views';

import { ProtectedRoute } from './components';
import { AuthProvider } from './contexts/auth';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<ProtectedRoute scope='not_authenticated' />}>
            <Route element={<LoginPage />} path='/' />
          </Route>

          <Route element={<ProtectedRoute scope='not_authenticated' />}>
            <Route element={<RegisterPage />} path='/register' />
          </Route>

          <Route element={<ProtectedRoute scope='authenticated' />}>
            <Route element={<UsersPage />} path='/users' />
          </Route>

          <Route element={<ErrorPage />} path='*' />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
