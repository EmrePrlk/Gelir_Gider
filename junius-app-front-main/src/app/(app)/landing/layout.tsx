'use client';

import { paths } from 'src/config/paths';
import { Status } from 'src/definitions';
import StatusGuard from 'src/guards/auth/status-guard';
import SimpleLayout from 'src/layouts/simple/simple-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StatusGuard
      allowedStatuses={[
        Status.INACTIVE,
        Status.PENDING,
        Status.REJECTED,
        Status.SUSPENDED,
      ]}
      redirectPath={paths.dashboard.root}
    >
      <SimpleLayout>{children}</SimpleLayout>
    </StatusGuard>
  );
}
