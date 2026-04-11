'use client';
import { useSnackbar } from 'notistack';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getPermissions } from 'src/lib/casl/ability-service';
import { updateRolePermissions } from 'src/app/(app)/dashboard/su/permissions/_services/permissions';

import { type IPermission } from 'src/types/role-group';

export interface IPermissionWithSelected extends IPermission {
  selected: boolean;
}

async function getPermissionsManagement(
  roleGroupId: number,
): Promise<IPermissionWithSelected[]> {
  const permissions = (await getPermissions(roleGroupId)) ?? [];
  const superAdminPermissions = (await getPermissions(5)) ?? [];

  const uniquePermissions = new Map<number, IPermissionWithSelected>();

  superAdminPermissions.forEach(permission => {
    uniquePermissions.set(permission.id, { ...permission, selected: false });
  });

  permissions.forEach(permission => {
    uniquePermissions.set(permission.id, { ...permission, selected: true });
  });

  return [...uniquePermissions.values()];
}

export function usePermissions(roleGroupId?: number) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [permissions, setPermissions] = useState<IPermissionWithSelected[]>([]);

  const { data: fetchedPermissions, isLoading } = useQuery({
    queryKey: ['permissions', roleGroupId],
    queryFn: () => getPermissionsManagement(roleGroupId!),
    enabled: !!roleGroupId,
  });

  useEffect(() => {
    if (fetchedPermissions) {
      setPermissions(fetchedPermissions);
    }
  }, [fetchedPermissions]);

  const updatePermissions = useMutation({
    mutationFn: (data: IPermissionWithSelected[]) => {
      const filteredPermissions = data.filter(
        permission => permission.selected,
      );
      const removeSelectedProp = filteredPermissions.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        ({ selected, ...rest }) => rest,
      );
      return updateRolePermissions(roleGroupId!, removeSelectedProp);
    },
    onSuccess: () => {
      enqueueSnackbar('Permissions updated successfully', {
        variant: 'success',
      });
      return queryClient.invalidateQueries({
        queryKey: ['permissions', roleGroupId],
      });
    },
    onError: error => enqueueSnackbar(error.message, { variant: 'error' }),
  });

  const handlePermissionChange = useCallback(
    (id: number, selected: boolean) => {
      setPermissions(prevPermissions =>
        prevPermissions.map(permission =>
          permission.id === id ? { ...permission, selected } : permission,
        ),
      );
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    updatePermissions.mutate(permissions);
  }, [permissions, updatePermissions]);

  const resetPermissions = useCallback(() => {
    if (fetchedPermissions) {
      setPermissions(fetchedPermissions);
    }
  }, [fetchedPermissions]);

  const isChanged = useMemo(
    () => JSON.stringify(permissions) !== JSON.stringify(fetchedPermissions),
    [permissions, fetchedPermissions],
  );

  return {
    permissions,
    isChanged,
    isLoading,
    isSubmitting: updatePermissions.isPending,
    handlePermissionChange,
    handleSubmit,
    resetPermissions,
  };
}
