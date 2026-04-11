'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { me } from 'src/services/auth';
import { paths } from 'src/config/paths';
import { AuthStatus, useAuthStore } from 'src/stores/auth-store';

import { LoadingScreen } from 'src/components/loading-screen';

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const [authStatus, setUser, signOut] = useAuthStore(state => [
    state.authStatus,
    state.setUser,
    state.signOut,
  ]);

  const { isLoading, refetch } = useQuery({
    queryKey: ['me'],
    queryFn: () => me(),
    enabled: false,
    retry: false,
    staleTime: 0,
  });

  const handleAuthState = useCallback(async () => {
    if (authStatus === AuthStatus.NotInitialized) {
      const result = await refetch();
      if (result.data) {
        setUser(result.data);
      } else {
        signOut();
      }
    } else if (authStatus === AuthStatus.Unauthorized) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();
      router.replace(`${paths.auth.login}?${searchParams}`);
    }
  }, [authStatus, refetch, router, setUser, signOut]);

  useEffect(() => {
    void handleAuthState();
  }, [handleAuthState]);

  if (authStatus === AuthStatus.NotInitialized || isLoading) {
    return <LoadingScreen />;
  }

  if (authStatus === AuthStatus.Unauthorized) {
    return null;
  }

  return <>{children}</>;
}
