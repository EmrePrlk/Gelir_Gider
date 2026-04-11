import { create } from 'zustand';

import { type IUser, type IUserListResponse } from 'src/types/user';

type IFilters = Partial<IUser> & { search?: string };

type UserListStore = {
  filters: IFilters;
  canReset: boolean;

  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;

  setFilters: (filters: IFilters) => void;
  resetFilters: () => void;

  setPagination: (pagination: IUserListResponse) => void;
  changePage: (page: number) => void;
};

const initialFilters: IFilters = {
  type_of_user: null,
  status: undefined,
  search: '',
};

export const useUserListStore = create<UserListStore>(set => ({
  filters: initialFilters,
  canReset: false,
  page: 1,
  limit: 0,
  totalPages: 1,
  totalResults: 0,

  setFilters: newFilters =>
    set(state => {
      const updatedFilters = { ...state.filters, ...newFilters };
      return {
        filters: updatedFilters,
        canReset:
          JSON.stringify(updatedFilters) !== JSON.stringify(initialFilters),
      };
    }),
  resetFilters: () =>
    set({
      filters: initialFilters,
      canReset: false,
    }),
  setPagination: pagination =>
    set({
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages,
      totalResults: pagination.totalResults,
    }),
  changePage: newPage => set({ page: newPage }),
}));
