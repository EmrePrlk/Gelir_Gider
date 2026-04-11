'use client';

import { useInitDefinitions } from 'src/hooks/use-init-definitions';

import AuthGuard from 'src/guards/auth/auth-guard';
import { withAbility } from 'src/lib/casl/with-ability';

function AppLayout({ children }: { children: React.ReactNode }) {
  useInitDefinitions();

  return <AuthGuard>{children}</AuthGuard>;
}

export default withAbility(AppLayout);
