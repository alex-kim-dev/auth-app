import { useState } from 'react';

import css from '~/App.module.css';
import Logo from '~/logo.svg?react';

export const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={css.wrapper}>
      <header className={css.header}>
        <Logo className={css.logo} />
        <p>Hello Vite + React!</p>
        <p>
          <button type='button' onClick={() => setCount((c) => c + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className={css.link}
            href='https://reactjs.org'
            rel='noopener noreferrer'
            target='_blank'>
            Learn React
          </a>
          {' | '}
          <a
            className={css.link}
            href='https://vitejs.dev/guide/features.html'
            rel='noopener noreferrer'
            target='_blank'>
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
};
