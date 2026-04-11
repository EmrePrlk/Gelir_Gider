import RouterLink from 'next/link';

import { Button, Tooltip } from '@mui/material';

import { paths } from 'src/config/paths';

import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function UserListPageHeader() {
  return (
    <CustomBreadcrumbs
      heading="List"
      links={[
        { name: 'Dashboard', href: paths.dashboard.root },
        { name: 'User List', href: paths.dashboard.admin.userList },
      ]}
      action={
        // TODO: Implement this
        <Tooltip title="Coming Soon">
          <span>
            <Button
              disabled
              component={RouterLink}
              href={paths.account.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New User
            </Button>
          </span>
        </Tooltip>
      }
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    />
  );
}
