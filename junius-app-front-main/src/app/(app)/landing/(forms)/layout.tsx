import { paths } from 'src/config/paths';
import { Status } from 'src/definitions';
import StatusGuard from 'src/guards/auth/status-guard';

import LandingHeader from './_components/landing-header/landing-header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StatusGuard
      allowedStatuses={[Status.INACTIVE]}
      redirectPath={paths.landing.approval}
    >
      <LandingHeader />
      {children}
    </StatusGuard>
  );
}
