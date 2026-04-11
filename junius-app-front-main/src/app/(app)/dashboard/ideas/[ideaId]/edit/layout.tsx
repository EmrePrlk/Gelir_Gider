'use client';

import withPermissionCheck from 'src/lib/casl/with-permission-check';

function IdeaEditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withPermissionCheck(IdeaEditLayout, 'update', 'idea');
