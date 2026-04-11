import { type IUser } from 'src/types/user';
import {
  type ITokens,
  type ILoginRequest,
  type IRegisterRequest,
} from 'src/types/auth';

import { api, secureApi } from './instance';

/**
 * Signup a new user
 * @param data - The user data
 * @returns The user
 */
const signup = async (data: IRegisterRequest) => {
  const response = await api.post('/accounts/register/', data);
  return response.data as IUser;
};

/**
 * Signin a user
 * @param data - The user data
 * @returns The tokens
 */
const signin = async (data: ILoginRequest) => {
  const response = await api.post('/accounts/token/', data);
  return response.data as ITokens;
};

/**
 * Get the user
 * @param accessToken - The access token
 * @returns The user
 */
export const me = async (accessToken?: string) => {
  const response = accessToken
    ? await api.get('/accounts/me/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    : await secureApi.get('/accounts/me/');
  const data = response.data as { results: IUser[] };
  if (data.results.length === 0) {
    throw new Error('No user found');
  }
  return data.results[0];
};

/**
 * Login a user
 * @param data - The user data
 * @returns The tokens and the user
 */
export const login = async (data: ILoginRequest) => {
  const tokens = await signin(data);
  const user = await me(tokens.access);
  return { tokens, user };
};

/**
 * Register a new user
 * @param data - The user data
 * @returns The tokens and the user
 */
export const register = async (data: IRegisterRequest) => {
  const user = await signup(data);
  const tokens = await signin(data);
  return { tokens, user };
};
