export const UsersPage: React.FC = () => {
  return (
    <main className='container'>
      <div className='row'>
        <div className='col'>
          <h1 className='text-center mb-5'>Table of users</h1>
          <table className='table table-light'>
            <thead>
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
                <td>{new Date(2023, 11, 29, 5, 16, 56).toLocaleString()}</td>
                <td>active</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};
