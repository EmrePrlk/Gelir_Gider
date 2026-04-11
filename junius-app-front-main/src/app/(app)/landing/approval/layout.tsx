import { paths } from 'src/config/paths';
import { Status } from 'src/definitions';
import StatusGuard from 'src/guards/auth/status-guard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StatusGuard
      allowedStatuses={[Status.PENDING, Status.REJECTED, Status.SUSPENDED]}
      redirectPath={paths.landing.root}
    >
      {children}
    </StatusGuard>
  );
}
