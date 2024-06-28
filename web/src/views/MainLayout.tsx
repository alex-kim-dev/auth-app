import { Outlet } from 'react-router-dom';
import { useGlobalState } from '~/store';
import { LogoutModal } from '~/components';

export const MainLayout: React.FC = () => {
  const { auth } = useGlobalState();
  const name = auth?.name ?? 'Anonymous';

  return (
    <>
      <header className='app-bar'>
        <div className='app-bar__container'>
          <span className='app-bar__brand'>Auth app</span>
          <span className='app-bar__greeting'>Hello, {name}!</span>
          <LogoutModal />
        </div>
      </header>
      <main className='layout'>
        <Outlet />
      </main>
    </>
  );
};
