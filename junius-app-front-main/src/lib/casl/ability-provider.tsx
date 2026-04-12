'use client';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useContext, createContext, type ReactNode } from 'react';

import { useAuthStore } from 'src/stores/auth-store';

import { defineAbilityFor } from './ability';
import { type IAppAbility } from './ability';
import { AbilityContext } from './ability-context';
import { getPermissions } from './ability-service';

interface AbilityProviderProps {
  children: ReactNode;
}

interface AbilityContextValue {
  ability: IAppAbility;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

const AbilityStateContext = createContext<AbilityContextValue | null>(null);

async function getAbility(id: number) {
  const permissions = await getPermissions(id);
  const ability = defineAbilityFor(permissions ?? []);
  return ability;
}

export function AbilityProvider({ children }: AbilityProviderProps) {
  const [user] = useAuthStore(state => [state.user]);

  const {
    data: ability,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['ability'],
    queryFn: () => getAbility(user?.type_of_user!),
    enabled: !!user && !!user.type_of_user,
  });

  const defaultAbility = useMemo(() => defineAbilityFor([]), []);

  const contextValue: AbilityContextValue = useMemo(
    () => ({
      ability: ability ?? defaultAbility,
      isLoading,
      isError,
      error,
    }),
    [ability, defaultAbility, isLoading, isError, error],
  );

  return (
    <AbilityStateContext.Provider value={contextValue}>
      <AbilityContext.Provider value={ability ?? defaultAbility}>
        {children}
      </AbilityContext.Provider>
    </AbilityStateContext.Provider>
  );
}

export function useAbilityState() {
  const context = useContext(AbilityStateContext);
  if (!context) {
    throw new Error('useAbilityState must be used within an AbilityProvider');
  }
  return context;
}
