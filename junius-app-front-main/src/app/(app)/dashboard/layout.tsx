'use client';
import { paths } from 'src/config/paths';
import { Status } from 'src/definitions';
import DashboardLayout from 'src/layouts/dashboard';
import StatusGuard from 'src/guards/auth/status-guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Readonly<Props>) {
  return (
    <StatusGuard
      allowedStatuses={[Status.ACTIVE]}
      redirectPath={paths.landing.root}
    >
      <DashboardLayout>{children}</DashboardLayout>
    </StatusGuard>
  );
}
