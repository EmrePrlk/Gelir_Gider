import type { IPreferedTitle } from 'src/definitions';

import type { IRoleGroup } from 'src/types/role-group';
import type { PaginationResponse } from 'src/types/pagination';

import { secureApi } from './instance';

/**
 * Get all role groups
 * @returns {PaginationResponse<IRoleGroup>} The role groups
 */
export const getRoleGroups = async (): Promise<
  PaginationResponse<IRoleGroup>
> => {
  const { data } = await secureApi.get<PaginationResponse<IRoleGroup>>(
    '/accounts/rolegroups/',
  );
  return data;
};

/**
 * Get all titles
 * @returns {PaginationResponse<ITitle>} The titles
 * @deprecated We are not using this for now, use getPreferedTitleExperiences instead from store
 */
export const getTitles = async (): Promise<
  PaginationResponse<IPreferedTitle>
> => {
  const { data } = await secureApi.get<PaginationResponse<IPreferedTitle>>(
    '/accounts/titles/?limit=1000',
  );
  return data;
};
