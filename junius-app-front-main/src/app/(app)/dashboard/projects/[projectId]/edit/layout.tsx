'use client';

import withPermissionCheck from 'src/lib/casl/with-permission-check';

function ProjectEditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withPermissionCheck(ProjectEditLayout, 'update', 'project');
