import type { IUserNotePost } from 'src/types/user';

import { secureApi } from './instance';

/**
 * Create a user note
 * @param {IUserNotePost} data - User note data
 */
export const createUserNote = async (data: IUserNotePost) => {
  await secureApi.post('/accounts/usernotes/', data);
};
