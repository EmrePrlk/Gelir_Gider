import type { PaginationRequest, PaginationResponse } from './pagination';

export type IInterestedProject = {
  id: number;
  project_id: number;
  user_id: number;
  interestedId?: number;
};

export type IInterestedProjectResponse = PaginationResponse<IInterestedProject>;
export type IInterestedProjectRequest = Partial<
  PaginationRequest & IInterestedProject
>;
