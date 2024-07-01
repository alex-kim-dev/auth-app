import cn from 'clsx';
import {
  type ChangeEventHandler,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { formatDate } from '~/helpers';
import type { User } from '~/types';

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
    <table className='table'>
      <thead className='table__head'>
        <tr className='table__row'>
          <th className='table__cell table__col-header' scope='col'>
            <input
              aria-label='select all rows'
              checked={selectedAll}
              className='checkbox'
              type='checkbox'
              value='select'
              onChange={handleSelectAll}
            />
          </th>
          <th className='table__cell table__col-header' scope='col'>
            ID
          </th>
          <th className='table__cell table__col-header' scope='col'>
            Name
          </th>
          <th className='table__cell table__col-header' scope='col'>
            Email
          </th>
          <th className='table__cell table__col-header' scope='col'>
            Last login
          </th>
          <th className='table__cell table__col-header' scope='col'>
            Created at
          </th>
          <th className='table__cell table__col-header' scope='col'>
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map(({ id, ...user }) => (
          <tr
            key={id}
            className={cn('table__row', { 'table-active': user.selected })}>
            <td className='table__cell'>
              <input
                aria-label='select row'
                checked={user.selected}
                className='checkbox'
                type='checkbox'
                value='select'
                onChange={handleSelectRow(id)}
              />
            </td>
            <th
              className='table__cell table__row-header'
              scope='row'
              title={id}>
              {id}
            </th>
            <td className='table__cell'>{user.name}</td>
            <td className='table__cell'>{user.email}</td>
            <td className='table__cell'>{formatDate(user.lastLogin)}</td>
            <td className='table__cell'>{formatDate(user.createdAt)}</td>
            <td className='table__cell'>
              {user.isBanned ? 'blocked' : 'active'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
