import type { Status, Industry } from 'src/definitions';

import { type IUser } from './user';
import type { PaginationRequest, PaginationResponse } from './pagination';

export interface IIdea {
  id: number;
  title: string;
  summary: string;
  detail: string;
  document_link: string;
  status: Status;
  user_id: number;
  entry_date: string;
  category: Industry;
  possible_competitor: string;
  target_investment: number;
}

export interface IIdeaDetail extends IIdea {
  user?: IUser;
}

export interface IIdeaToProjectRequest {
  idea_id: number;
  title: string;
  summary: string;
  detail: string;
  status: string;
  category: string;
}

export interface IIdeaFilters {
  status?: Status;
}

export type IIdeaListResponse = PaginationResponse<IIdea>;
export type IIdeaListRequest = Partial<PaginationRequest & IIdea>;
