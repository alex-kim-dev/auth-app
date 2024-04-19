/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vitest/globals" />

import '@supabase/supabase-js';

declare module '@supabase/supabase-js' {
  interface User {
    banned_until?: 'string';
  }
}
