import type {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const BAN = '876000h';
const UNBAN = 'none';

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

  setUserBan(id: string, ban: boolean) {
    return supabase.auth.admin.updateUserById(id, {
      ban_duration: ban ? BAN : UNBAN,
    });
  },

  deleteUser(id: string) {
    return supabase.auth.admin.deleteUser(id);
  },
};
