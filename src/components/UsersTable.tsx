import type { User } from '@supabase/supabase-js';

interface UsersTableProps {
  users: User[];
}

export const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  return (
    <table className='table table-light mb-0'>
      <thead className='text-nowrap'>
        <tr>
          <th scope='col'>
            <input
              aria-label='select all rows'
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
        {users.map((user) => (
          <tr key={user.id}>
            <th>
              <input
                aria-label='select row'
                className='form-check-input'
                type='checkbox'
                value='select'
              />
            </th>
            <th className='max-w-id text-truncate' scope='row' title={user.id}>
              {user.id}
            </th>
            <td>{user.user_metadata.name ?? 'Anonymous'}</td>
            <td>{user.email}</td>
            <td>
              {user.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleString()
                : '—'}
            </td>
            <td>{new Date(user.created_at).toLocaleString()}</td>
            <td>{user?.banned_until ? 'blocked' : 'active'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
