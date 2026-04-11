import { secureApi } from 'src/services/instance';

import { type IRoleGroup, type IPermission } from 'src/types/role-group';

/**
 * Updates the permissions of a role.
 * @param {number} roleId - The ID of the role to update.
 * @param {IPermission[]} permissions - The permissions to update.
 * @returns {Promise<IRoleGroup>} The updated role.
 */
export const updateRolePermissions = async (
  roleId: number,
  permissions: IPermission[],
): Promise<IRoleGroup> => {
  // TODO: Backend needs to update this endpoint, refactor this after
  const permissionIds = permissions.map(permission => permission.id);
  const response = await secureApi.patch<IRoleGroup>(
    `/accounts/rolegroups/${roleId}/`,
    {
      permissions: permissionIds,
    },
  );
  return response.data;
};
