import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

interface Auth {
  id: string;
  name: string;
  accessToken: string;
}

interface GlobalState {
  auth: Auth | null;
  setAuth: (data: Auth | null) => void;
}

export const useGlobalState = create<GlobalState>()((set) => ({
  auth: null,
  setAuth: (data) => {
    set((state) => ({
      ...state,
      auth: data
        ? {
            id: state.auth?.id ?? data.id,
            name: state.auth?.name ?? data.name,
            accessToken: state.auth?.accessToken ?? data.accessToken,
          }
        : null,
    }));
  },
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('GlobalState', useGlobalState);
}
