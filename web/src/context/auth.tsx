import {
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

interface Auth {
  id: string;
  name: string;
  accessToken: string;
}

export const AuthContext = createContext<{
  auth: Auth | null;
  setAuth: Dispatch<SetStateAction<Auth | null>>;
}>({
  auth: null,
  setAuth: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<Auth | null>(null);
  const contextValue = useMemo(() => ({ auth, setAuth }), [auth]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
