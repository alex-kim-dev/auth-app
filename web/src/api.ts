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

interface SignupResponse {
  id: string;
  name: string;
  accessToken: string;
}

const controllers: Partial<Record<keyof typeof auth, AbortController>> = {};

const auth = {
  signup(data: SignupData) {
    const controller = new AbortController();
    controllers.signup = controller;

    return axios.post<SignupResponse>('/auth/signup', data, {
      signal: controller.signal,
    });
  },
};

export const api = { controllers, auth };