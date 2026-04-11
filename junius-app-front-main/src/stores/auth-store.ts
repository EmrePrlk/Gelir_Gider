import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { env } from 'src/env';
import { EncryptedStorage } from 'src/lib/encrypted-storage';

import type { IUser } from 'src/types/user';
import type { ITokens } from 'src/types/auth';

export enum AuthStatus {
  NotInitialized = -1,
  Unauthorized = 0,
  Authorized = 1,
}

export interface AuthState {
  authStatus: AuthStatus;
  user: IUser | null;
  tokens: ITokens | null;
  signOut: () => void;
  setTokens: (tokens: ITokens) => void;
  setUser: (user: IUser) => void;
}

const encryptedStorage = new EncryptedStorage<AuthState>(
  env.NEXT_PUBLIC_SECRET_KEY,
);

const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      authStatus: AuthStatus.NotInitialized,
      user: null,
      tokens: null,
      setTokens: tokens => set({ tokens, authStatus: AuthStatus.Authorized }),
      setUser: user => set({ user, authStatus: AuthStatus.Authorized }),
      signOut: () => {
        set({
          authStatus: AuthStatus.Unauthorized,
          user: null,
          tokens: null,
        });
      },
    }),
    {
      name: 'ea9a953cf63098560b1d86557d452da1485c77f41e2a94aa756fb0d5d00defed',
      storage: encryptedStorage,
    },
  ),
);

export { useAuthStore };
