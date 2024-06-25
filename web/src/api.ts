import axiosLib from 'axios';

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
};

export const api = { controllers, auth };
