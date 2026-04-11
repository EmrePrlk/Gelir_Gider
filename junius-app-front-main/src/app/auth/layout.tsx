'use client';

import GuestGuard from 'src/guards/auth/guest-guard';
import AuthClassicLayout from 'src/layouts/auth/classic';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <AuthClassicLayout title="Welcome to Junius App">
        {children}
      </AuthClassicLayout>
    </GuestGuard>
  );
}
