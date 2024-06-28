import { CanceledError, isAxiosError } from 'axios';
import { useEffect, useLayoutEffect, useState } from 'react';
import { LockFill, TrashFill, UnlockFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { api } from '~/api';
import { UsersTable, Spinner } from '~/components';
import type { User } from '~/types';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    api.user
      .getAll()
      .then(({ data }) => {
        setUsers(data.map((user) => ({ ...user, selected: false })));
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof CanceledError) return;
        if (isAxiosError<{ message: string }>(error))
          toast.error(
            error.response?.data.message ?? 'Unexpected error, try again later',
          );
        setLoading(false);
      });

    return () => {
      api.controllers.getAll?.abort();
    };
  }, []);

  useLayoutEffect(() => {
    document.title = 'Auth app | Users';
  });

  return (
    <>
      <h1 className='heading text-center'>Table of users</h1>
      <div aria-label='Users table toolbar' className='toolbar' role='toolbar'>
        <button type='button' className='btn'>
          <LockFill size={18} />
          Block
        </button>
        <button
          type='button'
          className='btn'
          aria-label='unblock'
          title='unblock'>
          <UnlockFill size={18} />
        </button>
        <button
          type='button'
          className='btn'
          aria-label='delete'
          title='delete'>
          <TrashFill size={18} />
        </button>
        {isLoading && <Spinner />}
      </div>
      <div className='table-wrapper'>
        <UsersTable users={users} setUsers={setUsers} />
      </div>
    </>
  );
};
