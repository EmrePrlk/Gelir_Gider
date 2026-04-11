import { secureApi } from './instance';

export const updateDeveloper = async (data: FormData, id: number) => {
  const response = await secureApi.patch<FormData>(
    `/accounts/user/${id}/`,
    data,
  );
  return response.data;
};
