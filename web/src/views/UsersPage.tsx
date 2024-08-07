import { CanceledError, isAxiosError } from 'axios';
import {
  type MouseEventHandler,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { LockFill, TrashFill, UnlockFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { api } from '~/api';
import { UsersTable, Spinner } from '~/components';
import type { User, MessageResponse } from '~/types';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState(false);

  const fetchUsers = () => {
    setLoading(true);

    api.user
      .getAll()
      .then(({ data }) => {
        setUsers(data.map((user) => ({ ...user, selected: false })));
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof CanceledError) return;
        if (isAxiosError<MessageResponse>(error))
          toast.error(
            error.response?.data.message ?? 'Unexpected error, try again later',
          );
        setLoading(false);
      });
  };

  useLayoutEffect(() => {
    document.title = 'Auth app | Users';
  });

  useEffect(() => {
    fetchUsers();
    return () => {
      api.controllers.getAll?.abort();
    };
  }, []);

  const handleBan: MouseEventHandler = async () => {
    const selected = users
      .filter((user) => user.selected)
      .filter((user) => !user.isBanned);

    if (selected.length === 0) return;

    try {
      await api.user.ban(selected.map(({ id }) => id));
      fetchUsers();
    } catch (error) {
      if (isAxiosError<MessageResponse>(error)) {
        toast.error(
          error.response?.data.message ?? 'Unexpected error, try again later',
        );
        if (error.response?.status === 404) fetchUsers();
      }
    }
  };

  const handleUnban: MouseEventHandler = async () => {
    const selected = users
      .filter((user) => user.selected)
      .filter((user) => user.isBanned);

    if (selected.length === 0) return;

    try {
      await api.user.unban(selected.map(({ id }) => id));
      fetchUsers();
    } catch (error) {
      if (isAxiosError<MessageResponse>(error)) {
        toast.error(
          error.response?.data.message ?? 'Unexpected error, try again later',
        );
        if (error.response?.status === 404) fetchUsers();
      }
    }
  };

  const handleDelete: MouseEventHandler = async () => {
    const selected = users.filter((user) => user.selected);

    if (selected.length === 0) return;

    try {
      await api.user.delete(selected.map(({ id }) => id));
      fetchUsers();
    } catch (error) {
      if (isAxiosError<MessageResponse>(error)) {
        toast.error(
          error.response?.data.message ?? 'Unexpected error, try again later',
        );
        if (error.response?.status === 404) fetchUsers();
      }
    }
  };

  return (
    <>
      <h1 className='heading text-center'>Table of users</h1>
      <div aria-label='Users table toolbar' className='toolbar' role='toolbar'>
        <button type='button' className='btn' onClick={handleBan}>
          <LockFill size={18} />
          Block
        </button>
        <button
          type='button'
          className='btn'
          aria-label='unblock'
          title='unblock'
          onClick={handleUnban}>
          <UnlockFill size={18} />
        </button>
        <button
          type='button'
          className='btn'
          aria-label='delete'
          title='delete'
          onClick={handleDelete}>
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
