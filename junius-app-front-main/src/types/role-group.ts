import { type PaginationResponse } from './pagination';

export type IPermission = {
  id: number;
  name: string;
  codename: string;
};

export interface IRoleGroup {
  id: number;
  name: string;
  description: string;
  icon: React.ElementType;
  link: string;
  isHidden?: boolean;
  permissions?: IPermission[];
}

export type IRoleGroupResponse = PaginationResponse<IRoleGroup>;
