'use client';

import { useMemo } from 'react';

import { Stack } from '@mui/system';
import { Button, Checkbox, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import SplashWrapper from 'src/components/loading-screen/splash-wrapper';

import { type IRoleGroup } from 'src/types/role-group';

import RoleConfirmationDialog from './permissions-confirmation-dialog';
import {
  usePermissions,
  type IPermissionWithSelected,
} from '../_hooks/use-permissions';

interface RoleFormProps {
  roleGroup: IRoleGroup;
}

interface IPermissionGroup {
  subject: string;
  permissions: IPermissionWithSelected[];
}

function groupPermissions(
  permissions: IPermissionWithSelected[],
): IPermissionGroup[] {
  const groupedPermissions: Record<string, IPermissionWithSelected[]> = {};

  permissions.forEach(permission => {
    const subject = permission.codename.split('_')[1];
    if (!subject) return;

    if (!groupedPermissions[subject]) {
      groupedPermissions[subject] = [];
    }
    groupedPermissions[subject].push(permission);
  });

  return Object.entries(groupedPermissions).map(([subject, perms]) => ({
    subject,
    permissions: perms,
  }));
}

export default function RoleForm({ roleGroup }: RoleFormProps) {
  const confirmationDialog = useBoolean();

  const {
    permissions,
    handlePermissionChange,
    handleSubmit,
    isSubmitting,
    isLoading,
    isChanged,
    resetPermissions,
  } = usePermissions(roleGroup.id);

  const groupedPermissions = useMemo(
    () => groupPermissions(permissions ?? []),
    [permissions],
  );

  const actionOrder = ['view', 'add', 'change', 'delete'];

  return (
    <SplashWrapper
      isLoading={isLoading}
      animation="animation"
      sx={{
        height: '50vh',
      }}
    >
      <Stack spacing={2}>
        {groupedPermissions.map((group, index) => (
          <Stack
            key={group.subject}
            spacing={1}
            sx={{
              width: '100%',
              borderBottom:
                index === groupedPermissions.length - 1
                  ? 'none'
                  : '1px solid #DFE3E8',
              pb: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: { xs: 'flex-start', sm: 'space-between' },
              alignItems: { xs: 'flex-start', sm: 'center' },
            }}
          >
            <Typography
              variant="body1"
              sx={{
                textTransform: 'capitalize',
                fontWeight: {
                  xs: 'bold',
                  md: '600',
                },
              }}
            >
              {group.subject}
            </Typography>
            <Stack
              direction="row"
              flexWrap="wrap"
              sx={{
                gap: { xs: 1, sm: 2 },
                justifyContent: 'space-between',
                alignSelf: {
                  xs: 'flex-start',
                  sm: 'flex-end',
                },
                maxWidth: {
                  xs: '100%',
                  sm: 'calc(50% - 4px)',
                },
              }}
            >
              {actionOrder.map(action => (
                <Stack
                  key={action}
                  direction="row"
                  alignItems="center"
                  sx={{
                    flex: { xs: '0 0 calc(50% - 4px)', sm: '0 0 auto' },
                    justifyContent: 'flex-start',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ mr: 1, minWidth: '50px' }}
                    textTransform="capitalize"
                  >
                    {action}
                  </Typography>
                  <Checkbox
                    disabled={isSubmitting}
                    color="primary"
                    checked={group.permissions.some(
                      p => p.codename.startsWith(`${action}_`) && p.selected,
                    )}
                    onChange={e => {
                      group.permissions.forEach(p => {
                        if (p.codename.startsWith(`${action}_`)) {
                          handlePermissionChange(p.id, e.target.checked);
                        }
                      });
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          </Stack>
        ))}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}
        >
          <Button
            variant="outlined"
            onClick={resetPermissions}
            disabled={isSubmitting || !isChanged}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmationDialog.onTrue}
            disabled={isSubmitting || !isChanged}
          >
            Submit
          </Button>
        </Stack>
        <RoleConfirmationDialog
          open={confirmationDialog.value && isChanged}
          handleClose={confirmationDialog.onFalse}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </Stack>
    </SplashWrapper>
  );
}
