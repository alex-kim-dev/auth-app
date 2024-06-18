import { Outlet } from 'react-router-dom';
import Illustration from '~/assets/illustration.svg?react';

export const AuthLayout: React.FC = () => {
  return (
    <>
      <div className='hero text-center'>
        <Illustration className='hero__pic' />
        <h1 className='hero__heading'>Auth app</h1>
        <p className='hero__caption'>
          A full-stack web app for authentication and user management
        </p>
      </div>
      <div className='content'>
        <Outlet />
      </div>
    </>
  );
};
