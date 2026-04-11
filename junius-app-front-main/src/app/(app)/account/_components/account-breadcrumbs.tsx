import { useManagedUser } from 'src/app/(app)/account/_context/use-managed-user';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function AccountBreadcrumbs() {
  const { user } = useManagedUser();

  return (
    <CustomBreadcrumbs
      heading="Account"
      links={[
        {
          name: 'Account',
        },
        { name: `${user?.first_name} ${user?.last_name}` },
      ]}
      sx={{
        mb: 2,
      }}
    />
  );
}
