import { serializeParams } from 'src/utils/serialize-params';

import type {
  IProjectStaffTitle,
  IProjectStaffListResponse,
} from 'src/types/project-staff';

import { secureApi } from './instance';

/**
 * Get staff role for a project and user
 * @param {number} project_id - Project ID
 * @param {number} user_id - User ID
 * @returns {Promise<string>} Array of role data
 */

export const getStaffRole = async (
  project_id: number,
  user_id: number,
): Promise<string | null> => {
  const params = { project_id, user_id };

  const staffResponse = await secureApi.get<IProjectStaffListResponse>(
    `/business/projectstaff/${serializeParams(params)}`,
  );

  const staffRoles =
    staffResponse.data.results?.map(staff => staff.staff_role_id) || [];
  if (staffRoles.length === 0) {
    return null;
  }
  const roleResponses = await Promise.all(
    staffRoles.map(staff_role_id =>
      secureApi.get<IProjectStaffTitle>(`/definitions/title/${staff_role_id}/`),
    ),
  );

  return roleResponses[0]?.data.name || null;
};
