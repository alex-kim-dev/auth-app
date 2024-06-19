import { useLayoutEffect } from 'react';

export const UsersPage: React.FC = () => {
  useLayoutEffect(() => {
    document.title = 'Auth app | Users';
  });

  return <h1>Table of users</h1>;
};
