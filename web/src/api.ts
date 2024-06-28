import axios, { AxiosError, isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useGlobalState } from '~/store';
import type { User } from '~/types';
import { navigateTo } from '~/helpers';

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 120_000,
});

/** has interceptors to send and refresh the access token */
const axiosPrivate = axios.create(axiosPublic.defaults);

interface SignupData {
  email: string;
  name: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  id: string;
  name: string;
  accessToken: string;
}

axiosPrivate.interceptors.request.use(
  (config) => {
    const { auth } = useGlobalState.getState();
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
        useGlobalState.setState({ auth: data });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return axiosPrivate(config!);
      } catch (error) {
        if (
          isAxiosError(error) &&
          [400, 403].includes(error.response?.status ?? NaN)
        ) {
          useGlobalState.setState({ auth: null });
          navigateTo('/');
          if (error.response?.status === 403) toast.error('Access denied');
          return Promise.resolve();
        }
        return Promise.reject(error);
      }
    }

    if (res?.status === 403) {
      useGlobalState.setState({ auth: null });
      navigateTo('/');
      toast.error('Access denied');
    }
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
};

export const api = { controllers, auth, user };
