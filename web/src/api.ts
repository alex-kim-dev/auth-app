import axiosLib, { AxiosError, isAxiosError } from 'axios';

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
  async signup(data: SignupData) {
    const controller = new AbortController();
    controllers.signup = controller;

    try {
      const res = await axios.post<SignupResponse>('/auth/signup', data, {
        signal: controller.signal,
      });

      return { data: res.data, errorMsg: null };
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMsg =
          {
            400: 'Incorrect sign up data',
            409: (error as AxiosError<{ message: string }>).response?.data
              .message,
            500: 'There was a problem on the server side, try again later',
          }[String(error.response?.status)] || 'Unrecognized error';

        return { data: null, errorMsg };
      } else throw error;
    }
  },
};

export const api = { controllers, auth };
