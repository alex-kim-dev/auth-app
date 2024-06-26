import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import { setNavigator } from '~/helpers';

export const App: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

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
      <Outlet />
    </>
  );
};
