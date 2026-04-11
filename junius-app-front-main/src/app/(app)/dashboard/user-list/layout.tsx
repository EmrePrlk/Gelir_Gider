'use client';

import withPermissionCheck from 'src/lib/casl/with-permission-check';

function UserListLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withPermissionCheck(UserListLayout, 'create', 'customuser');
