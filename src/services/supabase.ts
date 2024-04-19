import type {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY,
);

export const auth = {
  logIn(credentials: SignInWithPasswordCredentials) {
    return supabase.auth.signInWithPassword(credentials);
  },

  register(credentials: SignUpWithPasswordCredentials) {
    return supabase.auth.signUp(credentials);
  },

  logOut() {
    return supabase.auth.signOut();
  },

  getUsers() {
    return supabase.auth.admin.listUsers();
  },
};
