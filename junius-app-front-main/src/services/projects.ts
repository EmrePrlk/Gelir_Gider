import { serializeParams } from 'src/utils/serialize-params';

import type {
  IProject,
  IProjectListRequest,
  IProjectListResponse,
} from 'src/types/project';
import {
  type IInterestedProject,
  type IInterestedProjectResponse,
} from 'src/types/interested-project';

import { secureApi } from './instance';
import { updateIdea, getIdeaWithUser } from './idea';

/**
 * Get project list
 * @param {IProjectListRequest} data - Project list request
 * @returns {Promise<IProjectListResponse>} Project list response
 */
export const getProjects = async (
  data: IProjectListRequest,
): Promise<IProjectListResponse> => {
  const response = await secureApi.get<IProjectListResponse>(
    `/business/project/${serializeParams(data)}`,
  );
  return response.data;
};

/**
 * Update project
 * @param {number} id - Project ID
 * @param {Partial<IProject>} data - Project data
 * @returns {Promise<IProject>} Updated project
 */
export const updateProject = async (
  id: number,
  data: Partial<IProject>,
): Promise<IProject> => {
  const { data: updatedData } = await secureApi.patch<IProject>(
    `/business/project/${id}/`,
    data,
  );
  const idea = data.idea_id
    ? await updateIdea(data.idea_id, {
        target_investment: data?.idea?.target_investment,
      })
    : undefined;

  return { ...updatedData, idea };
};

/**
 * Delete project
 * @param {number} id - Project ID
 */
export const deleteProject = async (id: number): Promise<void> => {
  await secureApi.delete(`/business/project/${id}/`);
};

/**
 * Get interested projects for a user
 * @param {number} userId - User ID
 * @returns {Promise<number[]>} Array of interested project IDs
 */
export const getInterestedProjects = async (
  userId: number,
): Promise<IInterestedProjectResponse> => {
  const { data } = await secureApi.get<IInterestedProjectResponse>(
    `/business/interestedproject/${serializeParams({ user_id: userId, limit: 1000 })}/`,
  );
  return data;
};

/**
 * Get project list with interested projects marked
 * @param {IProjectListRequest} data - Project list request
 * @param {number} userId - User ID
 * @returns {Promise<IProjectListResponse>} Project list response with interested projects marked
 */
export const getProjectsWithInterested = async (
  data: IProjectListRequest,
  userId: number,
): Promise<IProjectListResponse> => {
  const [projects, interestedProjects] = await Promise.all([
    getProjects(data),
    getInterestedProjects(userId),
  ]);
  return {
    ...projects,
    results: projects.results.map(project => {
      const interestedObject = interestedProjects.results.find(
        interestedProject => interestedProject.project_id === project.id,
      );
      return {
        ...project,
        interested: !!interestedObject,
        interestedId: interestedObject?.id,
      };
    }),
  };
};

/**
 * Add project to interested list
 * @param {number} projectId - Project ID
 * @param {number} userId - User ID
 * @returns {Promise<void>}
 */
export const addInterestedProject = async (
  projectId: number,
  userId: number,
): Promise<void> => {
  const data: Omit<IInterestedProject, 'id'> = {
    project_id: projectId,
    user_id: userId,
  };
  await secureApi.post('/business/interestedproject/', data);
};

/**
 * Remove project from interested list
 * @param {number} id - interested project ID
 * @returns {Promise<void>}
 */
export const removeInterestedProject = async (
  id: number | undefined,
): Promise<void> => {
  await secureApi.delete(`/business/interestedproject/${id}/`);
};

/**
 * Get a project by its ID.
 * @param id - The ID of the project to get.
 * @returns The project with the given ID.
 */
export const getProjectById = async (id: number): Promise<IProject> => {
  const { data } = await secureApi.get<IProject>(`/business/project/${id}/`);
  const idea = data.idea_id ? await getIdeaWithUser(data.idea_id) : undefined;
  return { ...data, idea };
};
