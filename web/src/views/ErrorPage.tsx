import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';

export const ErrorPage: React.FC = () => {
  useLayoutEffect(() => {
    document.title = 'Auth app | Not found';
  });

  return (
    <main className='error text-center'>
      <h1 className='error__heading'>Oops!</h1>
      <p className='error__text'>Sorry, an unexpected error has occurred:</p>
      <p className='error__code'>404 Not Found</p>
      <p className='error__text'>
        <Link to='/'>Go to the main page</Link>
      </p>
    </main>
  );
};
