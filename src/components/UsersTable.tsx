import cn from 'clsx';
import {
  type ChangeEventHandler,
  type Dispatch,
  type SetStateAction,
} from 'react';

import { type User } from '~/utils';

interface UsersTableProps {
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, setUsers }) => {
  const selectedAll = users.every((user) => user.selected);

  const handleSelectAll: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => ({ ...user, selected: currentTarget.checked })),
    );
  };

  const handleSelectRow =
    (id: string): ChangeEventHandler<HTMLInputElement> =>
    ({ currentTarget }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, selected: currentTarget.checked } : user,
        ),
      );
    };

  return (
    <table className='table table-light mb-0'>
      <thead className='text-nowrap'>
        <tr>
          <th scope='col'>
            <input
              aria-label='select all rows'
              checked={selectedAll}
              className='form-check-input'
              type='checkbox'
              value='select'
              onChange={handleSelectAll}
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
        {users.map(({ id, ...user }) => (
          <tr key={id} className={cn({ 'table-active': user.selected })}>
            <th>
              <input
                aria-label='select row'
                checked={user.selected}
                className='form-check-input'
                type='checkbox'
                value='select'
                onChange={handleSelectRow(id)}
              />
            </th>
            <th className='max-w-id text-truncate' scope='row' title={id}>
              {id}
            </th>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.lastLoginAt}</td>
            <td>{user.createdAt}</td>
            <td>{user.blocked}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
