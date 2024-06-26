import axiosLib, { AxiosError, isAxiosError } from 'axios';
import { useGlobalState } from '~/store';
import { navigateTo } from '~/helpers';

const axios = axiosLib.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 120_000,
});

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

axios.interceptors.request.use(
  (config) => {
    const { auth } = useGlobalState.getState();
    if (auth?.accessToken)
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    return config;
  },

  (error: AxiosError) => Promise.reject(error),
);

axios.interceptors.response.use(
  (res) => res,

  async (error: AxiosError) => {
    const { response } = error;
    if (response?.status !== 401) {
      return Promise.reject(error);
    }
    if (response.config.url?.endsWith('/auth/refresh')) {
      return Promise.reject(error);
    }

    try {
      const { data } = await api.auth.refresh();
      useGlobalState.setState({ auth: data });
    } catch (error) {
      if (
        isAxiosError(error) &&
        [400, 403].includes(error.response?.status ?? NaN)
      ) {
        useGlobalState.setState({ auth: null });
        navigateTo('/');
      } else return Promise.reject(error);
    }
  },
);

const controllers: Partial<Record<keyof typeof auth, AbortController>> = {};

const auth = {
  signup(data: SignupData) {
    const controller = new AbortController();
    controllers.signup = controller;

    return axios.post<LoginResponse>('/auth/signup', data, {
      signal: controller.signal,
      withCredentials: true,
    });
  },

  login(data: LoginData) {
    const controller = new AbortController();
    controllers.signup = controller;

    return axios.post<LoginResponse>('/auth/login', data, {
      signal: controller.signal,
      withCredentials: true,
    });
  },

  refresh() {
    const controller = new AbortController();
    controllers.refresh = controller;

    return axios.get<LoginResponse>('/auth/refresh', {
      signal: controller.signal,
      withCredentials: true,
    });
  },
};

export const api = { controllers, auth };
