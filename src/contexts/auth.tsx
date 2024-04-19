import type {
  Session,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { supabase } from '~/services/supabase';

const logIn = (credentials: SignInWithPasswordCredentials) =>
  supabase.auth.signInWithPassword(credentials);

const register = (credentials: SignUpWithPasswordCredentials) =>
  supabase.auth.signUp(credentials);

const logOut = () => supabase.auth.signOut();

interface AuthContextValue {
  session: Session | null;
  logIn: typeof logIn;
  register: typeof register;
  logOut: typeof logOut;
}

export const AuthContext = createContext<AuthContextValue>({
  session: null,
  logIn,
  register,
  logOut,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const value = useMemo(
    () => ({ session, logIn, register, logOut }),
    [session],
  );

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, updatedSession) => {
      setSession(updatedSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
