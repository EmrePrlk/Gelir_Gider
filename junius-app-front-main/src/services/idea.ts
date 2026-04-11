import { serializeParams } from 'src/utils/serialize-params';

import { Status } from 'src/definitions';

import type {
  IIdeaDetail,
  IIdeaListRequest,
  IIdeaListResponse,
  IIdeaToProjectRequest,
} from 'src/types/idea';

import { getUserById } from './user';
import { secureApi } from './instance';

/**
 * Get ideas
 * @param {IIdeaListRequest} data - Idea list request
 * @returns {Promise<IIdeaListResponse>} Idea list response
 */
export const getIdeas = async (
  data: IIdeaListRequest,
): Promise<IIdeaListResponse> => {
  const response = await secureApi.get<IIdeaListResponse>(
    `/business/idea/${serializeParams(data)}`,
  );
  return response.data;
};

/**
 * Get idea
 * @param {number} id - Idea ID
 * @returns {Promise<IIdeaDetail>} Idea detail
 */
export const getIdea = async (id: number): Promise<IIdeaDetail> => {
  const response = await secureApi.get<IIdeaDetail>(`/business/idea/${id}/`);
  return response.data;
};

/**
 * Create idea
 * @param {IIdea} data - Idea data
 * @returns {Promise<IIdeaDetail>} Idea response
 */
export const createIdea = async (data: FormData): Promise<IIdeaDetail> => {
  const response = await secureApi.post<IIdeaDetail>(`/business/idea/`, data);
  return response.data;
};

/**
 * Update idea
 * @param {number} id - Idea ID
 * @param {Partial<IIdeaDetail>} data - Idea data
 * @returns {Promise<IIdeaDetail>} Idea response
 */
export const updateIdea = async (
  id: number,
  data: Partial<IIdeaDetail>,
): Promise<IIdeaDetail> => {
  const response = await secureApi.patch<IIdeaDetail>(
    `/business/idea/${id}/`,
    data,
  );
  return response.data;
};

/**
 * Delete idea
 * @param {number} id - Idea ID
 * @returns {Promise<void>}
 */
export const deleteIdea = async (id: number): Promise<void> =>
  secureApi.delete(`/business/idea/${id}/`);

// ----------------------------------------------------------------------

/**
 * Get idea with user
 * @param {number} id - Idea ID
 * @returns {Promise<IIdeaDetail>} Idea detail
 */
export const getIdeaWithUser = async (id: number): Promise<IIdeaDetail> => {
  const response = await secureApi.get<IIdeaDetail>(`/business/idea/${id}/`);
  const user = response.data.user_id
    ? await getUserById(response.data.user_id)
    : undefined;

  return { ...response.data, user };
};

/**
 * Idea to project
 * @param {IIdeaToProjectRequest} data - Idea to project request
 * @returns {Promise<void>} Idea to project response
 */
export const idea2Project = async (
  data: IIdeaToProjectRequest,
): Promise<void> => {
  await secureApi.post(`/business/project/`, data);
  await updateIdea(data.idea_id, { status: Status.ACTIVE });
};
