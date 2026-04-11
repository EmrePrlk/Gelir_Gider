'use client';

import withPermissionCheck from 'src/lib/casl/with-permission-check';

function SUView({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withPermissionCheck(SUView, 'create', 'group');
