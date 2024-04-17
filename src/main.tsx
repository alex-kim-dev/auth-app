import '~/main.scss';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ErrorPage, LoginPage, RegisterPage } from '~/views';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<LoginPage />} path='/' />
        <Route element={<RegisterPage />} path='/register' />
        {/* <Route element={<UsersPage />} path='/users' /> */}
        <Route element={<ErrorPage />} path='*' />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
