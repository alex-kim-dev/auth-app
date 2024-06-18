import { Outlet } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  return (
    <main className='main'>
      <Outlet />
    </main>
  );
};
