'use client';
import { withErrorHandling } from 'src/hoc/with-error-handling';

function DashboardProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withErrorHandling(DashboardProjectsLayout);
