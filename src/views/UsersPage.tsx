import { type MouseEventHandler, useLayoutEffect, useState } from 'react';
import { LockFill, TrashFill, UnlockFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import { IconButton } from '~/components';
import { useAuth } from '~/contexts/auth';

export const UsersPage: React.FC = () => {
  const [isLoggingOut, setLogOut] = useState(false);
  const navigate = useNavigate();
  const { session, logOut } = useAuth();
  const userName = session?.user.user_metadata.name || 'Anonymous';

  useLayoutEffect(() => {
    document.title = 'Auth app | Users table';
  });

  const handleLogOut: MouseEventHandler<HTMLButtonElement> = async () => {
    setLogOut(true);

    const { error } = await logOut();

    if (error) {
      setLogOut(false);
      console.error(error);
    } else navigate('/');
  };

  return (
    <>
      <header className='navbar bg-body-secondary mb-4 mb-md-5'>
        <div className='container justify-content-start'>
          <span className='navbar-brand flex-grow-1'>Auth app</span>
          <span className='navbar-text me-3'>Hello, {userName}!</span>
          <button
            className='btn btn-outline-primary'
            disabled={isLoggingOut}
            type='button'
            onClick={handleLogOut}>
            {isLoggingOut ? (
              <>
                <span
                  aria-hidden='true'
                  className='spinner-border spinner-border-sm me-2'
                />
                <span role='status'>Logging out...</span>
              </>
            ) : (
              'Log out'
            )}
          </button>
        </div>
      </header>
      <main className='container'>
        <div className='row'>
          <div className='col'>
            <h1 className='h2 text-center mb-4 mb-md-5'>Table of users</h1>
            <div
              aria-label='Users table toolbar'
              className='btn-toolbar gap-2 mb-3 mb-md-4'
              role='toolbar'>
              <IconButton className='btn btn-primary' icon={LockFill}>
                Block
              </IconButton>
              <IconButton
                aria-label='unblock'
                className='btn btn-primary'
                icon={UnlockFill}
                title='unblock'
              />
              <IconButton
                aria-label='delete'
                className='btn btn-danger'
                icon={TrashFill}
                title='delete'
              />
            </div>
            <div className=' overflow-auto'>
              <table className='table table-light mb-0'>
                <thead className='text-nowrap'>
                  <tr>
                    <th scope='col'>
                      <input
                        aria-label='select all table'
                        className='form-check-input'
                        type='checkbox'
                        value='select'
                      />
                    </th>
                    <th scope='col'>ID</th>
                    <th scope='col'>Name</th>
                    <th scope='col'>Email</th>
                    <th scope='col'>Last login</th>
                    <th scope='col'>Registered at</th>
                    <th scope='col'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope='row'>
                      <input
                        aria-label='select user with name ...'
                        className='form-check-input'
                        type='checkbox'
                        value='select'
                      />
                    </th>
                    <th scope='row'>0</th>
                    <td>Mark</td>
                    <td>mark@email.com</td>
                    <td>{new Date(2024, 3, 5).toLocaleString()}</td>
                    <td>{new Date(2024, 0, 8, 15, 43, 15).toLocaleString()}</td>
                    <td>blocked</td>
                  </tr>
                  <tr className='table-active'>
                    <th scope='row'>
                      <input
                        aria-label='select user with name ...'
                        className='form-check-input'
                        type='checkbox'
                        value='select'
                        defaultChecked
                      />
                    </th>
                    <th scope='row'>1</th>
                    <td>Jacob</td>
                    <td>jacob@email.com</td>
                    <td>{new Date().toLocaleString()}</td>
                    <td>
                      {new Date(2023, 11, 29, 5, 16, 56).toLocaleString()}
                    </td>
                    <td>active</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
