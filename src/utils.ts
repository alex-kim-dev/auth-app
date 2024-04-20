import type { User as SupabaseUser } from '@supabase/supabase-js';

export const transformUsers = (users: SupabaseUser[]) => {
  return users.map((user) => ({
    id: user.id,
    name: (user.user_metadata.name as string) ?? 'Anonymous',
    email: user.email ?? 'no email',
    lastLoginAt: user.last_sign_in_at
      ? new Date(user.last_sign_in_at).toLocaleString()
      : '—',
    createdAt: new Date(user.created_at).toLocaleString(),
    blocked: (user?.banned_until ? 'blocked' : 'active') as
      | 'blocked'
      | 'active',
    selected: false,
  }));
};

export type User = ReturnType<typeof transformUsers>[number];
