import { serializeParams } from 'src/utils/serialize-params';

import type { IProject } from 'src/types/project';
import type {
  IProjectStaffListRequest,
  IProjectStaffListResponse,
} from 'src/types/project-staff';
import type {
  IUser,
  IUserListRequest,
  IUserListResponse,
  IUserNoteListRequest,
  IUserNoteListResponse,
  IUserExperienceListRequest,
  IUserExperienceListResponse,
  IUserCertificateListRequest,
  IUserCertificateListResponse,
} from 'src/types/user';

import { secureApi } from './instance';

/**
 * Get user list
 * @param {IUserListRequest} data - User list request
 * @returns {Promise<IUserListResponse>} User list response
 */
export const getUsers = async (
  data: IUserListRequest,
): Promise<IUserListResponse> => {
  const response = await secureApi.get<IUserListResponse>(
    `/accounts/alluser/${serializeParams(data)}`,
  );
  return response.data;
};

/**
 * Get user by id
 * @param {number} id - User ID
 * @returns {Promise<IUser>} User
 */
export const getUserById = async (id: number): Promise<IUser> => {
  const response = await secureApi.get<IUser>(`/accounts/user/${id}/`);
  return response.data;
};

/**
 * Update user
 * @param {number} id - User ID
 * @param {Partial<IUser>} data - User data
 * @returns {Promise<IUser>} Updated user
 */
export const updateUser = async (
  id: number,
  data: Partial<IUser>,
): Promise<IUser> => {
  const response = await secureApi.patch<IUser>(`/accounts/user/${id}/`, data);
  return response.data;
};

/**
 * Define user
 * @param {number} id - User ID
 * @param {Partial<IUser>} data - User data
 * @returns {Promise<IUser>} Updated user
 */
export const defineUser = async (
  id: number,
  data: FormData,
): Promise<IUser> => {
  const response = await secureApi.patch<IUser>(`/accounts/user/${id}/`, data);
  return response.data;
};

/**
 * Delete user
 * @param {number} id - User ID
 */
export const deleteUser = async (id: number): Promise<void> => {
  await secureApi.delete(`/accounts/user/${id}/`);
};

// Experience

/**
 * Get user experience
 * @param {IUserExperienceListRequest} data - User experience list request
 * @returns {Promise<IUserExperienceListResponse>} User experience list response
 */
export const getUserExperiences = async (
  data: IUserExperienceListRequest,
): Promise<IUserExperienceListResponse> => {
  const experienceResponse = await secureApi.get<IUserExperienceListResponse>(
    `/accounts/userexperience/${serializeParams(data)}`,
  );
  return experienceResponse.data;
};

// Certificate

/**
 * Get user certificate
 * @param {IUserCertificateListRequest} data - User certificate list request
 * @returns {Promise<IUserCertificateListResponse>} User certificate list response
 */
export const getUserCertificates = async (
  data: IUserCertificateListRequest,
): Promise<IUserCertificateListResponse> => {
  const certificateResponse = await secureApi.get<IUserCertificateListResponse>(
    `/accounts/usercertificate/${serializeParams(data)}`,
  );
  return certificateResponse.data;
};

// Project

/**
 * Get user project
 * @param {IProjectStaffListRequest} data - User project list request
 * @returns {Promise<IProject[]>} User project list response
 */
export const getUserProjects = async (
  data: IProjectStaffListRequest,
): Promise<IProject[]> => {
  // get project staff by user id
  const projectStaffResponse = await secureApi.get<IProjectStaffListResponse>(
    `/business/projectstaff/${serializeParams(data)}`,
  );

  // then get all projects by projectid
  const projectResponses = await Promise.all(
    projectStaffResponse.data.results.map(async project => {
      const projectResponse = await secureApi.get<IProject>(
        `/business/project/${project.project_id}/`,
      );
      return { ...projectResponse.data, staff_role_id: project.staff_role_id };
    }),
  );

  return projectResponses;
};

// Note

/**
 * Get user note
 * @param {IUserNoteListRequest} data - User note list request
 * @returns {Promise<IUserNoteListResponse>} User note list response
 */
export const getUserNotes = async (
  data: IUserNoteListRequest,
): Promise<IUserNoteListResponse> => {
  const noteResponse = await secureApi.get<IUserNoteListResponse>(
    `/accounts/usernotes/${serializeParams(data)}`,
  );
  return noteResponse.data;
};
