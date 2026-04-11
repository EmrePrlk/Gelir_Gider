'use client';
import { useAuthStore } from 'src/stores/auth-store';

import { ManagedUserProvider } from '../_context/use-managed-user';

export default function AccountRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useAuthStore(state => [state.user, state.setUser]);
  return (
    <ManagedUserProvider user={user} setUser={setUser}>
      {children}
    </ManagedUserProvider>
  );
}
