import type { Status, RoleGroupEnum } from 'src/definitions';

import type { PaginationRequest, PaginationResponse } from './pagination';

export type IUserId = {
  user_id: number;
};

// USER
export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  type_of_user: RoleGroupEnum | null;
  title: number | null;
  title_experience: string | null;
  prefered_title: string | null;
  prefered_title_experience: string | null;
  education_level: number | null;
  title_project: string;
  description_project: string;
  competitors_project: string;
  documents_project: string | null;
  interested_areas: string;
  about_me: string | null;
  cv_link: File | string | null;
  status: Status;
  profile_picture: File | string | null;
  is_public_profile: string;
  country: string;
  state_region: string;
  city: string;
  address: string;
  zip_code: string;
  company: string;
  investment_amount: number | null;
  sector: string;
  region: string;
  connection: string;
  facebook_link?: string | null;
  instagram_link?: string | null;
  linkedin_link?: string | null;
  twitter_link?: string | null;
  github_link?: string | null;
}

export type IUserListResponse = PaginationResponse<IUser>;
export type IUserListRequest = Partial<PaginationRequest & IUser>;

// SOCIAL LINK
export type IUserSocialLink = Pick<
  IUser,
  | 'facebook_link'
  | 'instagram_link'
  | 'linkedin_link'
  | 'twitter_link'
  | 'github_link'
>;

// EXPERIENCE
export type IUserExperience = {
  id: number;
  user_id: number;
  company_name: string;
  start_date: string;
  end_date?: string | null;
  title_id?: number | null;
  description?: string | null;
};

export type IUserExperienceListResponse = PaginationResponse<IUserExperience>;
export type IUserExperienceListRequest = Partial<PaginationRequest & IUserId>;

// CERTIFICATE
export type IUserCertificate = {
  id: string;
  user_id: string;
  name: string;
  detail: string;
  hours: number;
  expiration_date: string;
};

export type IUserCertificateListResponse = PaginationResponse<IUserCertificate>;
export type IUserCertificateListRequest = Partial<PaginationRequest & IUserId>;

// NOTES

export type IUserNote = {
  id: number;
  user_id: number;
  note_owner_user_id: number;
  note_date: string;
  note_detail: string;
};

export type IUserNotePost = Omit<IUserNote, 'id'>;
export type IUserNoteListResponse = PaginationResponse<IUserNote>;
export type IUserNoteListRequest = Partial<PaginationRequest & IUserId>;
