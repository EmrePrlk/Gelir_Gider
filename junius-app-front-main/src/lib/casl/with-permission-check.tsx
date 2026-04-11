'use client';

import { useRouter } from 'next/navigation';

import { paths } from 'src/config/paths';
import { useAbility } from 'src/lib/casl/use-ability';

import { type Actions, type Subjects } from './ability';

const withPermissionCheck = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  permission: Actions,
  subject: Subjects,
) =>
  function PermissionWrapper(props: P) {
    const ability = useAbility();
    const allowed = ability.can(permission, subject);
    const router = useRouter();

    if (!allowed) {
      router.push(paths.page403);
      return null;
    }

    return <WrappedComponent {...props} />;
  };

export default withPermissionCheck;
