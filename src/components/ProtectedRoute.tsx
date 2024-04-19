import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '~/contexts/auth';

interface ProtectedRouteProps {
  scope: 'authenticated' | 'not_authenticated';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ scope }) => {
  const location = useLocation();
  const { session } = useAuth();

  const map: Record<
    ProtectedRouteProps['scope'],
    [condition: boolean, redirect: string]
  > = {
    authenticated: [!!session, '/'],
    not_authenticated: [!session, '/users'],
  };
  const [condition, path] = map[scope];

  return condition ? (
    <Outlet />
  ) : (
    <Navigate state={{ from: location }} to={path} replace />
  );
};
