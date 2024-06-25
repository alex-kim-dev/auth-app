import { Outlet } from 'react-router-dom';
import { BoxArrowRight } from 'react-bootstrap-icons';
import { useMediaQuery } from '@uidotdev/usehooks';
import { useGlobalState } from '~/store';

export const MainLayout: React.FC = () => {
  const isSmallScreen = useMediaQuery('(width < 768px');
  const { auth } = useGlobalState();
  const name = auth?.name ?? 'Anonymous';

  return (
    <>
      <header className='app-bar'>
        <div className='app-bar__container'>
          <span className='app-bar__brand'>Auth app</span>
          <span className='app-bar__greeting'>Hello, {name}!</span>
          {isSmallScreen ? (
            <button
              className='btn btn--alt'
              type='button'
              title='Log out'
              aria-label='log out'>
              <BoxArrowRight size={20} />
            </button>
          ) : (
            <button className='btn btn--alt' type='button'>
              Log out
            </button>
          )}
        </div>
      </header>
      <main className='layout'>
        <Outlet />
      </main>
    </>
  );
};
