'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { paths } from 'src/config/paths';
import { AuthStatus, useAuthStore } from 'src/stores/auth-store';

type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams?.get('returnTo') || paths.dashboard.root;
  const [authStatus] = useAuthStore(state => [state.authStatus]);

  useEffect(() => {
    if (authStatus === AuthStatus.Authorized) {
      router.replace(returnTo);
    }
  }, [authStatus, returnTo, router]);

  if (authStatus === AuthStatus.Authorized) return null;

  return <>{children}</>;
}
