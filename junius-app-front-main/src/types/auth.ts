import type { IUser } from './user';

// ----------------------------------------------------------------------

// Tokens
export interface ITokens {
  access: string;
  refresh: string;
}

// Login
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  tokens: ITokens;
}

// Register
export interface IRegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface IRegisterResponse {
  user: IUser;
}

// Me
export interface IMeResponse {
  user: IUser;
}
