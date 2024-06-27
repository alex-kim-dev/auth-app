import { useState, type MouseEventHandler } from 'react';
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@uidotdev/usehooks';
import { toast } from 'react-toastify';
import { BoxArrowRight } from 'react-bootstrap-icons';
import cn from 'clsx';
import { useGlobalState } from '~/store';
import { api } from '~/api';

ReactModal.setAppElement('#root');

export const LogoutModal: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { setAuth } = useGlobalState();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(width < 768px');

  const handleLogout: MouseEventHandler = async () => {
    if (isLoading) return;

    setLoading(true);

    try {
      await api.auth.logout();
      setAuth(null);
      navigate('/');
    } catch (error) {
      setLoading(false);
      toast.error('Unpected error, please try again');
    }
  };

  const handleOpen: MouseEventHandler = () => {
    setModalOpen(true);
  };

  const handleClose: MouseEventHandler = () => {
    setModalOpen(false);
  };

  return (
    <>
      <ReactModal
        className='modal'
        contentLabel='Log out?'
        isOpen={isModalOpen}
        overlayClassName='overlay'
        onRequestClose={handleClose}>
        <p className='modal__heading'>Exit?</p>
        <p className='modal__text'>Do you really want to log out?</p>
        <div className='modal__container'>
          <button
            className={cn('btn', { 'btn--loading': isLoading })}
            disabled={isLoading}
            type='button'
            onClick={handleLogout}>
            Yes, sure
          </button>
          <button className='btn btn--alt' type='button' onClick={handleClose}>
            No, stay
          </button>
        </div>
      </ReactModal>

      {isSmallScreen ? (
        <button
          className='btn btn--alt'
          type='button'
          title='Log out'
          aria-label='log out'
          onClick={handleOpen}>
          <BoxArrowRight size={20} />
        </button>
      ) : (
        <button className='btn btn--alt' type='button' onClick={handleOpen}>
          Log out
        </button>
      )}
    </>
  );
};
