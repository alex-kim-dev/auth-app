export interface User {
  id: string;
  name: string;
  email: string;
  lastLogin: string;
  createdAt: string;
  isBanned: boolean;
  selected: boolean;
}

export interface SignupData {
  email: string;
  name: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  accessToken: string;
}

export interface MessageResponse {
  message: string;
}
