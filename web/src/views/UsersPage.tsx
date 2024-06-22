import { useLayoutEffect, useState } from 'react';
import { LockFill, TrashFill, UnlockFill } from 'react-bootstrap-icons';
import { UsersTable } from '~/components/UsersTable';
import type { User } from '~/types';

const initialUsers: User[] = [
  {
    id: 'clxlljv9f0000ffnaro29l4sj',
    name: 'Alex',
    email: 'alex@email.com',
    lastLogin: '2024-06-19T16:23:00.047Z',
    createdAt: '2024-06-19T08:54:11.713Z',
    isBanned: false,
    selected: false,
  },
  {
    id: 'clxm2ezfw000011c32yxkss79',
    name: 'Raccoon',
    email: 'raccoon@email.com',
    lastLogin: '2024-06-19T16:46:17.325Z',
    createdAt: '2024-06-19T16:46:17.325Z',
    isBanned: false,
    selected: false,
  },
];

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState(initialUsers);

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
      </div>
      <div className='table-wrapper'>
        <UsersTable users={users} setUsers={setUsers} />
      </div>
    </>
  );
};
