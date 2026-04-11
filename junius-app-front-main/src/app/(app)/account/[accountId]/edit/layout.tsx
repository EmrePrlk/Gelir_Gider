'use client';

import withPermissionCheck from 'src/lib/casl/with-permission-check';

function AccountEditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withPermissionCheck(AccountEditLayout, 'update', 'customuser');
