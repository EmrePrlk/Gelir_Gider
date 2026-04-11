'use client';
import { withErrorHandling } from 'src/hoc/with-error-handling';

function DashboardIdeasIdeaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withErrorHandling(DashboardIdeasIdeaLayout);
