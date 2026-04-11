import type { PaginationRequest, PaginationResponse } from './pagination';

export interface IProjectStaff {
  id: number;
  project_id: number;
  user_id: number;
  staff_role_id: number;
  name?: string;
}

export type IProjectStaffListResponse = PaginationResponse<IProjectStaff>;
export type IProjectStaffListRequest = Partial<
  PaginationRequest & IProjectStaff
>;

export interface IProjectStaffTitle {
  id: number;
  name?: string;
}
