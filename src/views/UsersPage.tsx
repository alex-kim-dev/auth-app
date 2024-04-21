import {
  type MouseEventHandler,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { LockFill, TrashFill, UnlockFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import { IconButton, LoadingButton, UsersTable } from '~/components';
import { useAuth } from '~/contexts/auth';
import { transformUsers, type User } from '~/utils';

export const UsersPage: React.FC = () => {
  const [isLoggingOut, setLogingOut] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [usersError, setUsersError] = useState<Error | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const { session, logOut, getUsers, setUserBan, deleteUser } = useAuth();
  const navigate = useNavigate();

  const userName = session?.user.user_metadata.name || 'Anonymous';

  useLayoutEffect(() => {
    document.title = 'Auth app | Users table';
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setUsersError(null);

    const { data, error } = await getUsers();

    if (error) setUsersError(error);
    else setUsers(transformUsers(data.users));

    setLoading(false);
  }, [getUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleLogOut: MouseEventHandler<HTMLButtonElement> = async () => {
    setLogingOut(true);

    const { error } = await logOut();

    if (error) setLogingOut(false);
    else navigate('/');
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
          <LoadingButton
            className='btn btn-outline-primary'
            loading={isLoggingOut}
            loadingContent='Logging out...'
            onClick={handleLogOut}>
            Log out
          </LoadingButton>
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
              <div className='navbar-text text-secondary' role='status'>
                {isLoading && (
                  <>
                    <span
                      aria-hidden='true'
                      className='spinner-border spinner-border-sm me-1'
                    />
                    Loading users...
                  </>
                )}
                {usersError && (
                  <span className='text-danger'>{usersError.message}</span>
                )}
              </div>
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
