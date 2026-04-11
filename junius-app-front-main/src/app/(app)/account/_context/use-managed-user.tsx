import React, {
  useMemo,
  useContext,
  createContext,
  type ReactNode,
} from 'react';

import { type IUser } from 'src/types/user';

interface ManagedUserProviderProps {
  children: ReactNode;
  user?: IUser | null;
  setUser?: (user: IUser) => void;
  managed?: boolean;
}
const UserContext = createContext<
  Omit<ManagedUserProviderProps, 'children'> | undefined
>(undefined);

export function ManagedUserProvider({
  children,
  user = null,
  setUser,
  managed = false,
}: ManagedUserProviderProps) {
  const contextValue = useMemo(
    () => ({ user, setUser, managed }),
    [setUser, user, managed],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export const useManagedUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useManagedUser must be used within a UserProvider');
  }
  return context;
};
