'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { type Status } from 'src/definitions';
import { AuthStatus, useAuthStore } from 'src/stores/auth-store';

type Props = {
  children: React.ReactNode;
  allowedStatuses: Status[];
  redirectPath: string;
};

export default function StatusGuard({
  children,
  allowedStatuses,
  redirectPath,
}: Props) {
  const router = useRouter();
  const [authStatus, user] = useAuthStore(state => [
    state.authStatus,
    state.user,
  ]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (
      authStatus === AuthStatus.Authorized &&
      user &&
      allowedStatuses.includes(user.status)
    ) {
      setChecked(true);
    } else {
      router.replace(redirectPath);
    }
  }, [allowedStatuses, authStatus, redirectPath, router, user]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
