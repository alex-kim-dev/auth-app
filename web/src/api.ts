import axios, { AxiosError, isAxiosError } from 'axios';
import { getAuth, setAuth } from '~/store';
import type {
  User,
  LoginData,
  LoginResponse,
  MessageResponse,
  SignupData,
} from '~/types';
import { navigateTo } from '~/helpers';

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 120_000,
});

/** has interceptors to send and refresh the access token */
const axiosPrivate = axios.create(axiosPublic.defaults);

axiosPrivate.interceptors.request.use(
  (config) => {
    const auth = getAuth();
    if (auth?.accessToken)
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    return config;
  },

  (error: AxiosError) => Promise.reject(error),
);

axiosPrivate.interceptors.response.use(
  (res) => res,

  async (error: AxiosError) => {
    const { response: res, config } = error;

    if (res?.status === 401) {
      try {
        const { data } = await api.auth.refresh();
        setAuth(data);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return axiosPrivate(config!);
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 403) {
          setAuth(null);
          navigateTo('/');
          return Promise.reject(error);
        }
      }
    }

    if ([401, 403].includes(error.response?.status ?? NaN)) {
      setAuth(null);
      navigateTo('/');
    }

    return Promise.reject(error);
  },
);

const controllers: Partial<
  Record<keyof typeof auth | keyof typeof user, AbortController>
> = {};

const auth = {
  signup(data: SignupData) {
    controllers.signup = new AbortController();
    return axiosPublic.post<LoginResponse>('/auth/signup', data, {
      signal: controllers.signup.signal,
      withCredentials: true,
    });
  },

  login(data: LoginData) {
    controllers.login = new AbortController();
    return axiosPublic.post<LoginResponse>('/auth/login', data, {
      signal: controllers.login.signal,
      withCredentials: true,
    });
  },

  refresh() {
    controllers.refresh = new AbortController();
    return axiosPublic.get<LoginResponse>(`/auth/refresh`, {
      signal: controllers.refresh.signal,
      withCredentials: true,
    });
  },

  logout() {
    controllers.logout = new AbortController();
    return axiosPrivate.get('/auth/logout', {
      signal: controllers.logout.signal,
      withCredentials: true,
    });
  },
};

const user = {
  getAll() {
    controllers.getAll = new AbortController();
    return axiosPrivate.get<Omit<User, 'selected'>[]>('/user/all', {
      signal: controllers.getAll.signal,
    });
  },

  ban(ids: string[]) {
    controllers.ban = new AbortController();
    return axiosPrivate.patch<MessageResponse>(`/user/ban`, ids, {
      signal: controllers.ban.signal,
    });
  },

  unban(ids: string[]) {
    controllers.unban = new AbortController();
    return axiosPrivate.patch<MessageResponse>(`/user/unban`, ids, {
      signal: controllers.unban.signal,
    });
  },

  delete(ids: string[]) {
    controllers.delete = new AbortController();
    return axiosPrivate.post<MessageResponse>(`/user/delete`, ids, {
      signal: controllers.delete.signal,
    });
  },
};

export const api = { controllers, auth, user };
