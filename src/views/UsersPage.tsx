import {
  type MouseEventHandler,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { LockFill, TrashFill, UnlockFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import { IconButton, UsersTable } from '~/components';
import { useAuth } from '~/contexts/auth';
import { transformUsers, type User } from '~/utils';

export const UsersPage: React.FC = () => {
  const [isLoggingOut, setLogOut] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { session, logOut, getUsers, setUserBan, deleteUser } = useAuth();
  const navigate = useNavigate();

  const userName = session?.user.user_metadata.name || 'Anonymous';

  useLayoutEffect(() => {
    document.title = 'Auth app | Users table';
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);

    const { data, error } = await getUsers();

    if (error) console.error(error);
    else {
      setUsers(transformUsers(data.users));
      setLoading(false);
    }
  }, [getUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleLogOut: MouseEventHandler<HTMLButtonElement> = async () => {
    setLogOut(true);

    const { error } = await logOut();

    if (error) {
      setLogOut(false);
      console.error(error);
    } else navigate('/');
  };

  const handleBlock =
    (block: boolean): MouseEventHandler<HTMLButtonElement> =>
    async () => {
      const selected = users
        .filter((user) => user.selected)
        .filter(
          (user) =>
            (block && user.blocked === 'active') ||
            (!block && user.blocked === 'blocked'),
        );

      if (selected.length === 0) return;

      try {
        await Promise.all(selected.map((user) => setUserBan(user.id, block)));
        loadUsers();
      } catch (error) {
        console.error(error);
      }
    };

  const handleDelete: MouseEventHandler<HTMLButtonElement> = async () => {
    const selected = users.filter((user) => user.selected);

    if (selected.length === 0) return;

    try {
      await Promise.all(selected.map((user) => deleteUser(user.id)));
      loadUsers();
    } catch (error) {
      console.error(error);
    }
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
              <IconButton
                className='btn btn-primary'
                icon={LockFill}
                onClick={handleBlock(true)}>
                Block
              </IconButton>
              <IconButton
                aria-label='unblock'
                className='btn btn-primary'
                icon={UnlockFill}
                title='unblock'
                onClick={handleBlock(false)}
              />
              <IconButton
                aria-label='delete'
                className='btn btn-danger'
                icon={TrashFill}
                title='delete'
                onClick={handleDelete}
              />
              {isLoading && (
                <div className='navbar-text text-secondary' role='status'>
                  <span
                    aria-hidden='true'
                    className='spinner-border spinner-border-sm me-1'
                  />
                  Loading users...
                </div>
              )}
            </div>
            <div className='overflow-auto'>
              <UsersTable setUsers={setUsers} users={users} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
