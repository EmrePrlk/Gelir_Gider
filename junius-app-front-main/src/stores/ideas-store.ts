import { create } from 'zustand';

import type { IIdeaFilters, IIdeaListResponse } from 'src/types/idea';

type IdeasStore = {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  filters: IIdeaFilters;

  setPagination: (pagination: IIdeaListResponse) => void;
  setFilters: (filters: IIdeaFilters) => void;
  changePage: (page: number) => void;
};

export const useIdeasStore = create<IdeasStore>(set => ({
  page: 1,
  limit: 0,
  totalPages: 1,
  totalResults: 0,

  filters: {},
  setFilters: filters => set({ filters }),
  setPagination: pagination =>
    set({
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages,
      totalResults: pagination.totalResults,
    }),
  changePage: newPage => set({ page: newPage }),
}));
