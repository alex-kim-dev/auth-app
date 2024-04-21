import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { auth, supabase } from '~/services/supabase';

type AuthContextValue = typeof auth & {
  session: Session | null;
};

export const AuthContext = createContext<AuthContextValue>({
  session: null,
  ...auth,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const value = useMemo(() => ({ session, ...auth }), [session]);

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
