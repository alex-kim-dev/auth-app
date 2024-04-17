import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';

export const ErrorPage: React.FC = () => {
  useLayoutEffect(() => {
    document.title = 'Auth app | Error';
  });

  return (
    <main className='container'>
      <div className='row align-items-center min-vh-100'>
        <div className='col'>
          <div className='max-w-sm m-auto text-center'>
            <h1>Oops!</h1>
            <p className='fs-5 d-flex flex-column align-items-center gx-'>
              Sorry, there&apos;s no page with this url
              <span className='text-bg-secondary fs-4'>404 Not Found</span>
              <Link to='/'>Go to the main page</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
