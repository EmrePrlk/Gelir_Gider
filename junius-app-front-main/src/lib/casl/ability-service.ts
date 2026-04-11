import { secureApi } from 'src/services/instance';

import type { IRoleGroup, IPermission } from 'src/types/role-group';

/**
 * Get permissions of role group
 * @param {number} id - The id of the role group
 * @returns {Promise<IPermission[] | undefined>} The role groups
 */
export const getPermissions = async (
  id: number,
): Promise<IPermission[] | undefined> => {
  const { data } = await secureApi.get<IRoleGroup>(
    `/accounts/rolegroups/${id}/`,
  );
  return data?.permissions;
};
