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

const storageAuthId = 'auth_app:auth';

const saveAuth = (auth: Auth | null) => {
  if (auth === null) window.sessionStorage.removeItem(storageAuthId);
  window.sessionStorage.setItem(storageAuthId, JSON.stringify(auth));
};

const restoreAuth = () => {
  try {
    return JSON.parse(
      window.sessionStorage.getItem(storageAuthId) ?? '',
    ) as Auth;
  } catch (error) {
    return null;
  }
};

export const useGlobalState = create<GlobalState>()((set) => ({
  auth: restoreAuth(),

  setAuth: (data) => {
    saveAuth(data);
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

export const getAuth = () => useGlobalState.getState().auth;

export const setAuth = (auth: Auth | null) => {
  useGlobalState.setState({ auth });
  saveAuth(auth);
};

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('GlobalState', useGlobalState);
}
