import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useGlobalState } from '~/store';

interface ProtectedRouteProps {
  scope: 'authenticated' | 'not_authenticated';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ scope }) => {
  const { auth } = useGlobalState();
  const location = useLocation();

  const map: Record<
    ProtectedRouteProps['scope'],
    [condition: boolean, path: string]
  > = {
    authenticated: [!!auth, '/'],
    not_authenticated: [!auth, '/users'],
  };
  const [condition, path] = map[scope];

  return condition ? (
    <Outlet />
  ) : (
    <Navigate state={{ from: location }} to={path} replace />
  );
};
