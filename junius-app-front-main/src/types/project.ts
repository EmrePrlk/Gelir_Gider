import { type ProjectStatus } from 'src/definitions/project-status';
import { type IPreferedTitle } from 'src/definitions/prefered-titles';

import { type IIdeaDetail } from './idea';
import type { PaginationRequest, PaginationResponse } from './pagination';

// PROJECT
export type IProjectReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  helpful: number;
  avatarUrl: string;
  isPurchased: boolean;
  attachments?: string[];
  postedAt: Date;
};

export type IProject = {
  id: number;
  title: string;
  summary: string;
  detail: string;
  status: ProjectStatus;
  idea_id?: number;
  estimated_complete_date?: string;
  entry_date?: string;
  category?: string;

  // Generated fields
  staff_role_id?: number;
  interested?: boolean;
  interestedId?: number;
  staffTitle?: IPreferedTitle;
  staffTitleId?: number;
  idea?: IIdeaDetail;
};

export type IProjectListResponse = PaginationResponse<IProject>;
export type IProjectListRequest = Partial<PaginationRequest & IProject>;
