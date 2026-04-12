import type { PaginationRequest, PaginationResponse } from './pagination';

export interface IProjectStaff {
  id: number;
  project_id: number;
  user_id: number;
  user_first_name?: string;
  user_last_name?: string;
  user_profile_picture?: string;
  staff_role_id: number;
  staff_role_name?: string;
}

export type IProjectStaffListResponse = PaginationResponse<IProjectStaff>;
export type IProjectStaffListRequest = Partial<
  PaginationRequest & { project_id: number; user_id: number; staff_role_id: number }
>;

export interface IProjectStaffTitle {
  id: number;
  name?: string;
}
